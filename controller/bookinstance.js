const BookInstancesModel = require("../schema/BookInstance_schema");
const BookModel = require("../schema/Book_schema");

const getAllBookIntances = async (req, res) => {
  try {
    const bookinstances = await BookInstancesModel.find().populate("book");

    return res.render("catalog/bookinstance/index", { bookinstances });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};

const getBookInstance = async (req, res) => {
  try {
    const bookinstance = await BookInstancesModel.findById(
      req.params.id
    ).populate("book");
    return res.render("catalog/bookinstance/detail", { bookinstance });
  } catch (error) {
    return res.status(500).send("Server error");
  }
};

const createBookInstance = async (req, res) => {
  if (req.method === "POST") {
    const copy = new BookInstancesModel({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });
    await copy.save();
    req.flash("success", "Copies saved");
    return res.redirect("/catalog/bookinstances");
  }
  try {
    const books = await BookModel.find({}, "title");
    return res.render("catalog/bookinstance/create", { books });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/catalog/bookinstance/create");
  }
};

module.exports = {
  getAllBookIntances,
  getBookInstance,
  createBookInstance,
};
