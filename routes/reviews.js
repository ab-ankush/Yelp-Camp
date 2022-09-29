const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware/isLoggedIn");
const { isReviewAuthor } = require("../middleware/isAuthor");
const { validateReview } = require("../middleware/validate");
const review = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, review.createReview);

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, review.deleteReview);

module.exports = router;
