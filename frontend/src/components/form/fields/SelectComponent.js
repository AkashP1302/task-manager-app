import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SelectComponent = ({ field, value, onChange }) => (
  <FormControl fullWidth margin="normal">
    <InputLabel>{field.label}</InputLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={field.label}
    >
      {field.options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SelectComponent;
