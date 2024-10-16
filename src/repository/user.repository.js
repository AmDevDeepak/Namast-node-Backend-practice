const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/server.config");
const Connection = require("../models/connection.model");
const { JWT_SECRET, JWT_EXPIRATION_TIME } = config;

class UserRepository {
  async findUser(email) {
    try {
      return await User.findOne({ email: email });
    } catch (error) {
      console.error(
        "Error occurred in user repository while retrieving user information",
        error
      );
    }
  }
  async createUser(userData) {
    try {
      const existingUser = await this.findUser(userData.email);
      if (existingUser) {
        throw new Error("User with the given email already exists");
      }
      const user = await User.create(userData);
      return user;
    } catch (error) {
      console.error(
        "Error occurred in user repository while creating user",
        error
      );
      throw error;
    }
  }
  async getAllUsersForFeed(userId, skip, limit) {
    try {
      const connections = await Connection.find({
        $or: [{ from: userId }, { to: userId }],
      })
        .select("from to")
        .populate("from", "firstName lastName")
        .populate("to", "firstName lastName");

      const hiddenUsers = new Set();
      connections.forEach((connection) => {
        hiddenUsers.add(connection.from);
        hiddenUsers.add(connection.to);
      });

      const users = await User.find({
        $and: [
          {
            _id: {
              $nin: Array.from(hiddenUsers),
            },
          },
          {
            _id: {
              $ne: userId,
            },
          },
        ],
      })
        .select("firstName lastName age pictureUrl gender")
        .skip(skip)
        .limit(limit);
      return users;
    } catch (error) {
      console.error(
        "Error occurred in user repository while retrieving feed.",
        error
      );
    }
  }
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select({
        email: 1,
        firstName: 1,
        gender: 1,
        age: 1,
        lastName: 1,
        bio: 1,
        skills: 1,
        pictureUrl: 1,
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error(
        "Error occurred in user repository while finding the user by id",
        error
      );
    }
  }
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error(
        "Error occurred in user repository while deleting the user by id",
        error
      );
    }
  }
  async updateUser(userId, data) {
    try {
      const user = await User.findByIdAndUpdate(userId, data);
      if (!user) {
        throw new Error("User not found");
      }
      await user.save();
      return user;
    } catch (error) {
      console.error(
        "Error occurred in user repository while updating the user details",
        error
      );
    }
  }

  async updateUserPassword(userId, newPassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error(
        "Error occurred in user repository while updating the user password",
        error
      );
    }
  }

  async validateUserForLogin(email, password) {
    try {
      const existingUser = await this.findUser(email);
      if (!existingUser) {
        throw new Error("Invalid credentials");
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        throw new Error("Invalid credentials");
      }
      // Generating a token
      const token = await jwt.sign({ userId: existingUser._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION_TIME,
      });
      return {
        user: existingUser,
        token,
      };
    } catch (error) {
      console.error(
        "Error occurred in user repository while logging the user in.",
        error
      );
    }
  }

  async validateOldPassword(oldPassword, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isPasswordCorrect) {
        throw new Error("Incorrect old password");
      }
      return isPasswordCorrect;
    } catch (error) {
      console.error(
        "Error occurred in user repository while logging the user in.",
        error
      );
    }
  }
}
module.exports = UserRepository;
