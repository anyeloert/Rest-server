const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

//Google validation

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    const token = req.body.idtoken
    const googleUser = await verify(token)
        .catch(err => {
            if (err) {
                res.status(403).json({
                    ok: false,
                    err
                })
            }
        })

        Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            
            if (usuarioDB) {

                if (usuarioDB.google ){

                    const token = jwt.sign({
                        usuario: usuarioDB
                      }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });

                    res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token 
                    })
                
                }else{
                    res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Debe usar la autenticacion normal'
                        }
                    })
                }
                
            }else{
                console.log(googleUser);
                const usuario = new Usuario({
                    nombre: googleUser.nombre,
                    email: googleUser.email,
                    img: googleUser.img,
                    google: true,
                    contraseña: ':)'
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
            }
        })



})




module.exports = app;