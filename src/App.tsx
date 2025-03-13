import React from "react";
import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Auth/Login";
import { createTheme, ThemeProvider } from "@mui/material";
import Search from "./components/Search";

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

// TODO: navbar with Logout/login button
// TODO: cute svg dog animation
function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Make below a ProtectedRoute -> if no auth key, user should not be able to go here. 
            Either show an Error page "You must login to access this page. With login button" or redirect to Login  */}
            <Route path="/search" element={<Search />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
