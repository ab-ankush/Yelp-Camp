const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res, next) => {
  try {
    res.render("campgrounds/new");
  } catch (e) {
    next(e);
  }
};

module.exports.createCampground = async (req, res, next) => {
  try {
    const geoData = await geocodingClient
      .forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
      })
      .send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    campground.author = req.user._id;
    // console.log(campground);
    await campground.save();
    req.flash("success", "Successfully Created a New Campground");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.showCampground = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!campground) {
      req.flash("error", "Campground Not Found");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  } catch (e) {
    next(e);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  } catch (e) {
    next(e);
  }
};

module.exports.editCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await campground.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (e) {
    next(e);
  }
};

module.exports.deleteCampground = async (req, res, next) => {
  try {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully Deleted the Campground");
    res.redirect("/campgrounds");
  } catch (e) {
    next(e);
  }
};
