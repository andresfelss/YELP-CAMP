const { default: mongoose } = require('mongoose');
const main = require('../config/mongo');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } =require('./seedHelpers')

// DATA BASE CONFIG
main().catch(e => console.log(e));


const sample = (array) => array[Math.floor(Math.random()*array.length)];


// Elimino TODO de mi base de datos
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0; i<50;i++){
        const random100 = Math.floor(Math.random()* 1000);
        const camp = new Campground({
            location: `${cities[random100].city}, ${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
}


seedDB().then(() =>{
    mongoose.connection.close();
});