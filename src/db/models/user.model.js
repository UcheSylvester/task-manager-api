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
    unique: true,
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

// Middleware for hashing password before saving
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

// Attaching a function ==> findUserByCredentials (finds user and compares passwords) to userSchema so we can reuse it
userSchema.statics.findUserByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user) throw new Error("Unauthorized");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Unauthorized");

    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
