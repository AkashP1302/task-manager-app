# 📋 Real-Time Task Management App

A full-stack application for managing tasks with real-time updates and file uploads. Users can register, upload profile pictures, create, update, and complete tasks. All updates are pushed instantly to connected clients using Socket.IO.

---

## 🔧 Tech Stack

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- Multer + Sharp (for image/file handling)
- JWT Authentication

### Frontend

- React
- MUI (Material UI)
- Axios
- Socket.IO Client

---

## 📁 Features

- 🔐 **User Registration** with profile image upload
- ✅ **Task CRUD**
- 📂 **Attach files to tasks**
- 📨 **Real-time task updates via WebSockets**
- 🔔 **Toast notifications on task status change**
- 🔄 **Sync updated task data across users in real-time**
- 📧 **Email alert when a task is completed**

---

## 🚀 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/AkashP1302/task-manager-app
cd task-manager-app
```

# Backend

cd backend
npm install

# Frontend

cd ../frontend
npm install

cd ../backend
npm run dev

cd ../frontend
npm start

or

docker-compose up --build
