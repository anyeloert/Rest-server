

const mongoose = require('mongoose')
const unique_validator = require('mongoose-unique-validator')

const rolesvalidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

const Schema = mongoose.Schema

const usuarioSquema = new Schema({
    nombre :{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email :{
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true
    },
    contraseña :{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesvalidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})


usuarioSquema.methods.toJSON = function(){
    let user = this
    let userObject = user.toObject()
    delete userObject.contraseña

    return userObject
}

usuarioSquema.plugin(unique_validator, {message: '{PATH} ya esta en uso'})

module.exports = mongoose.model('Usuario', usuarioSquema)