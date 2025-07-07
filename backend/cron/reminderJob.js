// cron/reminderJob.js
const cron = require("node-cron");
const Task = require("../models/Task");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const scheduleTaskReminder = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log("Running daily task reminder job at 8 AM");

    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

    try {
      const tasks = await Task.find({
        dueDate: { $gte: new Date(today), $lt: new Date(`${today}T23:59:59`) },
        status: { $ne: "Completed" },
      }).populate("user");

      for (const task of tasks) {
        const userEmail = task.user.email;
        await sendEmail(
          userEmail,
          "Task Due Reminder",
          `Reminder: Your task "${task.title}" is due today.`
        );
      }

      console.log(`Reminders sent for ${tasks.length} due tasks`);
    } catch (error) {
      console.error("Error in task reminder cron job:", error.message);
    }
  });
};

module.exports = scheduleTaskReminder;
