const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const User = require("../models/user-model");
const Denque = require("denque");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our db
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have the user
          console.log("user is: ", currentUser);
          done(null, currentUser);
        } else {
          // create user in our db
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile.photos[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("new user created: " + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
