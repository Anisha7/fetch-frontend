import React from "react";
import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import { createTheme, ThemeProvider } from "@mui/material";

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
          backgroundColor: "#444",
          padding: 10,
          "&:hover": {
            backgroundColor: "#111", // Visible hover color
          },
        },
      },
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/search" element={<Search />} /> */}
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
