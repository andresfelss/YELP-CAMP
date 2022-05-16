const Review = require('../models/review');

const isReviewAuthor = async (req,res,next)=>{
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'Do you not have Permissions to do that');
        return res.redirect(`/api/campgrounds/${id}`);
    }
    next();
}

module.exports = isReviewAuthor;