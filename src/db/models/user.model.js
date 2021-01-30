const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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

  // Hash password only when is part of what was modified (mainly on registration and updating password)
  if (user.isModified("password")) {
    const { password } = user;

    const hashedPassword = await bcrypt.hash(password, 8);

    user.password = hashedPassword;
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
