// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/taskUploadMiddleware");
const { createTask } = require("../controllers/taskController");
const { getTasks } = require("../controllers/taskController");
const { updateTask } = require("../controllers/taskController");
const { deleteTask } = require("../controllers/taskController");
const { getTaskById } = require("../controllers/taskController");
const { downloadTasksCSV } = require("../controllers/taskController");

router.post("/create", protect, upload, createTask);
router.get("/", protect, getTasks); // GET /api/tasks
router.get("/:id", protect, getTaskById);
router.patch("/:id", protect, upload, updateTask);
router.delete("/:id", protect, deleteTask);
router.get("/export/csv", protect, downloadTasksCSV);

module.exports = router;
