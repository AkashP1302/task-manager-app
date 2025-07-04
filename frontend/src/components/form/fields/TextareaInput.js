import { TextField } from "@mui/material";

const TextareaInput = ({ field, value, onChange, rows = 3 }) => {
  return (
    <TextField
      label={field.label}
      type={field.inputType || "text"}
      fullWidth
      multiline
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextareaInput;
