const express = require('express');
const { append } = require('express/lib/response');
const { findByIdAndUpdate, findByIdAndDelete } = require('../models/campground');
const Campground = require('../models/campground');
const router = express.Router();

// Crear Campground
router.get('/new', (req,res)=>{
  res.render('campgrounds/new');
})
router.post('/',async(req,res)=>{
  const camp = new Campground(req.body.campground)
  await camp.save();
  res.redirect(`campgrounds/${camp._id}`);
})




/**
 * Listar Campgrounds
 */
router.get('/', async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
});
router.get('/:id', async(req,res)=>{
  const {id} = req.params;
  const camp = await Campground.findById(id);
  res.render('campgrounds/show' , {camp});
});


/**
 * Edit Campgrpund
 */
router.get('/:id/edit', async(req,res) => {
  const {id} = req.params;
  const camp = await Campground.findById(id);
  res.render('campgrounds/edit' , {camp});
});
router.put('/:id', async(req,res) =>{
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true});
  res.redirect(`/api/campgrounds/${camp._id}`);
});

/**
 * Delete Route
 */
router.delete('/:id', async(req,res) =>{
  const {id} = req.params;
  const camp  = await Campground.findByIdAndDelete(id);
  res.redirect(`/api/campgrounds`);
});


module.exports = router;
