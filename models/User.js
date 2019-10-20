const mogoose = require("mongoose");

const userSchema = new mogoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6
  },
  email: {
    type: String,
    required: true,
    min: 6
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mogoose.model("User", userSchema);
