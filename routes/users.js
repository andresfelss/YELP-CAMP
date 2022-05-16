const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../helpers/catchAsync');
const passport = require('passport');

/**
 * Rutas para register
 */
router.get('/register', (req,res) =>{
    res.render('users/register')
})
router.post('/register', catchAsync(async(req,res)=>{
    try {
        const {username,password,email} = req.body.user;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password) // Hashea la contraseña 
        req.flash('success','Welcome to Yield Camp! Please Log in');
        res.redirect('/api/campgrounds'); 
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/api/users/register');
    }
}));

/**
 * Rutas para el Login
 */
router.get('/login', (req,res)=>{
    res.render('users/login')
});
router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect:'/api/users/login'}), (req,res) =>{
    req.flash('success', 'Welcom back');
    const urlRedirect = req.session.returnTo || '/api/campgrounds' // its possbile that its not a returnTo
    delete req.session.returnTo
    res.redirect(urlRedirect);
})

// Ruta para el Log out
router.get('/logout', (req,res)=>{
    req.logout(); // Facilito
    req.flash('success', 'Goodbay Amigo!');
    res.redirect('/api/campgrounds');
})

module.exports = router;