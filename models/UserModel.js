const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    lowecase: true,
    validate: [validator.isEmail, "Please Provide valid email"],
  },
  phone: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
    minLength: 8,
  },
  currentPlan: {
    type: "string",
    required: true,
    default: "silver",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hashSync(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compareSync(enteredPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
