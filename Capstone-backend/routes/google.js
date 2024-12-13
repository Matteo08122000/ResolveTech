const express = require("express");
const google = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const session = require("express-session");
require("dotenv").config();

google.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

google.use(passport.initialize());
google.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0]?.value,
        picture: profile.photos[0]?.value,
      };
      return done(null, user);
    }
  )
);

google.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req, res) => {
    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/success?user=${encodeURIComponent(JSON.stringify(req.user))}`;
    res.redirect(redirectUrl);
  }
);

google.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user) {
      console.error("Utente non trovato dopo il callback di Google");
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=user_not_found`
      );
    }

    try {
      const token = jwt.sign(
        {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const redirectUrl = `${
        process.env.FRONTEND_URL
      }/success?token=${encodeURIComponent(token)}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Errore durante la generazione del token JWT:", error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_error`);
    }
  }
);

google.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send({
        statusCode: 500,
        message: "Oops, something went wrong during logout",
        err,
      });
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({
          statusCode: 500,
          message: "Failed to destroy session",
          err,
        });
      }
      res.redirect("/");
    });
  });
});

module.exports = google;
