const router = require("express").Router();
// validator
const {
  validateGenre,
  validateAuthor,
  validateBook,
  validateCopy,
} = require("../validator");
// controller
const HomePage = require("../controller");
const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controller/book");
const { getAllGenres, getGenre, createGenre } = require("../controller/genre");
const {
  getAllAuthors,
  getAuthor,
  createAuthor,
  deleteAuthor,
} = require("../controller/author");
const {
  getAllBookIntances,
  getBookInstance,
  createBookInstance,
} = require("../controller/bookinstance");

// list
router.get("/", HomePage);
router.route("/books").get(getAllBooks);
router.route("/authors").get(getAllAuthors);
router.route("/genres").get(getAllGenres);
router.route("/bookinstances").get(getAllBookIntances);
// create
router.route("/genre/create").get(createGenre).post(validateGenre, createGenre);
router
  .route("/author/create")
  .get(createAuthor)
  .post(validateAuthor, createAuthor);
router.route("/book/create").get(createBook).post(validateBook, createBook);
router
  .route("/bookinstance/create")
  .get(createBookInstance)
  .post(validateCopy, createBookInstance);

// details
router.route("/book/:id").get(getBook);
router.route("/author/:id").get(getAuthor);
router.route("/genre/:id").get(getGenre);
router.route("/bookinstance/:id").get(getBookInstance);
//update
router.route("/book/:id/update").get(updateBook).post(validateBook, updateBook);
//delete
router.route("/author/:id/delete").get(deleteAuthor);
router.route("/book/:id/delete").get(deleteBook);

module.exports = router;
