"use client";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
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

interface MileStoneModelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MileStoneModel({ open, setOpen }: MileStoneModelProps) {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [breakdowns, setBreakdowns] = useState([{ description: "", time: "" }]);
  const { toast, setToast } = useToast();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/goals`);
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const handleAddBreakdown = () => {
    setBreakdowns([...breakdowns, { description: "", time: "" }]);
  };

  const handleRemoveBreakdown = (index: number) => {
    const updatedBreakdowns = breakdowns.filter((_, i) => i !== index);
    setBreakdowns(updatedBreakdowns);
  };

  const handleBreakdownChange = (
    index: number,
    field: "description" | "time",
    value: string
  ) => {
    const updatedBreakdowns = [...breakdowns];
    updatedBreakdowns[index][field] = value;
    setBreakdowns(updatedBreakdowns);
  };

   const handleSubmit = async () => {
    if (selectedGoal && breakdowns.every((b) => b.description && b.time)) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/milestones`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              goal_id: selectedGoal,
              breakdown: breakdowns,
            }),
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create milestone");
        }
  
        const data = await response.json();
        console.log("Milestone created:", data);
  
        // Reset form
        setBreakdowns([{ description: "", time: "" }]);
        setSelectedGoal("");
  
        setToast({
          open: true,
          message: "Milestone Created Successfully",
          type: "success",
        });
      } catch (error) {
        console.error("Error creating milestone:", error);
        setToast({
          open: true,
          message: error instanceof Error ? error.message : "Something went wrong!",
          type: "error",
        });
      }
    } else {
      setToast({
        open: true,
        message: "Please fill out all fields for the milestone.",
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
        Add Milestone
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
        <TextField
          fullWidth
          select
          label="Select Goal"
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="" disabled>
            Select a Goal
          </MenuItem>
          {goals.map((goal: any) => (
            <MenuItem key={goal._id} value={goal._id}>
              {goal.title}
            </MenuItem>
          ))}
        </TextField>

        {breakdowns.map((breakdown, index) => (
          <div
            key={index}
            className="grid md:grid-cols-3 grid-cols-1 gap-3 mb-4"
          >
            <TextField
              fullWidth
              label={`Breakdown ${index + 1} Description`}
              variant="outlined"
              value={breakdown.description}
              onChange={(e) =>
                handleBreakdownChange(index, "description", e.target.value)
              }
            />
            <TextField
              fullWidth
              label={`Breakdown ${index + 1} Time`}
              variant="outlined"
              value={breakdown.time}
              onChange={(e) =>
                handleBreakdownChange(index, "time", e.target.value)
              }
            />
            <button
              color="secondary"
              onClick={() => handleRemoveBreakdown(index)}
              className="bg-red-500 text-white px-4 mt-2  h-[40px] flex justify-center items-center rounded-[4px] hover:bg-red-600 transition duration-200"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleAddBreakdown} className="bg-blue-500 text-white px-4 py-2 rounded-[4px] hover:bg-blue-600 transition duration-200">
          Add Breakdown
        </button>
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