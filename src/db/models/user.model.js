const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  password: {
    type: String,
    required: true,
    minLength: 7,
    validate(value) {
      if (validator.contains(value, "password", { ignoreCase: true })) {
        throw new Error("Password cannot contain 'password'");
      }
    },
  },

  age: {
    type: Number,
    default: 0,
    validate: (value) => {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
});

// Middleware for authtentication and password encryption
userSchema.pre("save", async function (next) {
  const user = this;

  console.log("just before saving");
});

const User = mongoose.model("User", userSchema);

module.exports = User;
