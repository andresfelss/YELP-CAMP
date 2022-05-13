const { Console } = require('console');
const express = require('express');
const mongoose  = require('mongoose');
const path =require('path');

const app = express();


// DATA BASE CONFIG
main().catch(e => console.log(e));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-campDB');
    console.log('Connection Succes');
}

// Configuracion EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views')); // Directorio

// Para cargar de manera dinamica las rutas
app.use("/api", require('./routes'));

app.get('/', (req,res)=>{
    res.render('home');
})


app.listen(3000, ()=>{
    console.log('Serving On port 3000: http://localhost:3000/ ')
})