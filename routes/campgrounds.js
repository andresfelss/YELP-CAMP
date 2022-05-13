const express = require('express');
const Campground = require('../models/campground');
const router = express.Router();

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

module.exports = router;
