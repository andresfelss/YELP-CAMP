const express = require('express');
const Campground = require('../models/campground');
const router = express.Router();

/**
 * Crear Campgrpund
 */
router.get('/', async (req,res)=>{
    const camp = new Campground({title: 'My backyard', description: 'Cheap camp '});
    await camp.save();
    res.send(camp)
})


module.exports = router;
