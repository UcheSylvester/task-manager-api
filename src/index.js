const express = require("express");

// running our mongoose file to ensure DB connection
require("./db/mongoose");

const User = require("./db/models/user.model");
const Task = require("./db/models/task.model");

const app = express();

const PORT = process.env.P0RT || 3000;

app.use(express.json());

// POST ==> users
app.post("/users", (req, res) => {
  const { body } = req;

  const user = new User(body);

  user
    .save()
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((error) => {
      console.log({ error });

      res.status(400).send(error);
    });
});

// GET ==> users
app.get("/users", (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => res.status(500).send(error));
});

// GET ==> users/:id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (!user) return res.status(404).send("User not found");

      res.send(user);
    })
    .catch((error) => res.status(500).send(error));
});

// POST ==> tasks
app.post("/tasks", (req, res) => {
  const { body } = req;

  const task = new Task(body);

  task
    .save()
    .then((data) => res.status(201).send(data))
    .catch((error) => res.status(400).send(error));
});

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));

// GET ==> tasks
app.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => res.send(tasks))
    .catch((error) => res.status(500).send(error));
});

// GET ==> tasks/:id
app.get("/tasks/:id", (req, res) => {
  const { id } = req.params;

  Task.findById(id)
    .then((task) => {
      if (!task) return res.status(404).send("Task not found");

      res.send(task);
    })
    .catch((error) => res.status(500).send(error));
});
