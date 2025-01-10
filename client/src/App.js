import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import { theme } from "./theme";
import Navbar from "./components/Navbar";
import Routes from "./Routes";
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.default",
            }}
          >
            <Navbar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 3,
                px: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <Routes />
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
