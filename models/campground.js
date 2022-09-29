const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  image: String,
  location: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Review.remove({
      _id: {
        $in: data.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
