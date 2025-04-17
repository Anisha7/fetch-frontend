/** Styled components for the PetSearchBar UI layout */

import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

/**
 * Container for the overall search bar, horizontally aligned on desktop
 * and vertically stacked on small screens.
 */
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
  margin: "40px auto",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    borderRadius: 20,
    padding: "16px",
    margin: "20px auto",
  },
}));

/**
 * Section wrapper for each input field within the search bar.
 * Adds a vertical layout and an optional right border.
 */
export const SearchSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "0 16px",
  "&:not(:last-child)": {
    borderRight: "1px solid #ddd",
  },
  position: "relative",
}));

/**
 * Label for each input section in the search form.
 */
export const SearchLabel = styled("span")({
  fontSize: 12,
  fontWeight: 600,
  color: "#333",
  marginBottom: 4,
});

/**
 * Styled circular search button.
 */
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

/**
 * Wrapper for chips (autocomplete tags) in case of overflow display.
 */
export const ChipsContainer = styled(Box)(({ theme }) => ({
  marginTop: 8,
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  position: "absolute",
  top: 60,
}));
