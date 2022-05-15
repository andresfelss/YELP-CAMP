const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../helpers/catchAsync');

router.get('/register', (req,res) =>{
    res.render('users/register')
})
router.post('/register', catchAsync(async(req,res)=>{
    res.send(req.body)
}));


module.exports = router;