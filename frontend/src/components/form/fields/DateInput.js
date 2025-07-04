import { TextField } from "@mui/material";

const DateInput = ({ field, value, onChange, name }) => {
  return (
    <TextField
      label={field.label}
      InputLabelProps={{ shrink: true }}
      type={"date"}
      fullWidth
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default DateInput;
