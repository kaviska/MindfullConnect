import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast";

export default function Quiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questionGroups, setQuestionGroups] = useState([]);
  const [selectedQuestionGroup, setSelectedQuestionGroup] = useState("");
  const { toast, setToast } = useToast();

  useEffect(() => {
    // Fetch question groups from the server
    const fetchQuestionGroups = async () => {
      try {
        const response = await fetch("/api/question-group");
        const data = await response.json();
        setQuestionGroups(data);
      } catch (error) {
        console.error("Error fetching question groups:", error);
      }
    };

    fetchQuestionGroups();
  }, []);

  const handleSubmitQuiz = async () => {
    if (!quizTitle) {
      setToast({
        open: true,
        message: "Quiz Title is required!",
        type: "error",
      });
      return;
    }

    if (!quizDescription) {
      setToast({
        open: true,
        message: "Quiz Description is required!",
        type: "error",
      });
      return;
    }

    if (!selectedQuestionGroup) {
      setToast({
        open: true,
        message: "Please select a Question Group!",
        type: "error",
      });
      return;
    }

    try {
      const newQuiz = {
        title: quizTitle,
        description: quizDescription,
        question_group_id: selectedQuestionGroup,
      };

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuiz),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setToast({
          open: true,
          message: errorData.message || "Failed to create quiz!",
          type: "error",
        });
        return;
      }

      const data = await response.json();
      console.log("New Quiz created:", data);

      // Reset form
      setQuizTitle("");
      setQuizDescription("");
      setSelectedQuestionGroup("");
      setToast({
        open: true,
        message: "Quiz Created Successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error creating quiz:", error);
      setToast({
        open: true,
        message: "Something went wrong! Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <TextField
        fullWidth
        sx={{ height: "50px" }}
        margin="normal"
        label="Quiz Title"
        variant="outlined"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
      />
      <TextField
        fullWidth
        sx={{ height: "50px" }}
        margin="normal"
        label="Quiz Description"
        variant="outlined"
        value={quizDescription}
        onChange={(e) => setQuizDescription(e.target.value)}
      />
      <Select
        fullWidth
        value={selectedQuestionGroup}
        onChange={(e) => setSelectedQuestionGroup(e.target.value)}
        displayEmpty
        style={{ marginTop: "20px" }}
      >
        <MenuItem value="" disabled>
          Select Question Group
        </MenuItem>
        {questionGroups.map((group: any) => (
          <MenuItem key={group._id} value={group._id}>
            {group.title}
          </MenuItem>
        ))}
      </Select>
      <button
        onClick={handleSubmitQuiz}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit Quiz
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