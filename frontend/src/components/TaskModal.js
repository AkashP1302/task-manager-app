import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FormRenderer from "./form/FormRenderer";

const TaskModal = ({
  open,
  onClose,
  task,
  setTask,
  onSave,
  setSelectedFile,
}) => {
  const formFields = [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    // {
    //   name: "userId",
    //   label: "Assigned User",
    //   type: "select",
    //   options: users.map((u) => ({ label: u.name, value: u._id })),
    // },
    { name: "dueDate", label: "Due Date", type: "date" },
    { name: "attachments", label: "Upload File", type: "image" },
  ];

  const handleChange = (name, value) => {
    if (name === "userId") {
      setTask((prev) => ({
        ...prev,
      }));
    } else {
      setTask((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const getFormValues = () => ({
    title: task?.title || "",
    description: task?.description || "",
    userId: task?.user?._id || "",
    dueDate: task?.dueDate?.slice(0, 10) || "",
    attachments: "",
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{task?._id ? "Edit Task" : "Create Task"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <FormRenderer
            formData={formFields}
            formValues={getFormValues()}
            onChange={handleChange}
            onFileChange={setSelectedFile}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave}>
          {task?._id ? "Save Changes" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
