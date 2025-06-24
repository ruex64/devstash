const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign({ uid: user.uid, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ uid: user.uid }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = { generateAccessToken, generateRefreshToken };
