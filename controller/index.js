const AuthorSchema = require("../schema/Author_schema");
const BookSchema = require("../schema/Book_schema");
const GenreSchema = require("../schema/Genre_schema");
const BookInstanceSchema = require("../schema/BookInstance_schema");

const index = async (req, res, next) => {
  try {
    const authorcount = await AuthorSchema.countDocuments();
    const bookcount = await BookSchema.countDocuments();
    const genrecount = await GenreSchema.countDocuments();
    const bookinstancecount = await BookInstanceSchema.countDocuments();
    const bookavailable = await BookInstanceSchema.countDocuments({
      status: "Available",
    });

    return res.render("catalog/index", {
      authorcount,
      bookcount,
      genrecount,
      bookinstancecount,
      bookavailable,
    });
  } catch (error) {
    return res.send(`Server Error : ${error.message}`);
  }
};

module.exports = index;
