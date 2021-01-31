const express = require("express");

const Task = require("../db/models/task.model");
const auth = require("../middlewares/auth.middleware");
const { checkIsUpdatesValid } = require("../utils/utils");

const router = express.Router();

// POST ==> create tasks
router.post("/tasks", auth, async (req, res) => {
  const {
    body,
    user: { _id },
  } = req;

  try {
    const task = new Task({ ...body, owner: _id });
    const newTask = await task.save();

    res.status(201).send({ status: res.statusCode, data: newTask });
  } catch (error) {
    res.status(400).send({ status: res.statusCode, error });
  }
});

// GET ==> tasks
router.get("/tasks", auth, async (req, res) => {
  const {
    user: { _id },
  } = req;
  try {
    const tasks = await Task.find({ owner: _id });

    res.send({ status: res.statusCode, data: tasks });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

// GET ==> tasks/:id
router.get("/tasks/:id", auth, async (req, res) => {
  const {
    params: { id },
    user,
  } = req;

  try {
    const task = await Task.findOne({ _id: id, owner: user._id });

    if (!task)
      return res
        .status(404)
        .send({ status: res.statusCode, error: "Task not found" });

    res.send({ status: res.statusCode, data: task });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

// UPDATE ==> tasks/:id
router.patch("/tasks/:id", auth, async (req, res) => {
  const {
    body,
    params: { id },
    user,
  } = req;

  const allowedUpdates = ["description", "completed"];
  const updatesKeys = Object.keys(body);
  const updateIsValid = checkIsUpdatesValid(updatesKeys, allowedUpdates);

  if (!updateIsValid)
    return res
      .status(400)
      .send({ status: res.statusCode, error: "Invalid updates!" });

  try {
    const task = await Task.findOne({ _id: id, owner: user._id });

    if (!task)
      return res
        .status(404)
        .send({ status: res.statusCode, error: "Task not found" });

    updatesKeys.forEach((update) => (task[update] = body[update]));

    await task.save();

    res.send({ status: res.statusCode, data: task });
  } catch (error) {
    console.log({ error });
    res.status(500).send({ status: res.statusCode, error });
  }
});

// DELETE ==> tasks/:id
router.delete("/tasks/:id", auth, async (req, res) => {
  const {
    params: { id },
    user,
  } = req;

  try {
    const task = await Task.findOneAndDelete({ _id: id, owner: user._id });
    console.log({ user, task });

    if (!task)
      return res
        .status(404)
        .send({ status: res.statusCode, error: "Task not found" });

    res.send({ status: res.statusCode, message: "Task deleted successfully!" });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

module.exports = router;
