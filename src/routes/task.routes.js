const express = require("express");

const Task = require("../db/models/task.model");
const { checkIsUpdatesValid } = require("../utils/utils");

const router = express.Router();

// POST ==> tasks
router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    const newTask = await task.save();
    res.status(201).send({ status: res.statusCode, data: newTask });
  } catch (error) {
    res.status(400).send({ status: res.statusCode, error });
  }
});

// GET ==> tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.send({ status: res.statusCode, data: tasks });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

// GET ==> tasks/:id
router.get("/tasks/:id", async (req, res) => {
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
router.patch("/tasks/:id", async (req, res) => {
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

// DELETE ==> tasks/:id
router.delete("/tasks/:id", async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const task = await Task.findByIdAndDelete(id);

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
