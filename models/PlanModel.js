const mongoose = require("mongoose");

const planSchema = mongoose.Schema({
  name: String,
  priority: Number,
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
