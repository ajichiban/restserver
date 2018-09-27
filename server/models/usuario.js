const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema
let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE','VISIT_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'el nombre es requerido']
    },
    email:{
        type: String,
        unique: true,
        required:[true, 'el email es necesario']
    },
    password:{
        type: String,
        required: [true, 'el pasword es obligatorio']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
})

/*--- Quitando el pasword del objeto  ---*/
usuarioSchema.methods.toJSON = function(){
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}

/*--- Validando email ---*/
usuarioSchema.plugin(uniqueValidator, {
    message:'{PATH} debe ser unico'
})

module.exports = mongoose.model('Usuario', usuarioSchema)

