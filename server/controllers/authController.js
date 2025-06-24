const admin = require("../config/firebase");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");

const login = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, name, email, picture } = decoded;

    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({
        uid,
        displayName: name,
        email,
        photoURL: picture,
        role: "contributor"
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    }});

  } catch (err) {
    res.status(401).json({ message: "Invalid Firebase token", error: err.message });
  }
};

const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ uid: decoded.uid });
    if (!user) throw new Error("User not found");

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};

module.exports = { login, refresh, logout };
