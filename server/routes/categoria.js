const express = require('express')

/* --- Models --- */
const Categoria = require('../models/categoria')

/*--- Middlewares ---*/
const {verificaToken} = require('../middlewares/autentificacion')
const {verificaAdminRole} = require('../middlewares/autentificacion')

const app = express()
/* --- --- Servicios  --- --- */

/* --- Listar categorias --- */
app.get('/categoria',verificaToken, (req, res)=>{
    
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDb)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                Error: err
            })
        }
        
        res.json({
            ok:true,
            categoriasDb,
        })
        
    })
})

/* --- Buscar por  id --- */
app.get('/categoria/:id', verificaToken, (req, res)=>{
    let idCategoria = req.params.id

    Categoria.findById(idCategoria, (err, categoriaDb)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                Error: err
            })
        }

        if(!categoriaDb){
            return res.status(400).json({
                ok: false,
                Error: {
                    msg :"Id no encontrado"
                }
            })
        }

        return res.json({
            ok: true,
            categoria: categoriaDb
        })
    })
})

/* --- Crear categoria --- */
app.post('/categoria', verificaToken, (req, res)=>{
    let body = req.body

    let newCategoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    newCategoria.save((err, categoriaDb)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                Error: err
            })
        }

        if(!categoriaDb){
            return res.status(500).json({
                ok: false,
                Error: err
            })
        }

        res.json({
            ok:true,
            categoria: categoriaDb
        })
    })
})

/* --- Actualizar categoria --- */
app.put('/categoria/:id',[verificaToken], (req, res)=>{

    let id = req.params.id
    let body = {descripcion: req.body.descripcion }

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDb)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                Error: err
            })
        }
        if(!categoriaDb){
            return res.status(401).json({
                ok: false,
                Error: err
            })
        }
        res.json({
            ok:true,
            categoria: categoriaDb
        })
    })
} )

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res)=>{
    let id = req.params.id
    
    Categoria.findByIdAndRemove(id, (err, categoriaDb) => {
        // Error en la base de datos
        if(err){
            return res.status(500).json({
                ok: false,
                Error: err
            })
        }

        // id no encotrado
        if(!categoriaDb){
            return res.status(500).json({
                ok: false,
                Error:{
                    msg: "Id no encontrada"
                }
            })
        }

        return res.json({
            ok:true,
            msg: "Categoria eliminada",
            categoriaRemoved: categoriaDb
        })
    })
})
module.exports = app