// Modulos que necesitamos importar
const { Console } = require('console');
const express = require('express');
const mongoose  = require('mongoose');
const path =require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate')
const main = require('./config/mongo'); // llamo la configuracion de mi Base de Datos
// ---------------- El codigo empieza aca ---------------------------------------------
const app = express(); // Inicio mi express app

app.engine('ejs', engine) // configuramos en view engine

app.use(express.urlencoded({extended: true})); // Para que reciba elementos en el body

// Configuracion EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views')); // Directorio

// Config Method- override
app.use(methodOverride('_method'));

// DATA BASE CONFIG
main().catch(e => console.log(e));

app.get('/', (req,res)=>{
    res.render('home'); // Mi HTML de Home
})


// Para cargar de manera dinamica las rutas
app.use("/api", require('./routes'));



// EL listen siempre al final
app.listen(3000, ()=>{
    console.log('Serving On port 3000: http://localhost:3000/ ')
})