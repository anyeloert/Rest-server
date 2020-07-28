
const jwt = require('jsonwebtoken');


const autenticacion = (req, res, next) => {
    const token = req.get('token')
    
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        console.log(decoded.usuario.role);
        err ?
            res.status(401).json({
                ok: false,
                err:{
                    message: "Token no válido"
                }
            }) :            
            req.usuario = decoded.usuario
            next()
    })
}

const autenticacionAdmin_Role = (req, res, next) => {
    usuario = req.usuario

    usuario.role !== 'ADMIN_ROLE' ?
        res.status(401).json({
            ok: false,
            err:{
                message: "No esta habilitado para realizar esta accion"
            }
        }) :
        next()

}

module.exports = {
    autenticacion,
    autenticacionAdmin_Role
}