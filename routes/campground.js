const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const campground = require("../controllers/campgrounds");

const { isLoggedIn } = require("../middleware/isLoggedIn");
const { isAuthor } = require("../middleware/isAuthor");
const { validateCampground } = require("../middleware/validate");

router
  .route("/")
  .get(campground.index)
  .post(isLoggedIn, validateCampground, campground.createCampground);

router.get("/new", isLoggedIn, campground.renderNewForm);

router
  .route("/:id")
  .get(campground.showCampground)
  .put(isLoggedIn, isAuthor, validateCampground, campground.editCampground)
  .delete(isLoggedIn, isAuthor, campground.deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuthor, campground.renderEditForm);

module.exports = router;
