const BookModel = require("../schema/Book_schema");
const AuthorSchema = require("../schema/Author_schema");
const GenreSchema = require("../schema/Genre_schema");
const BookInstanceSchema = require("../schema/BookInstance_schema");

const getAllBooks = async (req, res) => {
  try {
    const books = await BookModel.find({}, "title author")
      .sort({ title: 1 })
      .populate("author");

    return res.render("catalog/book/index", { books });
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
const getBook = async (req, res) => {
  try {
    const book = await BookModel.findOne({ _id: req.params.id })
      .populate("author")
      .populate("genre");
    const bookinstance = await BookInstanceSchema.find({ book: book._id });
    return res.render("catalog/book/detail", { book, bookinstance });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};
const createBook = async (req, res, next) => {
  if (req.method === "POST") {
    try {
      const book = new BookModel({
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre,
      });
      await book.save();
      req.flash("success", "New Book added");
      return res.redirect("/catalog/books");
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/catalog/book/create");
    }
  }
  try {
    const authors = await AuthorSchema.find();
    const genres = await GenreSchema.find();
    return res.render("catalog/book/create", { authors, genres });
  } catch (error) {
    return res.status(500).send("Server error " + error.message);
  }
};

const updateBook = async (req, res) => {
  const book = await BookModel.findById(req.params.id)
    .populate("author")
    .populate("genre");
  if (req.method === "POST") {
    const updatebook = await BookModel.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
    });
    if (!updatebook) {
      req.flash("error", "Update failed");
      return res.redirect(book.url);
    }
    req.flash("success", "Book updated");
    return res.redirect(updatebook.url);
  }
  try {
    const book = await BookModel.findById(req.params.id)
      .populate("author")
      .populate("genre");
    const authors = await AuthorSchema.find({});
    const genre = await GenreSchema.find({});
    const genres = genre.map(({ _id, name }) => {
      const gen = { _id, name };
      book.genre.forEach((e) => {
        if (e._id.toString() === _id.toString()) {
          gen["checked"] = "true";
        }
      });
      return gen;
    });
    return res.render("catalog/book/update", { book, authors, genres });
  } catch (error) {
    return res.status(500).send(`server error ${error.message}`);
  }
};
const deleteBook = async (req, res) => {
  await BookModel.findByIdAndRemove(req.params.id);
  req.flash("success", "Book has been deleted");
  return res.redirect("/catalog/books");
};
module.exports = {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
