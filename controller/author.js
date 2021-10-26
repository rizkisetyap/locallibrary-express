const AuthorsModel = require("../schema/Author_schema");
const BookModel = require("../schema/Book_schema");
const mongoose = require("mongoose");
const getAllAuthors = async (req, res) => {
  try {
    const authors = await AuthorsModel.find().sort([
      ["family_name", "ascending"],
    ]);
    return res.render("catalog/author/index", { authors });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};
const getAuthor = async (req, res) => {
  try {
    const author = await AuthorsModel.findOne({ _id: req.params.id });
    const books = await BookModel.find({
      author: req.params.id,
    });
    return res.render("catalog/author/detail", { author, books });
  } catch (error) {
    return res.status(500).send("Server error " + error.message);
  }
};

const createAuthor = async (req, res) => {
  if (req.method === "POST") {
    const author = new AuthorsModel({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });
    await author.save();
    req.flash("success", `author :${author.name} has been added`);
    return res.redirect(author.url);
  }
  return res.render("catalog/author/create");
};

const deleteAuthor = async (req, res) => {
  try {
    const author = await AuthorsModel.findById(req.params.id);
    const books = await BookModel.find({ author: req.params.id });
    if (books.length > 0) {
      req.flash(
        "warning",
        `Cannot perform delete because ${author.name} has referenced to another book`
      );
      return res.redirect(author.url);
    }
    await AuthorsModel.findByIdAndRemove(req.params.id);
    req.flash("success", `author : ${author.name} has been deleted`);
    return res.redirect("/catalog/authors");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  getAllAuthors,
  getAuthor,
  createAuthor,
  deleteAuthor,
};
