const express = require("express");
const router = express.Router();
const {
  getUserById,
  feed,
  getAllPendingConnectionsRequests,
  getAllConnections,
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/middlewares");

router.route("/:id").post(verifyJWT, getUserById);
router.route("/feed").get(verifyJWT, feed);
router.route("/connections").get(verifyJWT, getAllConnections);
router
  .route("/connections/received-requests")
  .get(verifyJWT, getAllPendingConnectionsRequests);

module.exports = router;
