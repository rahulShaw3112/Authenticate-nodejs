const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
require("dotenv").config();

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const filter = { email: email };
  try {
    const result = await User.findOne(filter);
    const isMatched = await bcrypt.compare(password, result.password);
    if (isMatched === true) {
      const newUser = {
        id: result._id,
        name: result.name,
        email: result.email,
      };
      jwt.sign(
        newUser,
        process.env.JSON_WEB_TOKEN_SECRET,
        { expiresIn: 604800 },
        (err, token) => {
          if (err) throw err;
          res.cookie("x-access-token", token, { httpOnly: true });
          res.status(200).json({ success: true, res: newUser });
        }
      );
    } else {
      res.status(401).json({ msg: "Wrong credentials" });
    }
  } catch (e) {
    res.status(500).json({ msg: "Internal Server Error." });
  }
};

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
  
    const result = await user.save();
    const newUser = {
      id: result._id,
      name: result.name,
      email: result.email,
    };
    jwt.sign(
      newUser,
      process.env.JSON_WEB_TOKEN_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.cookie("x-access-token", token, { httpOnly: true });
        res.status(201).json({
          success: true,
          res: newUser,
        });
      }
    );
  } catch(e) {
    res.status(500).json({ msg: "Internal Server Error." })
  }
};

exports.getUser = async (req, res, next) => {
  var token = req.cookies["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, msg: "No token provided." });

  jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, msg: "Failed to authenticate token." });

    res.status(200).send(decoded);
  });
};

exports.logoutUser = async (req, res, next) => {
  res.cookie("x-access-token", "", { httpOnly: true, expiresIn: new Date(0) });
  res.send({ success: true });
};

