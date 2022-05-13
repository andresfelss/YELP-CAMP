const express = require('express');
const router = express.Router();

const fs = require('fs');
const PATH_ROUTES = __dirname;

const removeExtension = (fileName)=>{
    // esta funcion remueve la extension .js de nuestros paths
    return fileName.split('.').shift();
}


const a = fs.readdirSync(PATH_ROUTES).filter((file)=>{

    const name = removeExtension(file); // todo index y tracks
    if (name!= 'index'){
        console.log(`cargando rutas ${name}`)
        router.use(`/${name}`, require(`./${file}`)) // htttp://localhost/api/ users o lo que sea
    }
});

module.exports = router