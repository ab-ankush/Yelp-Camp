const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const axios = require("axios");
const { places, descriptors } = require("./seedsHelper");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomImage = async () => {
  try {
    const res = await axios.get(
      "https://api.unsplash.com/collections/9046579/photos?client_id=ZdfTV3219axt19qv6RxbmXOPgafQfI05-05YnjjxoF8"
    );
    return res.data[0].urls.small;
  } catch (err) {
    console.log("error");
    console.log(err);
  }
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const c = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Animi a ipsum veniam? Alias autem numquam perferendis, corrupti nam magnam, excepturi non labore neque, doloribus iste enim ad facilis beatae officiis?",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      author: "63349bb98e9898cabe24db5a",
      images: [
        {
          url: "https://res.cloudinary.com/dlbmcizdx/image/upload/v1664461942/YelpCamp/ixy0oo1qfktwqbc3gin1.jpg",
          filename: "YelpCamp/ixy0oo1qfktwqbc3gin1",
        },
        {
          url: "https://res.cloudinary.com/dlbmcizdx/image/upload/v1664461942/YelpCamp/wwakzo18dlbpd3azyjzl.jpg",
          filename: "YelpCamp/wwakzo18dlbpd3azyjzl",
        },
        {
          url: "https://res.cloudinary.com/dlbmcizdx/image/upload/v1664461945/YelpCamp/lrutibnjjhk7svpdufwp.jpg",
          filename: "YelpCamp/lrutibnjjhk7svpdufwp",
        },
      ],
    });
    await c.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
