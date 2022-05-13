const express = require('express');
const path =require('path');

const app = express();

// Configuracion EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views')); // Directorio



app.get('/', (req,res)=>{
    res.render('home');
})


app.listen(3000, ()=>{
    console.log('Serving On port 3000: http://localhost:3000/ ')
})