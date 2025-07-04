import React, { useState } from "react";
import FormRenderer from "../components/form/FormRenderer";
import { Paper, Typography, Box, Alert, Link, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";

const loginFields = [
  { name: "email", label: "Email", type: "text", inputType: "email" },
  { name: "password", label: "Password", type: "text", inputType: "password" },
];

const LoginPage = () => {
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formValues
      );

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data?.user.id);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormRenderer
          formData={loginFields}
          formValues={formValues}
          setFormValues={setFormValues}
          onChange={(name, value) =>
            setFormValues((prev) => ({ ...prev, [name]: value }))
          }
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>

      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Don’t have an account?{" "}
          <Link href="/register" underline="hover">
            Register
          </Link>
        </Typography>
      </Box>
    </Paper>
  );
};

export default LoginPage;
