//Puerto

process.env.PORT = process.env.PORT || 3000

//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//Conecion base de datos

let urlDB = ''

process.env.NODE_ENV === 'dev' ?  
    urlDB = 'mongodb://localhost:27017/cafe' : 
    urlDB =process.env.NODE_ENV.Mlab_Connect


process.env.urlDB = urlDB



