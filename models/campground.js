const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxglelovzd2f3dgcpass.png

const ImgSchema = new Schema({
    url: String,
    filename: String
});
ImgSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');  // no lo guardamos es solo una URL mirar (virtual property)
});

const opts = {toJSON: {virtuals: true}}; // Para acceder al el cuando lo stringify

const CampgroundSchema = new Schema({
    title: String,
    images: [ImgSchema],
    price: Number,
    description: String,
    geometry:{
        type: {
            type : String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Referencia al Modelo User
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);

// virtual para mapBox
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/api/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,30)}...`
});

CampgroundSchema.post('findOneAndDelete', async function(camp){
    if(camp){
        await Review.deleteMany({
            _id:{
                $in: camp.reviews
            }
        })
    }
});



module.exports = mongoose.model('Campground', CampgroundSchema);