const jwt = require("jsonwebtoken");

const { jwtCode } = require("../../config");

const checkIfLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    req.user = jwt.verify(token, jwtCode);
    return next();
  } catch (err) {
    return res.status(500).send({ msg: "User does not exist" });
  }
};

module.exports = checkIfLoggedIn;
