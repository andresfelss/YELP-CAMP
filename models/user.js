const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
// esto va a añadir un username y un password y todos sus metodos y validaciones
UserSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model('User', UserSchema)