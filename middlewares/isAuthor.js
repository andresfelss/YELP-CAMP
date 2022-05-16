const Campground = require('../models/campground');

const isAuthor = async (req,res,next)=>{
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error', 'Do you not have Permissions to do that');
        return res.redirect(`/api/campgrounds/${camp._id}`);
    }
    next();
}

module.exports = isAuthor;