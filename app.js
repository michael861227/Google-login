const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-route");
const passportSetup = require("./config/passport-set");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const session = require("express-session");
const passport = require("passport");
const app = express();

// set view engine
app.set("view engine", "ejs");

app.use(
  session({
    secret: keys.session.cookieKey,
    resave: false,
    saveUninitialized: true,
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose
  .connect(keys.mongodb.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to mongodb atlas.");
  })
  .catch((e) => {
    console.log(e);
  });

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(3000, () => {
  console.log("app now listening for requests on port 3000");
});
