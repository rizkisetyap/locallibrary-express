const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
  title: {
    type: String,
    required: [true, "Title must be provided"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  summary: {
    type: String,
    required: [true, "Summary must be provided"],
  },
  isbn: {
    type: String,
    required: true,
  },
  genre: {
    type: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  },
});
// virtual url
schema.virtual("url").get(function () {
  return "/catalog/book/" + this._id;
});
schema.virtual("dueback").get(function () {
  return new Date(this.due_back).toLocaleString();
});
module.exports = mongoose.model("Book", schema);
