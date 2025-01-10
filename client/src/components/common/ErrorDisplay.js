import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <Paper
      sx={{
        p: 3,
        textAlign: "center",
        maxWidth: 500,
        mx: "auto",
        mt: 4,
      }}
    >
      <ErrorIcon color="error" sx={{ fontSize: 60 }} />
      <Typography variant="h6" color="error" gutterBottom>
        Error
      </Typography>
      <Typography color="text.secondary" paragraph>
        {error}
      </Typography>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Paper>
  );
};

export default ErrorDisplay;
