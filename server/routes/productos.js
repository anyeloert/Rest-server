const express = require('express')

const _ = require('underscore')

const app = express()


const Producto = require('../models/137 producto')
const Categoria = require('../models/categoria')

const {autenticacion} = require('../middlewares/autenticacion')

const options = {
    new: true,
    runValidators: true
}


app.get('/productos', autenticacion, (req, res) => {
    const desde = Number(req.query.desde) || 0
    const limit = Number(req.query.limit) || 5
    
    const options = {
        skip: desde,
        limit 
    }

    const proyection = 'nombre precioUni descripcion categoria usuario'



    Producto.find({disponible: true}, proyection, options)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec ((err, productosDB) => {
        err 
            ? res.status(400).json({
                ok: false,
                err
            })
            : Producto.count({}, (err, count) => {
                console.log(productosDB);
                res.json({
                    ok:true,
                    productos: productosDB,
                    Total_Registros: count
                })
            })
    })
})


app.get('/producto/:id',  autenticacion, (req, res) => {
    const id = req.params.id

    Producto.findById(id, (err, producto)=> {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            producto
        })

    })

})


app.get('/producto/buscar/:termino',  (req, res) => {
    const termino = req.params.termino

    const regExp = new RegExp(termino, 'i')

    Producto.find({nombre: regExp})
    .populate('categoria', 'nombre')
    .exec((err, productosDB) => {

        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            producto: productosDB
        })

    })


})

app.post('/producto', autenticacion, (req, res) => {

    const body = req.body
    const id = req.usuario._id

    Categoria.findOne({descripcion: body.categoria}, (err, categoriaDB) => {

       if(err) {
           return res.status(500).json({
               ok: false,
               err
           })
       }

       if(!categoriaDB) {
           return res.status(400).json({
               ok: false,
               err: {
                   message: "La categoría no existe"
               }
           })
       }

       const producto = new Producto({
           nombre: body.nombre,
           precioUni: body.precio_unitario,
           descripcion: body.descripcion,
           categoria: categoriaDB.id,
           usuario: id
           
       })

       producto.save((err, productoDB) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            producto: productoDB
        })
       })



    })

})

app.put('/producto/:id',autenticacion ,(req, res) => {

    const id = req.params.id
    const body = req.body

    
    Categoria.findOne({descripcion: body.categoria}, (err, categoriaDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
 
        if(!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "La categoría no existe"
                }
            })
        }
 
        const keys = ['nombre', 'precioUni', 'descripcion']
    
        const bodyF = _.pick(req.body, keys)
        bodyF.categoria = categoriaDB.id
    
        Producto.findByIdAndUpdate(id, bodyF, options, (err, productoDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
    
            res.json({
                ok: true,
                productoDB
            })
        })
     })

})

app.delete('/producto/:id', autenticacion, (req, res) => {
    const id = req.params.id

    Producto.findByIdAndUpdate(id, {disponible: false}, options, (err, productoDeleted) => {
        err ?
            res.status(200).json({
                ok: false,
                err
            }) :
            res.json({
                ok: true,
                productoDeleted
            })
    })
  
})





module.exports = app;