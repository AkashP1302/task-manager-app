// controllers/taskController.js
const fs = require("fs");
const path = require("path");
const Task = require("../models/Task");
const { Parser } = require("json2csv");
const { v4: uuid } = require("uuid");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

exports.createTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, description, status, dueDate } = req.body;

    const task = await Task.create({
      user: userId,
      title,
      description,
      status,
      dueDate,
    });

    const taskDir = path.join(
      __dirname,
      "../uploads",
      userId.toString(),
      task._id.toString()
    );
    fs.mkdirSync(taskDir, { recursive: true });

    const attachments = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `${uuid()}-${file.originalname}`;
        const filePath = path.join(taskDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        attachments.push(`/uploads/${userId}/${task._id}/${fileName}`);
      }

      task.attachments = attachments;
      await task.save();
    }

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
    const user = await User.findById(userId);
    await sendEmail(
      user.email,
      "New Task Created",
      `Task "${title}" has been created.`
    );
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Task creation failed", error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    // { user: userId }
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email profileImage");

    // const tasks = await Task.find().populate("user", "name email");
    res.status(200).json({ data: tasks });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch task", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userIdFromToken = req.user._id;
    const taskId = req.params.id;

    let task = await Task.findOne({ _id: taskId, user: userIdFromToken });
    if (!task) {
      // Optional: Allow admin or creator to update
      task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
    }

    const wasCompleted = task.status === "Completed";
    const prevStatus = task.status;

    const { title, description, status, dueDate, userId } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;
    if (userId) task.user = userId;

    // Create attachment directory
    const taskDir = path.join(
      __dirname,
      "../uploads",
      task.user.toString(),
      taskId
    );
    fs.mkdirSync(taskDir, { recursive: true });

    const attachments = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filename = `${uuid()}-${file.originalname}`;
        const filepath = path.join(taskDir, filename);
        fs.writeFileSync(filepath, file.buffer);
        attachments.push(`/uploads/${task.user}/${taskId}/${filename}`);
      }
      task.attachments = attachments;
    }

    await task.save();

    // Fetch updated task with populated user
    const populatedTask = await Task.findById(task._id).populate("user");

    // Email if status changed to Completed
    if (status === "Completed" && !wasCompleted && populatedTask.user) {
      await sendEmail(
        populatedTask.user.email,
        "Task Completed",
        `Your task "${task.title}" has been marked as completed.`
      );
    }

    // Emit event only if status changed
    if (status && status !== prevStatus) {
      global.io.emit("taskStatusUpdated", populatedTask);
    }

    // Always emit a general update event
    global.io.emit("taskUpdated", populatedTask);

    return res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;

    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Delete attached files
    const taskDir = path.join(
      __dirname,
      "../uploads",
      userId.toString(),
      taskId
    );
    if (fs.existsSync(taskDir)) {
      fs.rmSync(taskDir, { recursive: true, force: true });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

exports.downloadTasksCSV = async (req, res) => {
  try {
    const userId = req.user._id;
    // { user: userId }
    const tasks = await Task.find();

    const fields = ["_id", "title", "status", "createdAt", "dueDate"];
    const parser = new Parser({ fields });
    const csv = parser.parse(tasks);

    res.header("Content-Type", "text/csv");
    res.attachment("tasks.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "CSV export failed", error: err.message });
  }
};
