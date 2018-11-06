const express = require('express')
const app = express()

const {verificaToken} = require('../middlewares/autentificacion')

const Producto = require('../models/producto')

/* --- Listar Productos --- */
app.get('/productos', verificaToken, (req, res)=>{

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    Producto.find({disponible: true})
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, productosDb)=>{

            if(err){
                return res.status(400).json({
                    ok: false,
                    Error: err
                })
            }
            Producto.count({disponible: true})
                .exec((err, conteo)=>{
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            Error: err
                        })
                    }

                    return res.json({
                        ok: true,
                        products: productosDb,
                        cantidad: conteo
                    })

                })
        })
})

/* --- Buscar por id --- */
app.get('/productos/:id', verificaToken, (req, res)=>{
    let id = req.params.id

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre')
        .exec((err, productoDb)=>{
            if(err){
                return res.status(400).json({
                    ok:false,
                    Error: err
                })
            }

            if(!productoDb){
                return res.status(500).json({
                    ok:false,
                    Error:{
                        msg: "id  no encontrada"
                    }
                })
            }

            res.json({
                ok: true,
                product : productoDb
            })
        })
})

/* --- Buscar por termino --- */
app.get('/productos/buscar/:termino',verificaToken, (req, res)=>{

    let termino = req.params.termino
        regex = new RegExp(termino, 'i')

    Producto.find({nombre: regex, disponible: true})
        .populate('categoria', 'descripcion')
        .exec((err, productosDb)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    Error: err
                })
            }

            return res.json({
                ok:true,
                products: productosDb
            })
        })
})

/* --- Crear producto --- */
app.post('/productos',verificaToken, (req, res)=>{
    let body = req.body

    let newProducto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoriaId,
        usuario: req.usuario._id
    })

    newProducto.save((err, productoDb)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                Error: err
            })
        }

        if(!productoDb){
            return res.status(500).json({
                ok: false,
                Error: err
            })
        }

        return res.json({
            ok:true,
            product : productoDb
        })
    })
})

/* --- Actualizar producto --- */
app.put('/productos/:id',verificaToken, (req, res)=>{
    let id = req.params.id,
        body = {
            nombre: req.body.nombre,
            precioUni: req.body.precioUni,
            usuario: req.usuario._id
        }
    Producto.findByIdAndUpdate(id, body , {new: true, runValidators: true}, (err, productoDb)=>{

        if(err){
            return res.status(400).json({
                ok: false,
                Error: err
            })
        }

        if(!productoDb){
            return res.status(500).json({
                ok: false,
                Error: {
                    msg:"id no encontrada"
                }
            })
        }

        return res.json({
            ok:true,
            productoActualizado : productoDb
        })
    })
})

/* --- Eliminar (disponible : false) productos --- */
app.delete('/productos/:id', verificaToken, (req, res)=>{
    let id  = req.params.id,
        disponible = {disponible: false}

    Producto.findByIdAndUpdate(id, disponible, (err, productoDb)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                Error: err
            })
        }

        if(!productoDb){
            return res.status(500).json({
                ok: false,
                Error: {
                    msg:"id no encontrada"
                }
            })
        }

        return res.json({
            ok:true,
            productoDesactivado : productoDb
        })
    })

})

module.exports = app