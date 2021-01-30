const express = require("express");

// running our mongoose file to ensure DB connection
require("./db/mongoose");

const User = require("./db/models/user.model");
const Task = require("./db/models/task.model");

const app = express();

const PORT = process.env.P0RT || 3000;

app.use(express.json());

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

app.post("/tasks", (req, res) => {
  const { body } = req;

  const task = new Task(body);

  task
    .save()
    .then((data) => res.status(201).send(data))
    .catch((error) => res.status(400).send(error));
});

app.listen(PORT, () => console.log(`server is up on port ${PORT}`));
