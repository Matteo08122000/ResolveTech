const express = require("express");
const google = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const Usersmodel = require("../models/Usersmodel");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Usersmodel.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new UsersModel({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: null,
            role: "user",
            gender: "not specified",
            dob: new Date(),
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

google.use(passport.initialize());

google.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

google.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        role: user.role,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/auth/success?token=${encodeURIComponent(token)}`;
    res.redirect(redirectUrl);
  }
);

google.get("/success", (req, res) => {
  res.send("Login with Google completed with success!");
});

module.exports = google;
