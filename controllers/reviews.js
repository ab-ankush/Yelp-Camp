const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review Posted Successfully");
    res.redirect(`/campgrounds/${id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.deleteReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully");
    res.redirect(`/campgrounds/${id}`);
  } catch (e) {
    next(e);
  }
};
