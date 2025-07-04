import { Button } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
const ImageUploadComponent = ({ field, value, onFileChange }) => {
  const handleFileChange = (e) => {
    onFileChange(e.target.files[0]);
  };

  return (
    <>
      <Button variant="outlined" component="label" sx={{ mt: 2 }}>
        <FileUploadIcon />
        {field.label}
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {value && <p style={{ fontSize: 12, marginTop: 4 }}>{value.name}</p>}
    </>
  );
};

export default ImageUploadComponent;
