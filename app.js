const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const connectFlash = require("connect-flash");
const compression = require("compression");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//middleware
app.use(compression());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: "mysecret",
    cookie: {
      maxAge: 60 * 60 * 10,
    },
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({ mongoUrl: process.env.URI }),
  })
);
app.use(connectFlash());
// flassmessgae
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(express.static(path.join(__dirname, "public")));
// database
const mongo_uri = process.env.URI || "mongodb://127.0.0.1:27017/locallibrary";
mongoose.connect(mongo_uri);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Mongodb connection error:"));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
