const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("../controllers/users");

router.route("/register").get(user.renderRegisterForm).post(user.registerUser);

router
  .route("/login")
  .get(user.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.loginUser
  );

router.get("/logout", user.logout);

module.exports = router;
