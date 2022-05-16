const express = require('express');
const router = express.Router();

const cathcAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressErrors');
const validateCampground = require('../validators/campgroundValidator');
const validateReview = require('../validators/reviewsValidator');

const isLoggedIn = require('../middlewares/isLoggedIn');
const isAuthor = require('../middlewares/isAuthor');
const isReviewAuthor = require('../middlewares/isReviewAuthor');

const {index, newCampgroundForm, createCampground, showCampground, 
editCampgroundForm, updateCampground, deleteCampground, createReview, deleteReview} = require('../controllers/campgrounds');

//configuring multer
const {storage} = require('../config/cloudinary');

const multer  = require('multer')
const upload = multer({storage}); // para que lo guarde en cloudinary



/**
 * Crear Campground
 */
router.get('/new', isLoggedIn, newCampgroundForm);
// router.post('/',isLoggedIn,validateCampground,cathcAsync(createCampground));
router.post('/', upload.array('image'),(req,res)=>{
    console.log(req.body, req.files);
    res.send('Worked');
});

/**
 * Listar Campgrounds
 */
router.get('/',cathcAsync(index));
router.get('/:id',cathcAsync(showCampground));

/**
 * Edit Campground
 */
router.get('/:id/edit',isLoggedIn,isAuthor,cathcAsync(editCampgroundForm));
router.put('/:id',isLoggedIn,isAuthor,validateCampground, cathcAsync(updateCampground));

/**
 * Delete Route
 */
router.delete('/:id',isLoggedIn,isAuthor,cathcAsync(deleteCampground));


/**
 * Ruta para crear un Review
 */
router.post('/:id/reviews',isLoggedIn,validateReview, cathcAsync(createReview));

/**
 * Ruta para eliminar un review
 */
router.delete('/:id/reviews/:reviewId',isLoggedIn,isReviewAuthor, cathcAsync(deleteReview));



module.exports = router;
