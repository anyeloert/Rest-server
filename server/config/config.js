///////////////////////////////
//Puerto
///////////////////////////////
process.env.PORT = process.env.PORT || 3000


///////////////////////////////
//Entorno
///////////////////////////////
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'



///////////////////////////////
//Expiracion de Tokens
// minuto * hora * dia * mes
///////////////////////////////

process.env.EXPIRATION_TOKEN = 60*60*24*30*1000

///////////////////////////////
//Seed de los tokens
///////////////////////////////

process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este_es_el_seed_de_desarrollo'


///////////////////////////////
//Coneccion base de datos
///////////////////////////////
let urlDB = ''

process.env.NODE_ENV === 'dev' ?  
    urlDB = 'mongodb://localhost:27017/cafe' : 
    urlDB =process.env.Mlab_Connect


process.env.urlDB = urlDB



