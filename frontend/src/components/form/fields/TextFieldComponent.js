import { TextField } from "@mui/material";

const TextFieldComponent = ({ field, value, onChange }) => (
  <TextField
    label={field.label}
    type={field.inputType || "text"}
    fullWidth
    margin="normal"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default TextFieldComponent;
