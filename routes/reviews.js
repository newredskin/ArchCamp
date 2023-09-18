// MODULES
const express = require("express");

const catchAsync = require("../utils/catchAsync");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware"); 
const reviewController = require("../controllers/reviews")

const router = express.Router({mergeParams: true}); //Merge routes with prefix so data can be retrived from req.body



// ROUTES
router.post("/", isLoggedIn, validateReview, catchAsync(reviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));


// EXPORTS
module.exports = router;