"use client";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface GoalModelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GoalModel({ open, setOpen }: GoalModelProps) {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState("");
  const { toast, setToast } = useToast();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/counsellors`
      );
      const data = await response.json();
      setCounsellors(data);
    } catch (error) {
      console.error("Error fetching counsellors:", error);
    }
  };

   const handleSubmit = async () => {
    if (goalTitle && goalDescription && selectedCounsellor) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/goals`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: goalTitle,
              description: goalDescription,
              counsellor_id: selectedCounsellor, // Use the selected counsellor's _id
            }),
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create goal");
        }
  
        const data = await response.json();
        console.log("Goal created:", data);
  
        // Reset form
        setGoalTitle("");
        setGoalDescription("");
        setSelectedCounsellor("");
  
        setToast({
          open: true,
          message: "Goal Created Successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Error creating goal:", error);
        setToast({
          open: true,
          message: error instanceof Error ? error.message : "Something went wrong!",
          type: "error",
        });
      }
    } else {
      setToast({
        open: true,
        message: "Please fill all fields!",
        type: "error",
      });
    }
  };
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="dialog-title"
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxHeight: 600,
        },
      }}
    >
      <DialogTitle id="dialog-title">
        Add Goal
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          <TextField
            fullWidth
            sx={{
              "& .MuiInputBase-input": {
                height: "20px",
              },
            }}
            margin="normal"
            label="Goal Title"
            variant="outlined"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />
          <TextField
            fullWidth
            sx={{
              "& .MuiInputBase-input": {
                height: "20px",
              },
            }}
            margin="normal"
            label="Goal Description"
            variant="outlined"
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
          />
          <TextField
            fullWidth
            select
            label="Select Counsellor"
            value={selectedCounsellor} // Bind the selected value
            SelectProps={{
              native: true,
            }}
            variant="outlined"
            margin="normal"
            onChange={(e) => setSelectedCounsellor(e.target.value)} // Set the selected counsellor's _id
          >
            <option value="" disabled>
              Select Counsellor
            </option>
            {counsellors.map((counsellor: any) => (
              <option key={counsellor._id} value={counsellor._id}>
                {counsellor.name}
              </option>
            ))}
          </TextField>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Dialog>
  );
}