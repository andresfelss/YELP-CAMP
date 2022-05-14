const express = require('express');
const { append } = require('express/lib/response');
const { findByIdAndUpdate, findByIdAndDelete } = require('../models/campground');
const Campground = require('../models/campground');
const router = express.Router();
const cathcAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/ExpressErrors');
const validateCampground = require('../validators/campgroundValidator')


// Crear Campground
router.get('/new', (req,res)=>{
  res.render('campgrounds/new');
})
router.post('/',validateCampground,cathcAsync(async(req,res)=>{
  const camp = new Campground(req.body.campground);
  await camp.save();
  res.redirect(`campgrounds/${camp._id}`);
}))

/**
 * Listar Campgrounds
 */
router.get('/', cathcAsync(async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
}));
router.get('/:id', cathcAsync(async(req,res)=>{
  const {id} = req.params;
  const camp = await Campground.findById(id);
  res.render('campgrounds/show' , {camp});
}));

/**
 * Edit Campgrpund
 */
router.get('/:id/edit', cathcAsync(async(req,res) => {
  const {id} = req.params;
  const camp = await Campground.findById(id);
  res.render('campgrounds/edit' , {camp});
}));
router.put('/:id',validateCampground, cathcAsync(async(req,res) =>{
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true});
  res.redirect(`/api/campgrounds/${camp._id}`);
}));

/**
 * Delete Route
 */
router.delete('/:id', cathcAsync(async(req,res) =>{
  const {id} = req.params;
  const camp  = await Campground.findByIdAndDelete(id);
  res.redirect(`/api/campgrounds`);
}));


module.exports = router;
