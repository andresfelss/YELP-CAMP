const { Console } = require('console');
const express = require('express');
const mongoose  = require('mongoose');
const path =require('path');
const methodOverride = require('method-override');


const app = express();
const main = require('./config/mongo');

app.use(express.urlencoded({extended: true}));


// Config Method- override
app.use(methodOverride('_method'));

// DATA BASE CONFIG
main().catch(e => console.log(e));


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