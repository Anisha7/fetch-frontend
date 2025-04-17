import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { handleLogoutAndRedirect } from "../../utils/auth";

/**
 * LogoutButton is a floating icon button that triggers user logout.
 * It clears the auth session and any locally stored favorite dogs,
 * then redirects the user to the login page.
 */
const LogoutButton = () => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Logout">
      <IconButton
        onClick={() => handleLogoutAndRedirect(navigate)}
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