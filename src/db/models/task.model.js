const mongoose = require("mongoose");

const { Schema } = mongoose;

const taskSchema = new Schema({
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

  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
