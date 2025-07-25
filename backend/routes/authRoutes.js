// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", upload.single("profile"), register);
router.post("/login", login);

module.exports = router;
