require('./config/config')


const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = process.env.PORT



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//configuracion de rutas
app.use(require('./routes/index'))

app.use(express.static(path.resolve(__dirname , '../public/')))


mongoose.connect(process.env.urlDB,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, res) => {
  if (err) throw err

  console.log('Base de datos online');

});

app.listen(port, () => {
    console.log(`escuchando el puerto ${port}`);
})

