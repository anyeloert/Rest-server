require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/', (req, res) => {
  res.json('Hello World')
})
app.post('/usuario', (req, res) => {
    const body = req.body
  res.json({
      'persona': body
  })
})
 
app.listen(port, () => {
    console.log(`escuchando el puerto ${port}`);
})

