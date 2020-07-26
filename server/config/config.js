//Puerto

process.env.PORT = process.env.PORT || 3000

//Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//Conecion base de datos

let urlDB = ''

process.env.NODE_ENV === 'dev' ?  
    urlDB = 'mongodb://localhost:27017/cafe' : 
    urlDB ='mongodb+srv://anyeloert:123456abc@cluster0.yykb4.mongodb.net/cafe?retryWrites=true&w=majority'


process.env.urlDB = urlDB



