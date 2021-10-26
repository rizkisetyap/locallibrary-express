const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");
const schema = new Schema({
  first_name: {
    type: String,
    required: [true, "First name must be provided"],
    maxLength: [100, "Max character must be less than or equal 100"],
  },
  family_name: String,
  date_of_birth: Date,
  date_of_death: Date,
});
// Virtual for authors full name
schema.virtual("name").get(function () {
  return this.family_name + " " + this.first_name;
});
// virtual lifespan
schema.virtual("lifespan").get(function () {
  let lifetime_str = "";
  if (this.date_of_birth) {
    lifetime_str = DateTime.fromJSDate(this.date_of_birth).toLocaleString(
      DateTime.DATE_MED
    );
  }
  lifetime_str += " - ";
  if (this.date_of_death) {
    lifetime_str += DateTime.fromJSDate(this.date_of_death).toLocaleString(
      DateTime.DATE_MED
    );
  }
  return lifetime_str;
});
// virtual url

schema.virtual("url").get(function () {
  return "/catalog/author/" + this._id;
});
module.exports = mongoose.model("Author", schema);
