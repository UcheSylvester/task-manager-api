const jwt = require("jsonwebtoken");
const User = require("../db/models/user.model");
const { JWT_SECRET_KEY } = require("../utils/utils");

const auth = async (req, res, next) => {
  console.log("Auth middleware");

  try {
    // Get token from header and decode it
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    const { id } = decoded;
    // get the id in decoded jwt and use it to find user
    // make sure user still has token stored in the tokens array
    // making sure only authenticated devices/tokens can access protected routes
    const user = await User.findOne({ _id: id, "tokens.token": token });

    console.log({ token, user });

    if (!user) throw new Error();

    // return user as part of the req
    req.user = user;

    next();
  } catch (error) {
    res.status(500).send({ status: res.statusCode, error: "Unauthenticated" });
  }
};

module.exports = auth;
