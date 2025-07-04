import { Box } from "@mui/material";
import { fieldComponents } from "./inputTypes";

const FormRenderer = ({ formData, formValues, onChange, onFileChange }) => {
  return (
    <Box>
      {formData.map((field) => {
        const Component = fieldComponents[field.type];
        if (!Component) return null;

        return (
          <Component
            key={field.name}
            field={field}
            value={formValues[field.name] || ""}
            onChange={(val) => onChange(field.name, val)}
            onFileChange={onFileChange}
          />
        );
      })}
    </Box>
  );
};

export default FormRenderer;
