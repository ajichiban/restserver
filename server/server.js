/*--- Load Config ---*/
require('./config/config')

/*--- Modules ---*/
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()


/*--- BodyParser's Config ---*/
/*  parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: false }))
/* parse application/json */
app.use(bodyParser.json())

/*--- Habilitar Carpeta Public ---*/
app.use(express.static(path.resolve(__dirname, '../public/')))

/*--- Routes  Global Config---*/
app.use(require('./routes/index'))

/*--- --- Conexion a la base de datos --- ---*/
mongoose.connect(process.env.URLDB, (err, res)=>{
    if (err) throw err
    console.log('base de datos online')
})

/*--- Running Server ---*/
app.listen(process.env.PORT, ()=> {
    console.log(`running in ${process.env.PORT} port`)
})