const express = require("express");
const router = express.Router();
const { login, logout, signup } = require("../controllers/auth.controller");
const { verifyJWT } = require("../middlewares/middlewares");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);

module.exports = router;
