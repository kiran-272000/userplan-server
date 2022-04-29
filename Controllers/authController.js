const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");

const signInToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = async (req, res) => {
  const data = req.body;

  const isUserexist = await User.find({ email: data.email });

  if (!isUserexist.length) {
    try {
      const newUser = await User.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

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
      return res.status(400).json({
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

exports.getUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const user = await User.findOne({ _id: userId });
    res.status(200).json({
      status: "Success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      message: "Login Failed",
    });
  }
};

exports.updatePlan = async (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    const updatingPlan = await Plan.findOne({ name: data.plan });
    const user = await User.findOne({ _id: userId });
    const currentPlan = await Plan.findOne({ name: user.currentPlan });
    if (updatingPlan.priority === currentPlan.priority + 1) {
      const updatedPlan = await User.updateOne(
        { _id: userId },
        { $set: { currentPlan: data.plan } }
      );
      res.status(200).json({
        status: "Success",
        message: `Plan upgraded to ${data.plan}`,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Login Failed",
    });
  }
};
