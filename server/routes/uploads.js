const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

// default options
app.use(fileUpload())

/* --- Cargar archivo --- */
app.put('/upload', (req, res)=>{

    if(!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                msg : "No se ha seleccionado ningun archivo"
            }
        })
    }

    let archivo = req.files.archivo

    archivo.mv('uploads/filename.jpg', (err)=>{

        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        return res.json({
            ok: true,
            msg:"file uploaded !"
        })
    })
})

module.exports = app