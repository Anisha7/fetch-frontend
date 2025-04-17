import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchDogs } from "../../apis/dogs";
import LogoutButton from "./LogoutButton";
import { Box } from "@mui/material";
import { handleLogoutAndRedirect } from "../../utils/auth";

/**
 * ProtectedRoute is a wrapper component that checks if the user is authenticated
 * before rendering protected child components. If not authorized, it clears favorites
 * and redirects the user to the login page.
 *
 * @param children - React children to render if the user is authenticated.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await searchDogs({
          size: 1,
          from: 0,
        });

        if (res) {
          setAuthorized(true);
        } else {
          handleLogoutAndRedirect(navigate);
        }
      } catch (e) {
        handleLogoutAndRedirect(navigate);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (checking) return null; // or a loading spinner

  return <>
  <LogoutButton />
  {authorized && <Box pt={2}>{children}</Box>}
</>;
};

export default ProtectedRoute;