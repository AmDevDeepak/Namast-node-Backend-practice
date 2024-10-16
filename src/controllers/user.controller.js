const UserRepository = require("../repository/user.repository");
const ConnectionRepository = require("../repository/connection.repository");

const userRepo = new UserRepository();
const connectionRepo = new ConnectionRepository();

const getUserById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) throw new Error("Missing user id");
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Error while user findining user",
      error: error,
    });
  }
};

const feed = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error("Missing user id");
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const page = parseInt(req?.query?.page) || 1;

    let limit = parseInt(req?.query?.limit) || 10;
    limit = limit > 100 ? 100 : limit;
    const skip = (page - 1) * limit;
    const users = await userRepo.getAllUsersForFeed(userId, skip, limit);
    return res.status(200).json({
      message: " Fetched users for feed, successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Error while fetching feed",
      error: error,
    });
  }
};

const getAllPendingConnectionsRequests = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error("Missing user id");
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await connectionRepo.getAllPendingConnections(userId);
    return res.status(200).json({
      message: "Received Connections requests fetched successfully",
      connections: connections,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error?.message || "Error while fetching pending connections requests",
      error: error,
    });
  }
};

const getAllConnections = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error("Missing user id");
    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await connectionRepo.getAllConnections(userId);
    return res.status(200).json({
      message: "Connections fetched successfully",
      connections: connections,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Error while fetching your connections.",
      error: error,
    });
  }
};

module.exports = {
  getUserById,
  feed,
  getAllPendingConnectionsRequests,
  getAllConnections,
};
