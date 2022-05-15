const Joi = require('joi');
const ExpressError = require('../helpers/ExpressErrors')

const validateReview = (req,res,next)=>{
    const reviewSchema = Joi.object({
        review: Joi.object({
            body: Joi.string().required(),
            rating: Joi.number().required().min(1).max(5)
        }).required()
    })
    const  {error} = reviewSchema.validate(req.body);
      if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
       }else{
           next()
       }
}

module.exports = validateReview;