// controllers/authController.js
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redisClient");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    let profileImageUrl = "";

    // If profile image uploaded
    if (req.file) {
      const uploadDir = path.join(__dirname, "../uploads", email);
      fs.mkdirSync(uploadDir, { recursive: true });

      const filename = `profile-${Date.now()}.jpeg`;
      const filepath = path.join(uploadDir, filename);

      await sharp(req.file.buffer)
        .resize(200, 200)
        .jpeg({ quality: 90 })
        .toFile(filepath);

      profileImageUrl = `/uploads/${email}/${filename}`;
    }

    const user = await User.create({
      name,
      email,
      password,
      profileImage: profileImageUrl,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate token
    const token = generateToken(user._id);

    if (!redisClient.isOpen) {
      await redisClient.connect(); // Optional safeguard
    }

    await redisClient.set(user._id.toString(), token, {
      EX: 60 * 60 * 24,
    });

    // Respond with token and user info
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login failed:", err); // Add this
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
