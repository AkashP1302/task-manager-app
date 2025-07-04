import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Paper, Stack, Typography, Box } from "@mui/material";
import TaskCard from "./TaskCard";

const TaskColumn = ({
  status,
  tasks,
  onTaskClick,
  statusColors,
  onTaskDelete,
}) => (
  <Box key={status} flex={1} minWidth={300}>
    <Paper
      elevation={4}
      sx={{
        p: 2,
        height: "80vh",
        backgroundColor: "#fff",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        color="primary"
        mb={2}
        textAlign="center"
        sx={{ borderBottom: "1px solid #ddd", pb: 1 }}
      >
        {status}
      </Typography>

      <Droppable droppableId={status}>
        {(provided) => (
          <Stack
            ref={provided.innerRef}
            {...provided.droppableProps}
            spacing={2}
            sx={{ flex: 1, overflowY: "auto", px: 1 }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task)}
                      backgroundColor={statusColors[status]}
                      onDelete={onTaskDelete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </Paper>
  </Box>
);

export default TaskColumn;
