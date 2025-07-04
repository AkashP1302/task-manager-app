import { useState } from "react";
import { Paper, Typography, Alert, Box, Link, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FormRenderer from "../components/form/FormRenderer";

const registerFields = [
  {
    name: "profileImage",
    label: "Profile Picture",
    type: "image",
  },
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text", inputType: "email" },
  { name: "password", label: "Password", type: "text", inputType: "password" },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "text",
    inputType: "password",
  },
];

const RegisterPage = () => {
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formValues.password !== formValues.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
        }
      );

      if (response.status === 201 || response.data.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 450, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Create an Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <FormRenderer
          formData={registerFields}
          formValues={formValues}
          onChange={(name, value) =>
            setFormValues((prev) => ({ ...prev, [name]: value }))
          }
          onSubmit={handleSubmit}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="/" underline="hover">
            Login
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default RegisterPage;
