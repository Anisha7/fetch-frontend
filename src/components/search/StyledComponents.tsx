
import { styled } from "@mui/material/styles";
import {
    Box,
    Button,
  } from "@mui/material";

// Styled Components
export const SearchBarContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: "8px 16px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: 800,
    flexDirection: "row",
    gap: 8,
  
    // margin and spacing
    margin: "40px auto",

    // Responsive styles for mobile (column layout)
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      borderRadius: 20,
      padding: "16px",
      margin: "20px auto",
    },

  }));
  
export const SearchSection = styled(Box)(({ theme }) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "0 16px",
    "&:not(:last-child)": {
      borderRight: "1px solid #ddd",
    },
    position: 'relative',
  }));
  
export const SearchLabel = styled("span")({
    fontSize: 12,
    fontWeight: 600,
    color: "#333",
    marginBottom: 4,
  });
  
export const SearchButton = styled(Button)({
    minWidth: 50,
    height: 50,
    borderRadius: "50%",
    backgroundColor: "#111",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#444",
    },
  });
  
export const ChipsContainer = styled(Box)(({ theme }) => ({
      marginTop: 8,
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      position: "absolute",
      top: 60,
    }));
  