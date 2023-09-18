const { buildingSchema, reviewSchema } = require("./schemas") //joi shcema for validation
const ExpressError = require("./utils/ExpressError")
const Building = require("./models/building");
const Review = require("./models/review");


// VALIDATION MIDDLEWARES

// ***** USER *****
// Check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // add this line below so when a user is not signed in but want to edit the page, after direct to login page it can return to the previous edit page.
        req.session.returnTo = req.originalUrl; 
        req.flash("error", "You must be signed in first.");
        return res.redirect("/login");
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


// ***** BUILDING *****
module.exports.validateBuilding = (req, res, next) => {    
    // get massage of error details
    const { error } = buildingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const building = await Building.findById(id);
    if (!building.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that.");
        return res.redirect(`/buildings/${id}`);
    }
    next();
}


// ***** REVIEW *****
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that.");
        return res.redirect(`/buildings/${id}`);
    }
    next();
}