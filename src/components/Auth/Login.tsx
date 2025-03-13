import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { login } from "../../apis/auth";
import { useNavigate } from "react-router-dom";
import { LoginContainer, PageContainer } from "./StyledComponents";

const Login: React.FC = () => {
  const navigate = useNavigate();

  // State Variables
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // TODO: RENAME + THINK BETTER ORGANIZATION
  const [hasError, setHasError] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string|null>(null);

  const handleRedirectOnLogin = () => {
    navigate("/search")
  }

  const onSubmit = async (e: React.FormEvent) => {
    // Prevent page reload
    e.preventDefault();

    if (!isValidEmail(email)) {
      setHasError(true);
      return;
    }

    // Submit to Login API
    try {
      // Saves auth key automatically
      await login({ name, email })
      // Redirect if successful
      handleRedirectOnLogin();
    } catch (err) {
      // TODO: Add error handling
      setSubmitError("Login Failed. Please try again!")
    }
  };

  const isValidEmail = (email: string): boolean => {
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return Boolean(email.match(re));
  };

  return (
    <PageContainer>
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
        {/* TODO: STYLE SUBMIT ERROR HERE  */}
        {submitError && <p>{submitError}</p>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enter
        </Button>
      </LoginContainer>
    </PageContainer>
  );
};

export default Login;
