// src/pages/DashboardPage.js

import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Grid, Button } from "@mui/material";
import { DragDropContext } from "@hello-pangea/dnd";
import TaskColumn from "../components/TaskColumn";
import TaskModal from "../components/TaskModal";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import LogoutIcon from "@mui/icons-material/Logout";
import useApi from "../hooks/useApi";
import useNotification from "../hooks/useNotification";
import Notification from "../components/Notification";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const statuses = ["Pending", "Completed"];
const statusColors = {
  Pending: "#FFFAE6",
  Completed: "#E6FFED",
};

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [taskUpdates, setTaskUpdates] = useState([]);

  const navigate = useNavigate();
  const { request: apiRequest, loading: loader } = useApi();
  const { notification, showNotification, closeNotification } =
    useNotification();

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const data = await apiRequest({ url: "/tasks" });
      setTasks(data.data || []);
    } catch (err) {}
  };

  // Save (Create/Update) task
  const handleSaveTask = async () => {
    if (!currentTask) return;

    const formData = new FormData();
    formData.append("title", currentTask.title);
    formData.append("description", currentTask.description);
    formData.append("status", currentTask.status || "Pending");
    formData.append("dueDate", currentTask.dueDate || new Date().toISOString());
    if (currentTask.user?._id) {
      formData.append("userId", currentTask.user._id);
    }
    if (selectedFile) {
      formData.append("attachments", selectedFile);
    }

    const isUpdate = !!currentTask._id;
    const url = isUpdate ? `/tasks/${currentTask._id}` : `/tasks/create`;
    const method = isUpdate ? "patch" : "post";

    try {
      await apiRequest({
        url,
        method,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        successMessage: isUpdate ? "Task updated" : "New Task Created",
      });
      fetchTasks();
      handleCloseModal();
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to save task";
      showNotification(errorMsg, "error");
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await apiRequest({
        url: `/tasks/${taskId}`,
        method: "delete",
        successMessage: "Task deleted successfully",
      });
      fetchTasks();
      handleCloseModal();
    } catch (err) {}
  };

  // Update task status (used in drag & drop)
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await apiRequest({
        url: `/tasks/${taskId}`,
        method: "patch",
        data: { status: newStatus },
        successMessage: "Task updated successfully",
        errorMessage: "Failed to update task",
      });
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  // Handle drag & drop between columns
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const updatedTasks = tasks.map((task) =>
      task._id === draggableId
        ? { ...task, status: destination.droppableId }
        : task
    );

    setTasks(updatedTasks);
    updateTaskStatus(draggableId, destination.droppableId);
  };

  // Download CSV report
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/tasks/export/csv",
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("CSV download failed:", error);
    }
  };

  // Modal open/close
  const handleOpenTask = (task) => {
    setCurrentTask(task);
    setSelectedFile(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentTask(null);
    setSelectedFile(null);
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, []);

  // Socket listener

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    socket.on("taskStatusUpdated", (data) => {
      showNotification(
        `Task "${data.title}" marked as "${data.status}" by ${
          data.user?.name || data.updatedBy
        }`,
        "info"
      );

      setTasks((prev) =>
        prev.map((task) => (task._id === data._id ? data : task))
      );
    });

    socket.on("taskUpdated", (data) => {
      showNotification(
        `Task "${data.title}" was updated by ${data.user?.name || "System"}`,
        "success"
      );

      setTasks((prev) =>
        prev.map((task) => (task._id === data._id ? data : task))
      );
    });

    return () => {
      socket.off("taskStatusUpdated");
      socket.off("taskUpdated");
      socket.disconnect();
    };
  }, []);

  if (loader) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "80vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Box sx={{ px: 4, py: 2, backgroundColor: "#f4f5f7", minHeight: "100vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Task Board
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            variant="contained"
            onClick={() => {
              setCurrentTask({ title: "", description: "", status: "Pending" });
              setOpenModal(true);
            }}
          >
            <AddIcon /> New Task
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleDownload}>
            <DownloadIcon /> Download CSV
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              navigate("/");
            }}
          >
            <LogoutIcon />
          </Button>
        </Box>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          display="flex"
          gap={2}
          flexWrap="nowrap"
          overflow="auto"
          minHeight="86vh"
        >
          {statuses.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              onTaskClick={handleOpenTask}
              onTaskDelete={handleDeleteTask}
              statusColors={statusColors}
            />
          ))}
        </Box>
      </DragDropContext>

      <TaskModal
        open={openModal}
        onClose={handleCloseModal}
        task={currentTask}
        setTask={setCurrentTask}
        onSave={handleSaveTask}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </Box>
  );
};

export default DashboardPage;
