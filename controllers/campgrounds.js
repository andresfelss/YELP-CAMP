const Campground = require('../models/campground');
const Review = require('../models/review');

// Listar Campgrounds
const index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}
const showCampground = async(req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id).populate(
      {path: 'reviews',
      populate:{path: 'author'}}).populate('author');
    if(!camp){ // si no encuentro el campgrund que me devuelva a all campgrounds y me tira la alerta
      req.flash('error', 'Cannot Find that Campground');
      return res.redirect('/api/campgrounds');
    }
    res.render('campgrounds/show' , {camp});
}

// Crear Campgrounds
const newCampgroundForm = (req,res)=>{
    res.render('campgrounds/new');
};
const createCampground = async(req,res)=>{
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id; // El user añadido automaticamente
    await camp.save();
    req.flash('success', 'Succesful made a New Campground');
    res.redirect(`campgrounds/${camp._id}`);
};

//Editar Campgrounds
const editCampgroundForm = async(req,res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){ // si trato de editar un campground que no existe
      req.flash('error', 'Cannot Find that Campground');
      return res.redirect('/api/campgrounds');
    }
    res.render('campgrounds/edit' , {camp});
};
const updateCampground = async(req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true});
    req.flash('success', 'Succesful Updated Campground');
    res.redirect(`/api/campgrounds/${camp._id}`);
}

// Delete
const deleteCampground = async(req,res) =>{
    const {id} = req.params;
    const camp  = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesful Delete Campground');
    res.redirect(`/api/campgrounds`);
}

// Crear un review
const createReview = async(req,res)=>{
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Succesful Created New Review');
    res.redirect(`/api/campgrounds/${camp._id}`);
}

//Eliminar un review
const deleteReview = async(req,res) =>{
    const { id,reviewId } =req.params;
    await Campground.findByIdAndUpdate(id,{$pull: {reviews: reviewId}}); // quito el Review correspondiente al reviewId de reviews(camp)
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succesful Delete the Review');
    res.redirect(`/api/campgrounds/${id}`);
}

module.exports = {index, newCampgroundForm, createCampground, showCampground,
editCampgroundForm,updateCampground,deleteCampground,createReview,deleteReview}