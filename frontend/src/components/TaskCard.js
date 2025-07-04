import { Paper, Typography, Box, Avatar, Button, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
const TaskCard = ({ task, onClick, backgroundColor, onDelete }) => {
  const userName = task.user?.name || "Unassigned";
  const userPhoto = task.user?.profileImage
    ? `http://localhost:5000${task.user.profileImage}`
    : null;

  return (
    <Paper
      onClick={onClick}
      elevation={2}
      sx={{
        p: 2,
        backgroundColor,
        borderRadius: 2,
        cursor: "pointer",
        ":hover": { boxShadow: 4 },
        position: "relative",
      }}
    >
      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
        {task.title}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
        {task.description}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Avatar src={userPhoto} alt={userName} sx={{ width: 28, height: 28 }} />
        <Typography variant="caption" color="text.secondary">
          {userName}
        </Typography>
      </Stack>

      <Box
        mt={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        {/* View (Preview) button on the left */}
        {task.attachments?.length > 0 ? (
          <a
            href={`http://localhost:5000${task.attachments[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "#1976D2",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
            }}
          >
            <PreviewIcon />
          </a>
        ) : (
          <Box />
        )}

        {/* Delete button on the right */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          size="small"
          color="error"
        >
          <DeleteIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default TaskCard;
