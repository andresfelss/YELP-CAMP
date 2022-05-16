const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const Review = require('../models/review')

const cathcAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressErrors');
const validateCampground = require('../validators/campgroundValidator');
const validateReview = require('../validators/reviewsValidator');

const isLoggedIn = require('../middlewares/isLoggedIn');
const isAuthor = require('../middlewares/isAuthor');
const isReviewAuthor = require('../middlewares/isReviewAuthor');


// Crear Campground
router.get('/new', isLoggedIn,(req,res)=>{
  res.render('campgrounds/new');
})
router.post('/',isLoggedIn,validateCampground,cathcAsync(async(req,res)=>{
  const camp = new Campground(req.body.campground);
  camp.author = req.user._id; // El user añadido automaticamente
  await camp.save();
  req.flash('success', 'Succesful made a New Campground');
  res.redirect(`campgrounds/${camp._id}`);
}))

/**
 * Listar Campgrounds
 */
router.get('/', cathcAsync(async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
}));
router.get('/:id',cathcAsync(async(req,res)=>{
  const {id} = req.params;
  const camp = await Campground.findById(id).populate(
    {path: 'reviews',
    populate:{path: 'author'}}).populate('author');
  if(!camp){ // si no encuentro el campgrund que me devuelva a all campgrounds y me tira la alerta
    req.flash('error', 'Cannot Find that Campground');
    return res.redirect('/api/campgrounds');
  }
  res.render('campgrounds/show' , {camp});
}));

/**
 * Edit Campground
 */
router.get('/:id/edit',isLoggedIn,isAuthor,cathcAsync(async(req,res) => {
  const {id} = req.params;
  const camp = await Campground.findById(id);
  if(!camp){ // si trato de editar un campground que no existe
    req.flash('error', 'Cannot Find that Campground');
    return res.redirect('/api/campgrounds');
  }
  res.render('campgrounds/edit' , {camp});
}));

router.put('/:id',isLoggedIn,isAuthor,validateCampground, cathcAsync(async(req,res) =>{
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true});
  req.flash('success', 'Succesful Updated Campground');
  res.redirect(`/api/campgrounds/${camp._id}`);
}));

/**
 * Delete Route
 */
router.delete('/:id',isLoggedIn, cathcAsync(async(req,res) =>{
  const {id} = req.params;
  const camp  = await Campground.findByIdAndDelete(id);
  req.flash('success', 'Succesful Delete Campground');
  res.redirect(`/api/campgrounds`);
}));


/**
 * Ruta para crear un Review
 */
router.post('/:id/reviews',isLoggedIn,validateReview, cathcAsync(async(req,res)=>{
  const camp = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash('success', 'Succesful Created New Review');
  res.redirect(`/api/campgrounds/${camp._id}`);
}));
/**
 * Ruta para eliminar un review
 */

router.delete('/:id/reviews/:reviewId',isLoggedIn,isReviewAuthor, cathcAsync(async(req,res) =>{
  const { id,reviewId } =req.params;
  await Campground.findByIdAndUpdate(id,{$pull: {reviews: reviewId}}); // quito el Review correspondiente al reviewId de reviews(camp)
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Succesful Delete the Review');
  res.redirect(`/api/campgrounds/${id}`);
}));


module.exports = router;
