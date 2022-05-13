const main = require('../config/mongo');
const Campground = require('../models/campground');

// DATA BASE CONFIG
main().catch(e => console.log(e));

// Elimino TODO de mi base de datos
const seedDB = async()=>{
    await Campground.deleteMany({});
    const c = new Campground({title: 'Test'});
    await c.save();
}


seedDB();