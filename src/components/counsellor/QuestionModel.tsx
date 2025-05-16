"use client";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import QuestionGroup from "./QuestionModel/QuestionGroup";
import Question from "./QuestionModel/Question";
import Quiz from "./QuestionModel/Quiz"


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface QuestionModelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QuestionModel({ open, setOpen }: QuestionModelProps) {
  const [tabIndex, setTabIndex] = useState(0);
  
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      slots={{ transition: Transition }}
      keepMounted
      onClose={handleClose}
      aria-labelledby="dialog-title"
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
        },
      }}
    >
      <DialogTitle id="dialog-title">
        Add Question
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
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="tabs">
          <Tab label="Question Group" />
          <Tab label="Question" />
          <Tab label="Quiz" />
        </Tabs>
        {tabIndex === 0 && (
          <QuestionGroup/>
         
        )}
        {tabIndex === 1 && (
          <Question/>
         
        )}
        {tabIndex === 2 && (
         <Quiz/>
        )}
      </DialogContent>

      <DialogActions>
        <button
          onClick={handleClose}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}
