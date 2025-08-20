const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
  console.log("SignUp route hit", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password is required" });
  }
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: "Email already exists" });
  }
  const hashPassword = await bcrypt.hash(password, 10); //10 = SALT, number of rounds of encryption
  const newUser = await User.create({
    email,
    password: hashPassword,
  });
  let token = jwt.sign(
    {
      email,
      id: newUser._id,
    }, //payload
    process.env.SECRET_KEY,
    { expiresIn: "1hr" }
  );
  return res.status(200).json({ token, user: newUser });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password is required" });
  }

  let user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    let token = jwt.sign(
      {
        email,
        id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1hr" }
    );
    return res.status(200).json({ token, user });
  } else {
    return res.status(400).json({ error: "Invalid credentials" });
  }
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.json({ email: user.email });
};

module.exports = { userSignUp, userLogin, getUser };
