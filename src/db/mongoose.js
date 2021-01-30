const mongoose = require("mongoose");

const uri = "mongodb://127.0.0.1:27017/task-manager-api";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
