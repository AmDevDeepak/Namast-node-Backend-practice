const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/middlewares");
const {
  getMyProfile,
  deleteMyProfile,
  editMyProfilePicture,
  editMyProfileDetails,
  editMyProfilePassword,
} = require("../controllers/profile.controller");

router.route("/").get(verifyJWT, getMyProfile);
router.route("/delete").delete(verifyJWT, deleteMyProfile);
router.route("/edit/details").patch(verifyJWT, editMyProfileDetails);
router.route("/edit/profile-picture").patch(verifyJWT, editMyProfilePicture);
router.route("/edit/password").patch(verifyJWT, editMyProfilePassword);

module.exports = router;
