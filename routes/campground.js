const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const campground = require("../controllers/campgrounds");

const { isLoggedIn } = require("../middleware/isLoggedIn");
const { isAuthor } = require("../middleware/isAuthor");
const { validateCampground } = require("../middleware/validate");

router
  .route("/")
  .get(campground.index)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    campground.createCampground
  );

router.get("/new", isLoggedIn, campground.renderNewForm);

router
  .route("/:id")
  .get(campground.showCampground)
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    campground.editCampground
  )
  .delete(isLoggedIn, isAuthor, campground.deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuthor, campground.renderEditForm);

module.exports = router;
