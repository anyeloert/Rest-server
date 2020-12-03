const express = require('express')

const app = express()

const Categoria = require('../models/categoria')

const {autenticacion, autenticacionAdmin_Role} = require('../middlewares/autenticacion')

app.get('/categorias', autenticacion, (req, res) => {

    Categoria.find({}, (err, categoriasDB) => {
        err 
            ? res.status(400).json({
                ok: false,
                err
            })
            : Categoria.count({}, (err, count) => {

                res.json({
                    ok:true,
                    categorias: categoriasDB,
                    Total_Registros: count
                })
            })
    })
})

app.get('/categoria/:id', (req, res) => {
    const {id} = req.params


    Categoria.findById(id, autenticacion, (err, categoriaDB) => {
        err 
            ? res.status(400).json({
                ok:false,
                err
            })
            : res.json({
                ok:true,
                categoria: categoriaDB
            })
    })
})

app.post('/categoria', autenticacion, (req, res) => {

    const id = req.usuario._id
    const body = req.body

    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id
    })

    categoria.save((err, usuarioDB) => {
        err 
            ? res.status(500).json({
                ok: false,
                err
            })
            : !usuarioDB 
                ? res.status(500).json({
                    ok: false,
                    err
                })
                : res.json({
                    ok:true,
                    usuario: usuarioDB
            })

    })
})

app.put('/categoria/:id', autenticacion, (req, res) => {

    const descripcion = req.body.descripcion
    const id = req.params.id

    const options = {
        new: true,
        runValidators: true
    }


    Categoria.findByIdAndUpdate(id, {descripcion} , options, (err, usuarioActualizado) => {

        err 
            ? res.status(500).json({
                ok: false,
                err
            })
            : !usuarioDB 
                ? res.status(500).json({
                    ok: false,
                    err
                })
                : res.json({
                    ok:true,
                    usuario: usuarioDB
            })
    })

})

app.delete('/categoria/:id', [autenticacion, autenticacionAdmin_Role], (req, res) =>{
    const {id} = req.params

    Categoria.findByIdAndRemove(id, (err, categoriaDB) =>{
        err 
            ? res.status(500).json({
                ok: false,
                err
            })
            : !usuarioDB 
                ? res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Categoria no existe'
                    }
                })
                : res.json({
                    ok:true,
                    message: 'Categoria ELiminada'
            })
    })
})

module.exports = app;