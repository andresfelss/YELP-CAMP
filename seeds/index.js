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
        const price = Math.floor(Math.random()*20)+100;
        const camp = new Campground({
            location: `${cities[random100].city}, ${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui neque necessitatibus harum voluptatibus, veniam nemo veritatis at soluta iusto perspiciatis dolorum dignissimos placeat, nulla aperiam esse suscipit blanditiis aut consectetur            Libero quae, omnis quibusdam doloremque dignissimos, quas magni reprehenderit, tenetur repellendus labore odit earum asperiores laudantium sit. Officia cumque beatae ut, non, dolorem nisi voluptatibus culpa magnam, placeat odio repudiandae?",
            price: price
        });
        await camp.save();
    }
}


seedDB().then(() =>{
    mongoose.connection.close();
});