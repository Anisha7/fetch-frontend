import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchDogs } from "../../apis/dogs";
import LogoutButton from "../LogoutButton/LogoutButton";
import { Box } from "@mui/material";

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
          navigate("/", { replace: true });
        }
      } catch (e) {
        navigate("/", { replace: true });
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