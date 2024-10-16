const validator = require("validator");
const UserRepository = require("../repository/user.repository");
const userRepo = new UserRepository();

const getMyProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(401).json({ message: "User not found" });
    const user = await userRepo.getUserById(userId);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Error while fetching your profile",
      error: error,
    });
  }
};

const editMyProfileDetails = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(400).json({ message: "User not found" });

    const { firstName, lastName, age, skills, bio } = req.body;

    if (skills && skills.length > 20) {
      return res
        .status(400)
        .json({ message: "You cannot add more than 20 skills" });
    }

    const user = await userRepo.updateUser(userId, {
      firstName,
      lastName,
      age,
      skills,
      bio,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User details updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Error while updating user details",
      error: error,
    });
  }
};

const editMyProfilePicture = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(400).json({ message: "User not found" });
    const { pictureUrl } = req.body;
    if (!validator.isURL(pictureUrl)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    const user = await userRepo.updateUser(userId, { pictureUrl });
    if (!user) return res.status(500).json({ message: "User not found" });
    else {
      return res
        .status(200)
        .json({ message: "Profile picture updated successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Error while updating profile picture.",
      error: error,
    });
  }
};

const editMyProfilePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) return res.status(400).json({ message: "User not found" });
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Missing required fields" });
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ error: "Please enter a strong password." });
    }

    const isOldPasswordCorrect = await userRepo.validateOldPassword(
      oldPassword,
      userId
    );
    if (!isOldPasswordCorrect)
      return res.status(500).json({ message: "Incorrect old password" });

    const user = await userRepo.updateUserPassword(userId, newPassword);

    if (!user) return res.status(500).json({ message: "User not found" });
    else
      return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Error while updating your password.",
      error: error,
    });
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error("Missing user id");
    const user = await userRepo.deleteUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Error while deleting your profile",
      error: error,
    });
  }
};
module.exports = {
  getMyProfile,
  deleteMyProfile,
  editMyProfilePicture,
  editMyProfileDetails,
  editMyProfilePassword,
};
