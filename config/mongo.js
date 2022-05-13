// DATA BASE CONFIG
const mongoose = require('mongoose'); // Requerumos mongoose

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-campDB');
    console.log('Connection Succes');
}

module.exports = main;