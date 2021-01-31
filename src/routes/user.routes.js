const express = require("express");

const multer = require("multer");
const User = require("../db/models/user.model");
const auth = require("../middlewares/auth.middleware");
const { checkIsUpdatesValid } = require("../utils/utils");

const router = express.Router();

// POST ==> create users
router.post("/users", async (req, res) => {
  try {
    const { body } = req;

    const user = new User(body);

    const savedUser = await user.save();
    const token = await savedUser.generateAuthToken();

    res.status(201).send({
      status: res.statusCode,
      data: { token, user: savedUser },
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
    const token = await user.generateAuthToken();

    res.send({ status: res.statusCode, data: { token, user } });
  } catch (error) {
    console.log({ error });
    res.status(400).send({ status: res.statusCode, error });
  }
});

// POST ==> Logout user
router.post("/users/logout", auth, async (req, res) => {
  const { user, token } = req;
  try {
    // Deleting the existing user token from the list of token
    // invalidating the user session
    const updatedTokens = user.tokens.filter(
      ({ token: uToken }) => uToken !== token
    );

    user.tokens = updatedTokens;

    await user.save();

    res.send({
      status: res.statusCode,
      message: "Log out successfully!",
    });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

// POST ==> Logout all user sessions
router.post("/users/logout-all", auth, async (req, res) => {
  const { user } = req;
  try {
    user.tokens = [];

    await user.save();

    res.send({
      status: res.statusCode,
      message: "All sessions logged out successfully!",
    });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

// GET ==> all users
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});

    res.send({ status: res.statusCode, data: users });
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET ==> get user profile
router.get("/users/profile", auth, async (req, res) => {
  const { user, token } = req;
  try {
    res.send({ status: res.statusCode, data: { token, user } });
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error });
  }
});

// DELETE ==> delete user proifle
router.delete("/users/profile", auth, async (req, res) => {
  const { user } = req;

  try {
    await user.remove();

    res.send({ status: res.statusCode, message: "User deleted successfully!" });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ status: res.statusCode, error });
  }
});

// UPDATE ==> users/profile
router.patch("/users/profile", auth, async (req, res) => {
  const { body, user } = req;

  const allowedUpdates = ["name", "email", "password", "age"];
  const updatesKeys = Object.keys(body);
  const updateIsValid = checkIsUpdatesValid(updatesKeys, allowedUpdates);

  if (!updateIsValid)
    return res.status(400).send({
      status: res.statusCode,
      error: `Invalid updates!`,
    });

  try {
    updatesKeys.forEach((update) => (user[update] = body[update]));

    await user.save();

    res.send({ status: res.statusCode, data: user });
  } catch (error) {
    res.status(400).send({ status: res.statusCode, error });
  }
});

const upload = multer({
  limits: {
    fileSize: 1_000_000,
  },
  fileFilter(req, file, cb) {
    const { originalname } = file;

    if (!originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error("Please upload a PNG, JPEG | JPG image"));

    cb(undefined, true);
  },
});
// POST ==> user/profile/avatar
router.post(
  "/users/profile/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const { user, file } = req;
    user.avatar = file.buffer;

    const savedUser = await user.save();

    console.log({ user, file, savedUser });

    res.send({ status: res.statusCode, data: savedUser });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
