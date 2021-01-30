const mongoose = require("mongoose");
const validator = require("validator");

const uri = "mongodb://127.0.0.1:27017/task-manager-api";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const User = mongoose.model("User", {
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

const Task = mongoose.model("Task", {
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const newUser = new User({
  name: "Dan Eich   ",
  email: "user@GMAIL.COM",
  password: "user1234",
});

// newUser
//   .save()
//   .then(console.log)
//   .catch((error) => console.log({ error }));

const newTask = new Task({
  description: "First task of the day      ",
  completed: false,
});

newTask.save().then(console.log).catch(console.log);
