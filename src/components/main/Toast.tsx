"use client";
import * as React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";

interface ToastProps {
  open: boolean;
  message: string;
  type: AlertColor; // 'success' | 'error' | 'info' | 'warning'
  duration?: number; // Optional: Auto-hide duration in milliseconds
  onClose?: () => void; // Optional: Callback when the toast is closed
}

export default function Toast({
  open,
  message,
  type,
  duration = 6000,
  onClose,
}: ToastProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }} // Optional: Position of the toast
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{
          width: "100%",
          "& .MuiAlert-icon": {
            color: "white", // Change the icon color to white
          },
          "& .MuiAlert-action button": {
            color: "white", // Change the close icon color to white
          },
        }}
      >
        <span className="text-white">{message}</span>
      </Alert>
    </Snackbar>
  );
}