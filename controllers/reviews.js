// IMPORT MODEL
const Review = require("../models/review");
const Building = require("../models/building");



// CONTROLLERS
module.exports.createReview = async (req, res) => {
    const building = await Building.findById(req.params.id);
    // When create the schema, using review[...]as inputs' names so it can be parsed like the way below -> req.body.review
    const review = new Review(req.body.review)
    review.author = req.user._id; //after create a review -> assign the user to author immediately
    building.reviews.push(review);
    await review.save();
    await building.save()
    req.flash("success", "Successuflly submit comment!");
    res.redirect(`/buildings/${building._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // $pull removes from an existing array all instances of a value or values that match a sepcified condition
    //Delete review in building dataset
    await Building.findByIdAndUpdate(id, {$pull: { reviews: reviewId}});
    // Delete review itself
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successuflly delete comment!");
    res.redirect(`/buildings/${id}`);
}