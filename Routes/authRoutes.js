const express = require("express");

const authController = require("../Controllers/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/getuser").get(authController.getUser);
router.route("/updateplan").post(authController.updatePlan);

module.exports = router;
