import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/pages/Login";
import {
  createTheme,
  ThemeProvider,
  Box,
  Typography,
  styled,
} from "@mui/material";
import Search from "./components/pages/Search";
import ProtectedRoute from "./components/layout/ProtectedRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: "#444", // Dark primary color
      contrastText: "#fff", // Ensures text remains readable
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#111",
          padding: 10,
          "&:hover": {
            backgroundColor: "#444", // Visible hover color
          },
        },
      },
    },
  },
});

const MobileMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  padding: theme.spacing(2),
  textAlign: "center",
}));

// TODO: navbar with Logout/login button
// TODO: cute svg dog animation
function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <ThemeProvider theme={theme}>
        <MobileMessage>
          <Typography variant="h4" gutterBottom>
            Rotate Your Device
          </Typography>
          <Typography variant="body1">
            This app is best viewed in landscape mode. Please flip your phone
            sideways to continue.
          </Typography>
        </MobileMessage>
      </ThemeProvider>
    );
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Make below a ProtectedRoute -> if no auth key, user should not be able to go here. 
            Either show an Error page "You must login to access this page. With login button" or redirect to Login  */}
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
