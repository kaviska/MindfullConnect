"use client";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Toast from "@/components/main/Toast"
import { useToast } from "@/contexts/ToastContext";

export default function QuestionGroup() {
  const [questionGroupTitle, setQuestionGroupTitle] = useState("");
  const { toast, setToast } = useToast();
 

  const handleSubmitQuestionGroup = async () => {
    if (questionGroupTitle) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/question-group`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: questionGroupTitle,
            }),
          }
        );
        const data = await response.json();
        console.log("Question group created:", data);
        setToast({
          open:true,
          message:"Question Group Added Successfully",
          type:"success"
        })

      } catch (error) {
        console.error("Error creating question group:", error);
        //dispatch(showToast({ message: "Something went wrong!", severity: "error" }));

      }

      setQuestionGroupTitle("");
    } else {
      alert("Please provide a title for the question group.");
    }
  };
  return (
    <div>
      <TextField
        fullWidth
        sx={{ height: "50px" }}
        margin="normal"
        label="Question Group Title"
        variant="outlined"
        value={questionGroupTitle}
        onChange={(e) => setQuestionGroupTitle(e.target.value)}
      />
      <button
        className="mt-3 px-3 py-2 rounded-[4px] text-white bg-blue-500 "
        onClick={handleSubmitQuestionGroup}
      >
        Submit Question Group
      </button>


      <Toast
              open={toast.open}
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, open: false })}
            />
    </div>
  );
}
