const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
  name: {
    type: String,
    trim: true,
    required: true,
  },

  description: {
    type: String,
    trim: true,
    default: "",
  },

  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = Task;
