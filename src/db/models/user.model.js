const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../../utils/utils");

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

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Hiding private data (password and tokens) in the user response;
userSchema.methods.toJSON = function () {
  const user = this;

  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;

  console.log({ userObj });

  return userObj;
};

// Attaching a function to user instance ==> generateAuthToken so it can be reused
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  try {
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET_KEY, {
      expiresIn: "7 days",
    });

    // Saving each token as part of then user object to keep track of login sessions on serveral devices
    user.tokens = [...user.tokens, { token }];
    await user.save();

    return token;
  } catch (error) {
    throw new Error(error);
  }
};

// Attaching a function to User Collection ==> findUserByCredentials
// (finds user and compares passwords) to userSchema so we can reuse it
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

const User = mongoose.model("User", userSchema);

module.exports = User;
