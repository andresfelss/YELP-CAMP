const express = require('express');
const app = express();


app.get('/', (req,res)=>{
    res.send('Funciono');
})


app.listen(3000, ()=>{
    console.log('Serving On port 3000: http://localhost:3000/ ')
})