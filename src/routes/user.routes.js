const express = require("express");

const User = require("../db/models/user.model");
const { checkIsUpdatesValid } = require("../utils/utils");

const router = express.Router();

// POST ==> users
router.post("/users", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .send({ status: res.statusCode, error: "User already existing" });

    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).send({
      status: res.statusCode,
      data: savedUser,
    });
  } catch (error) {
    res.status(400).send({ status: res.statusCode, error });
  }
});

// GET ==> users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});

    res.send({ status: res.statusCode, data: users });
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET ==> users/:id
router.get("/users/:id", async (req, res) => {
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
router.patch("/users/:id", async (req, res) => {
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

// DELETE ==> user/:id
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user)
      return res
        .status(404)
        .send({ status: res.statusCode, error: "User not found" });

    res.send({ status: res.statusCode, data: user });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

module.exports = router;
