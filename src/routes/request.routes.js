const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/middlewares");
const {
  sendRequest,
  reviewRequest,
} = require("../controllers/request.controller");

// Route for sending interest Request or ignore Request that will be sent by user
router.route("/:status/:userId").post(verifyJWT, sendRequest);

// Route for accept Request and reject Request that came to from
router.route("/review/:action/:connectionId").post(verifyJWT, reviewRequest);

module.exports = router;
