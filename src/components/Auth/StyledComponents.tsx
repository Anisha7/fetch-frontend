import { Box, styled } from "@mui/material";

export const PageContainer = styled(Box)(() => ({
  borderRadius: 8,
  width: "100vw",
  height: "100vh",
  // Center styles
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
}));

export const LoginContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "component",
})(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 8,
  transition: "all 0.3s ease",
  "& > *": {
    textAlign: "center",
    margin: "10px !important",
  },
}));