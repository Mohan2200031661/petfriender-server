const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config" });

const User = require("../models/userModel");

exports.registration = async (req, res) => {
  const user = req.body;
  const takenUsername = await User.findOne({ username: user.username });
  const takenEmail = await User.findOne({ email: user.email });

  if (takenUsername || takenEmail) {
    return res
      .status(400)
      .json({ message: "Username or email is already registered" });
  } else {
    const dbUser = new User({
      username: user.username.toLowerCase(),
      email: user.email.toLowerCase(),
      password: user.password, // Assuming password is in plain text
    });
    dbUser.save((err, savedUser) => {
      if (err) {
        return res.status(500).json({ message: "Error saving user." });
      }
      return res
        .status(200)
        .json({ message: `User ${savedUser.username} successfully created.` });
    });
  }
};

exports.login = async (req, res) => {
  const userLoggingIn = req.body;

  const dbUser = await User.findOne({ email: userLoggingIn.email });
  if (!dbUser) {
    return res.status(400).json({
      message: "Username not recognized.",
    });
  }
  
  if (userLoggingIn.password !== dbUser.password) {
    return res.status(401).json({
      message: "Invalid username or password.",
    });
  }

  // Here you might proceed with session management or generate a different type of token if needed

  return res.status(200).json({
    message: "User login successful.",
    user: {
      _id: dbUser._id,
      username: dbUser.username,
      email: dbUser.email,
    }
  });
};

exports.userAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "You are not logged in, please log in",
    });
  }
  await jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res
        .status(401)
        .clearCookie("token")
        .json({ message: "User session expired." });
    }
    return res.status(200).json({
      user: {
        _id: decoded._id,
        username: decoded.username,
        email: decoded.email,
      },
      message: "Success.",
    });
  });
};

exports.logout = async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "You have been logged out." });
};