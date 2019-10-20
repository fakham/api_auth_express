const router = require("express").Router();
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  // validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check email exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");

  // hash password
  const salt = await bycrypt.genSalt(10);
  const hashedPassword = await bycrypt.hash(req.body.password, salt);

  // create user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  // validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Incorrect email or password!");

  // check valid password
  const validPassword = await bycrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Incorrect email or password!");

  // create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
