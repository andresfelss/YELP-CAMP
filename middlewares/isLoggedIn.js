
const isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be singned in');
        return res.redirect('/api/users/login');
    }
    next(); // if you are authenticated next
}
module.exports = isLoggedIn;