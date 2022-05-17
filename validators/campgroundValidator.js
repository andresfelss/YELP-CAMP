const BaseJoi = require('joi');
const ExpressError = require('../helpers/ExpressErrors');
const extension = require('../helpers/sanitizerHTML');

const Joi = BaseJoi.extend(extension);
const validateCampground = (req,res,next)=>{
    const campgroundSchema = Joi.object({
        campground: Joi.object({
          title: Joi.string().required().escapeHTML(),
          price: Joi.number().required().min(0),
          // image: Joi.string(),
          location: Joi.string().required().escapeHTML(),
          description: Joi.string().required().escapeHTML(),
        }).required(),
        deleteImages: Joi.array()
      });
      const  {error} = campgroundSchema.validate(req.body);
      if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
       }else{
           next()
       }
}

module.exports = validateCampground;