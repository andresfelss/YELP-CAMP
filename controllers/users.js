const User = require('../models/user');

// Registro
const registerForm = (req,res) =>{
    res.render('users/register')
}
const registerUser = async(req,res)=>{
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
}

// login
const loginForm = (req,res)=>{
    res.render('users/login')
}
const loginUser = (req,res) =>{
    req.flash('success', 'Welcom back');
    const urlRedirect = req.session.returnTo || '/api/campgrounds' // its possbile that its not a returnTo
    delete req.session.returnTo
    res.redirect(urlRedirect);
}

//logout
const logOut = (req,res)=>{
    req.logout(); // Facilito
    req.flash('success', 'Adios perro Hpta');
    res.redirect('/api/campgrounds');
}


module.exports = {registerForm,registerUser,loginForm,loginUser,logOut}