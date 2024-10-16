const Connection = require("../models/connection.model");
const User = require("../models/user.model");

class ConnectionRepository {
  async createConnection(from, to, status) {
    try {
      // Checking if the receiver is present in the database or not
      const user = await User.findById(to);
      if (!user)
        throw new Error("You're trying to send a request to invalid user");
      // Checking if the request is already exists
      const existingConnection = await Connection.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      });
      if (existingConnection)
        throw new Error("A connection request already exists");
      let connection = await Connection.create({
        from,
        to,
        status,
      });

      if (!connection) throw new Error("Couldn't create connection");
      connection = connection.populate({
        path: "to",
        select: "firstName lastName",
      });
      return connection;
    } catch (error) {
      console.error(
        "Something went wrong in connection repository while creating the new connection.",
        error
      );
      throw error;
    }
  }

  async reviewConnection(to, action, connectionId) {
    try {
      const connection = await Connection.findOne({
        _id: connectionId,
        to: to,
        status: "Interested",
      });
      if (!connection)
        throw new Error(
          "Couldn't find a connection or the connection might be already reviewed by you."
        );
      connection.status = action;
      await connection.save();
      return connection;
    } catch (error) {
      console.error(
        "Something went wrong in connection repository while sending your response to the connection.",
        error
      );
      throw error;
    }
  }

  async getAllConnections(userId) {
    try {
      const connections = await Connection.find({
        $or: [
          { to: userId, status: "Accepted" },
          { from: userId, status: "Accepted" },
        ],
      }).populate({
        path: "from to",
        select: "firstName lastName pictureUrl age",
      });
      if (!connections || connections.length === 0) return [];
      return connections;
    } catch (error) {
      console.error(
        "Something went wrong in connection repository while getting your connections.",
        error
      );
      throw error;
    }
  }

  async getAllPendingConnections(userId) {
    try {
      const connections = await Connection.find({
        to: userId,
        status: "Interested",
      }).populate({
        path: "from",
        select: "firstName lastName pictureUrl age",
      });
      if (!connections || connections.length === 0) return [];

      return connections;
    } catch (error) {
      console.error(
        "Something went wrong in connection repository while getting your pending connection requests.",
        error
      );
      throw error;
    }
  }
}

module.exports = ConnectionRepository;
