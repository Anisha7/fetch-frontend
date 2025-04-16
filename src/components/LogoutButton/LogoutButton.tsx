// components/LogoutButton.tsx
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { logout } from "../../apis/auth";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Cookies.remove("isLoggedIn"); // Optional: if you’re still setting this
    // Auth cookie will expire anyway — redirecting is enough
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <Tooltip title="Logout">
      <IconButton
        onClick={handleLogout}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
          color: "black",
        }}
      >
        <ExitToAppIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LogoutButton;