import React from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

const Loading = ({ message = "Loading..." }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      open={true}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h6">{message}</Typography>
    </Backdrop>
  );
};

export default Loading;
