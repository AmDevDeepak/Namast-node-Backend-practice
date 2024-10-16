const jwt = require("jsonwebtoken");
const config = require("../config/server.config");
const { JWT_SECRET } = config;

const verifyJWT = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("You'll need to login.");
    }
    const payload = await jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error?.message || "Invalid JWT token",
      error: error,
    });
  }
};

module.exports = {
  verifyJWT,
};
