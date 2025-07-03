// controllers/userController.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const uploadDir = path.join(__dirname, "../uploads", userId.toString());
    fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `profile-${Date.now()}.jpeg`;
    const filepath = path.join(uploadDir, filename);

    // Resize + convert to JPEG
    await sharp(req.file.buffer)
      .resize(200, 200)
      .jpeg({ quality: 90 })
      .toFile(filepath);

    // Save URL to user
    const imageUrl = `/uploads/${userId}/${filename}`;
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: imageUrl,
      user,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Image upload failed", error: err.message });
  }
};
