const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const Usuario = require('../models/users')

const app = express()


const options = {
    new: true,
    runValidators: true
}


app.get('/usuario', (req, res) => {
    const desde = Number(req.query.desde) || 0
    const limit = Number(req.query.limit) || 5
    
    const options = {
        skip: desde,
        limit 
    }

    const proyection = 'nombre email img role estado google'



    Usuario.find({estado: true}, proyection, options, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Usuario.count({estado: true}, (err, count) => {

            res.json({
                ok: true,
                usuarioDB,
                total_registros: count
            })
        })

    })
})


app.put('/usuario/:id', (req, res) => {
    const id = req.params.id
   

    const keys = ['role', 'estado', 'nombre', 'email', 'img']

    const bodyF = _.pick(req.body, keys)

    Usuario.findByIdAndUpdate(id, bodyF, options, (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })
    })
})




app.post('/usuario', (req, res) => {
    const body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        contraseña: bcrypt.hashSync(body.contraseña, 10),
        role: body.role,
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
       


        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
    
})

app.delete('/usuario/:id', (req, res) => {
    const id = req.params.id

    Usuario.findByIdAndUpdate(id, {estado: false}, options, (err, usuarioDeleted) => {
        err ?
            res.status(200).json({
                ok: false,
                err
            }) :
            res.json({
                ok: true,
                usuarioDeleted
            })
    })

    // Usuario.findByIdAndRemove(id, (err, usuairoDeleted) => {

    //     !usuairoDeleted ? 
    //         res.status(400).json({
    //             ok: false,
    //             err: 'El usuario no existe'
    //         }) : null

    //     err ? res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //         :  res.json({
    //             ok: true,
    //             usuario: usuairoDeleted
    //         })

        
    // })
})

module.exports = app;