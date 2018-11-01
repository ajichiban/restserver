/*--- Model ---*/
const Usuario = require('../models/usuario')

/*--- Packages ---*/
const bcrypt = require('bcrypt-nodejs')
const express = require('express')
const _ = require('underscore')

/*--- Middlewares ---*/
const {verificaToken} = require('../middlewares/autentificacion')
const {verificaAdminRole} = require('../middlewares/autentificacion')
const app = express()

/*--- Home / ---*/
app.get('/',(req,res)=>{
    res.json('hello world Local')
})

/*--- Listar users ---*/
app.get('/usuario', verificaToken, (req, res)=>{

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)


    Usuario.find({estado: true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios)=>{

                if (err){
                    return res.status(400).json({
                        ok:false,
                        Error: err
                    })
                }

                // .count  => cantidad de registros (usar el mismo paramentro que se
                //  use en .find...() )
                Usuario.count({estado: true}, (err, conteo)=>{
                   res.json({
                        ok:true,
                        usuarios,
                        cuantos: conteo
                        /*cuantos: usuarios.length  Alternative*/
                    }) 
                })

                
            })
})

/*--- Create user ---*/
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res)=> {

    let body = req.body

    let user = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password),
        role: body.role
    })

    user.save((err, userDb)=>{
        if (err){
            return res.status(400).json({
                ok:false,
                Error: err
            })
        } 

        res.json({
            ok: true,
            user: userDb
        })
    })
})

/*--- Update user ---*/
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res)=> {
    let id = req.params.id
    // .pick metodo de underscore
    let body = _.pick(req.body, ['nombre','email','role','img','estado']) 

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDb)=>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDb
        })
    })
    
})

/*--- Delete user ---*/
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req,res)=>{

    let id = req.params.id
    
    let estado = {estado: false}

    Usuario.findByIdAndUpdate(id, estado, {new: true}, (err, userDb)=>{
        if (err){
            res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok: true,
            userDb
        })
    })

    // Borrar un usuraio de la base de  dato 
    /*Usuario.findByIdAndRemove(id, (err, userRemoved)=>{

        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!userRemoved){
            return res.status(400).json({
                ok: false,
                err: {
                    msg: "user not found !"
                }
            })
        }

        res.json({
            ok: true,
            userRemoved
        })
    })*/
})

module.exports = app