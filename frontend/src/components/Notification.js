import { Snackbar, Alert } from "@mui/material";

const Notification = ({ open, message, type, onClose }) => (
  <Snackbar
    open={open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
  >
    <Alert
      onClose={onClose}
      severity={type}
      variant="filled"
      sx={{ width: "100%" }}
    >
      {message}
    </Alert>
  </Snackbar>
);

export default Notification;
