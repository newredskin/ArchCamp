// SERVER-SIDE VALIDATION SCHEMA
const baseJoi = require("joi");
const sanitizeHtml = require("sanitize-html"); // HTML helper func to clean the string first.

// Create custom Joi extension to prevent HTML element inputs. Check joi's doc!
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    // Nothing is allowed
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error("string.escapeHTML", { value });
                return clean;
            }
        }
    }

});

const Joi = baseJoi.extend(extension); //add extension to Joi func

// create the joi schema Not mongoDB/mongoose schema for validation on server side!
module.exports.buildingSchema = Joi.object({
    // building is the key -> building[name], building[location], ...
    building: Joi.object({
        name: Joi.string().required().escapeHTML(),
        cost: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required(), //Important! don't forget to add .required to the entire building obj
    deleteImages: Joi.array() //specify deletImages outside of building object.
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})