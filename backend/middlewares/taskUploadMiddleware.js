// middlewares/taskUploadMiddleware.js
const multer = require("multer");

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|docx|jpg|jpeg|png/;
  const ext = file.originalname.toLowerCase().split(".").pop();
  const isValid = allowed.test(ext);
  if (isValid) cb(null, true);
  else cb(new Error("Only PDF, DOCX, JPG, PNG files allowed"));
};

const storage = multer.memoryStorage(); // we’ll manually store using fs

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter,
});

module.exports = upload.array("attachments", 5); // max 5 files
