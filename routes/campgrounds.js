const express = require('express');
const Campground = require('../models/campground');
const router = express.Router();

/**
 * Crear Campgrpund
 */
router.get('/', async (req,res)=>{
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', {campgrounds});
});
router.get('/:id', async(req,res)=>{
  res.render('campgrounds/show');
});

module.exports = router;
