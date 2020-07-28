const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const Usuario = require('../models/users')

const app = express()


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        // Error en el servidor
        if (err){
            return res.status(500).json({
                ok: false,
                err
        })}

        //El usuario no existe
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                }
            }) 
        }

        const token = jwt.sign({
            usuario: usuarioDB
          }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

        //contraseña invalida
        !bcrypt.compareSync(body.contraseña, usuarioDB.contraseña) ?
            res.status(400).json({
                ok: false,
                err: {
                    message: 'contraseña invalida'
                }
            }) :
            res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })

    })    
})




module.exports = app;