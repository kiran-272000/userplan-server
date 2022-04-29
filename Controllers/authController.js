const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");
// const Plan = require("../models/PlanModel");

const signInToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req, res) => {
  const data = req.body;

  //   const plan = await Plan.find();

  //   console.log(plan);

  const isUserexist = await User.find({ email: data.email });

  if (!isUserexist.length) {
    try {
      const newUser = await User.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      //   const token = signInToken(newUser._id);
      //   console.log(token);
      res.status(200).json({
        status: "success",
        message: "User Registered successfully",
      });
    } catch (err) {
      res.status(500).json({
        status: "failed",
        message: "Registration failed",
        error: err,
      });
    }
  } else {
    res.status(403).json({
      status: "failed",
      message: "User already existed",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(401).json({
        message: "Enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = signInToken(user._id);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: "Login Failed",
    });
  }
};
