const express = require("express");

// running our mongoose file to ensure DB connection
require("./db/mongoose");

const User = require("./db/models/user.model");
const Task = require("./db/models/task.model");
const { checkIsUpdatesValid } = require("./utils/utils");

const app = express();

const PORT = process.env.P0RT || 3000;

app.use(express.json());

// POST ==> users
app.post("/users", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already existing");

    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).send({
      status: res.statusCode,
      data: savedUser,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET ==> users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET ==> users/:id
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    console.log({ user, id });

    if (!user) return res.status(404).send("User not found");

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE ==> users/:id
app.patch("/users/:id", async (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const allowedUpdates = ["name", "email", "password", "age"];
  const updateIsValid = checkIsUpdatesValid(body, allowedUpdates);

  if (!updateIsValid)
    return res.status(400).send({
      status: res.statusCode,
      error: `Invalid updates!`,
    });

  try {
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return res
        .status(404)
        .send({ status: res.statusCode, error: "User not found" });

    res.send({ status: res.statusCode, data: user });
  } catch (error) {
    res.status(400).send({ status: res.statusCode, error });
  }
});

// POST ==> tasks
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    const newTask = await task.save();
    res.status(201).send({ status: res.statusCode, data: newTask });
  } catch (error) {
    res.status(400).send({ status: res.statusCode, error });
  }
});

// GET ==> tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.send({ status: res.statusCode, data: tasks });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

// GET ==> tasks/:id
app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task)
      return res
        .status(404)
        .send({ status: res.statusCode, error: "Task not found" });

    res.send(task);
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

// UPDATE ==> tasks/:id
app.patch("/tasks/:id", async (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const allowedUpdates = ["description", "completed"];
  const isUpdateValid = checkIsUpdatesValid(body, allowedUpdates);

  if (!isUpdateValid)
    return res
      .status(400)
      .send({ status: res.statusCode, error: "Invalid updates!" });

  try {
    const task = await Task.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!task)
      return res
        .status(404)
        .send({ status: res.statusCode, error: "Task not found" });

    res.send({ status: res.statusCode, data: task });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));
