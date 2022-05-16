const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const passport = require('passport');
const { registerForm, registerUser, loginForm, loginUser, logOut } = require('../controllers/users');

/**
 * Rutas para register
 */
router.get('/register', registerForm)
router.post('/register', catchAsync(registerUser));

/**
 * Rutas para el Login
 */
router.get('/login', loginForm);
router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect:'/api/users/login'}), loginUser)

// Ruta para el Log out
router.get('/logout', logOut);

module.exports = router;