import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { login } from "../../apis/auth";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import AnimatedDog from "../dog/AnimatedDog";
import { searchDogs } from "../../apis/dogs";

// Container for full-screen centered layout
export const PageContainer = styled(Box)(() => ({
  borderRadius: 8,
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
}));

// Container for the login form
export const LoginContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 8,
  transition: "all 0.3s ease",
  "& > *": {
    textAlign: "center",
    margin: "10px !important",
  },
}));

/**
 * Login component that captures user name and email, validates input,
 * and initiates authentication via the login API.
 * Displays animated dog, handles errors, and redirects to the search page on success.
 */
const Login: React.FC = () => {
  const navigate = useNavigate();

  // === 🧠 Form State ===
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // gh-pages edge case - if user is logged in, redirect to /search
  // Note: for now, we won't handle the above case due to 404 on /auth/logout endpoint

  // Redirects to search page after successful login
  const handleRedirectOnLogin = () => {
    navigate("/search");
  };

  // Validates and submits login form
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setHasError(true);
      return;
    }

    try {
      await login({ name, email });
      handleRedirectOnLogin();
    } catch (err) {
      setSubmitError("Login Failed. Please try again!");
    }
  };

  // Basic email validation regex
  const isValidEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return Boolean(email.match(re));
  };

  return (
    <PageContainer>
      <AnimatedDog />
      <LoginContainer as="form" onSubmit={onSubmit}>
        <TextField
          required
          label="Name"
          variant="outlined"
          fullWidth
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="John Wick"
        />

        <TextField
          required
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={hasError}
          placeholder="example@gmail.com"
        />

        {submitError && (
          <Typography color="error" fontSize="0.875rem">
            {submitError}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enter
        </Button>
      </LoginContainer>
    </PageContainer>
  );
};

export default Login;