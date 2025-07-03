// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { uploadProfileImage } = require("../controllers/userController");

router.post(
  "/upload-profile",
  protect,
  upload.single("profile"),
  uploadProfileImage
);

module.exports = router;
