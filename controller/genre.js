const GenreModel = require("../schema/Genre_schema");
const BookModel = require("../schema/Book_schema");
const { body, validationResult } = require("express-validator");

const getAllGenres = async (req, res) => {
  try {
    const genres = await GenreModel.find().sort([["name", "ascending"]]);
    return res.render("catalog/genre/index", { genres });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};

const getGenre = async (req, res) => {
  try {
    const genre = await GenreModel.findOne({ _id: req.params.id });
    const books = await BookModel.find({ genre: genre._id });
    return res.render("catalog/genre/detail", { genre, books });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};

const createGenre = async (req, res, next) => {
  if (req.method !== "POST") {
    return res.render("catalog/genre/create");
  } else if (req.method === "POST") {
    try {
      const genre = await GenreModel.findOne({ name: req.body.name });
      if (genre) {
        return res.redirect(genre.url);
      }
      const newGenre = new GenreModel({ name: req.body.name });
      await newGenre.save();
      req.flash("success", "New genre added");
      res.redirect("/catalog/genres");
    } catch (error) {
      return res.send("Server Error :" + error.message);
    }
  }
};

module.exports = {
  getAllGenres,
  getGenre,
  createGenre,
};
