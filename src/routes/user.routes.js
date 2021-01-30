const express = require("express");

const User = require("../db/models/user.model");
const { checkIsUpdatesValid } = require("../utils/utils");

const router = express.Router();

// POST ==> create users
router.post("/users", async (req, res) => {
  try {
    const { body } = req;

    const user = new User(body);
    const savedUser = await user.save();

    res.status(201).send({
      status: res.statusCode,
      data: savedUser,
    });
  } catch (error) {
    res.status(400).send({ status: res.statusCode, error });
  }
});

// POST ==> Login user
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);

    res.send({ status: res.statusCode, data: user });
  } catch (error) {
    res.status(400).send({ status: res.statusCode, error: "Unauthorized" });
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
  const updatesKeys = Object.keys(body);
  const updateIsValid = checkIsUpdatesValid(updatesKeys, allowedUpdates);

  if (!updateIsValid)
    return res.status(400).send({
      status: res.statusCode,
      error: `Invalid updates!`,
    });

  try {
    // NB: findByIdAndUpdate bypasses middlewares so we findById and update;
    const user = await User.findById(id);

    if (!user)
      return res
        .status(404)
        .send({ status: res.statusCode, error: "User not found" });

    updatesKeys.forEach((update) => (user[update] = body[update]));

    await user.save();

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
