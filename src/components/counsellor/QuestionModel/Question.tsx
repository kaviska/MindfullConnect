"use client";
import TextField from "@mui/material/TextField";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast";

export default function Question() {
  const [question, setQuestion] = useState<String>("");
  const [answers, setAnswers] = useState<string[]>([""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(
    null
  );
  const [questionGroups, setQuestionGroups] = useState<{ title: string; _id: string }[]>([]);
  const [selectedQuestionGroup, setSelectedQuestionGroup] = useState("");
  const { toast, setToast } = useToast();

  useEffect(() => {
    // Fetch question groups from the server
    const fetchQuestionGroups = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/question-group`
        );
        const data = await response.json();
        setQuestionGroups(data);
      } catch (error) {
        console.error("Error fetching question groups:", error);
      }
    };

    fetchQuestionGroups();
  }, []);

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleRemoveAnswer = (index: number) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    setAnswers(updatedAnswers);
    if (correctAnswerIndex === index) {
      setCorrectAnswerIndex(null);
    } else if (correctAnswerIndex !== null && correctAnswerIndex > index) {
      setCorrectAnswerIndex(correctAnswerIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (
      question &&
      answers.length > 0 &&
      correctAnswerIndex !== null &&
      selectedQuestionGroup
    ) {
      try {
        setToast({
          open: true,
          message: "Creating question...",
          type: "info",
        });
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question,
              options: answers,
              correct_answer_index: correctAnswerIndex,
              question_group_id: selectedQuestionGroup,
            }),
          }
        );
        const data = await response.json();
        console.log("Question created:", data);
        // Reset form
        setQuestion("");
        setAnswers([""]);
        setCorrectAnswerIndex(null);
        setSelectedQuestionGroup("");
        setToast({
          open: true,
          message: "Question Added Successfully",
          type: "success",
        });

      } catch (error) {
        console.error("Error creating question group:", error);
        setToast({
          open:true,
          message: error instanceof Error ? error.message : "Something went wrong!",
          type:"error"
        })
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
    <div>
      <TextField
        fullWidth
        sx={{
          "& .MuiInputBase-input": {
            height: "20px",
          },
        }}
        margin="normal"
        label="Question"
        variant="outlined"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {answers.map((answer, index) => (
        <div
          key={index}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <TextField
            fullWidth
            sx={{
              "& .MuiInputBase-input": {
                height: "20px",
              },
            }}
            margin="normal"
            label={`Answer ${index + 1}`}
            variant="outlined"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
          <button className='mt-4 bg-red-500 text-white px-4 py-2 rounded-[4px]' onClick={() => handleRemoveAnswer(index)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddAnswer} className='mt-4 bg-blue-400 text-white px-4 py-2 rounded-[4px]'>Add Answer</button>
      <RadioGroup
        value={correctAnswerIndex}
        onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
      >
        {answers.map((_, index) => (
          <FormControlLabel
            key={index}
            value={index}
            control={<Radio />}
            label={`Correct Answer ${index + 1}`}
          />
        ))}
      </RadioGroup>
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
        {questionGroups.map((group: { title: string; _id: string }) => (
          <MenuItem key={group._id} value={group._id}>
            {group.title}
          </MenuItem>
        ))}
      </Select>
      <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-[4px]">
        Submit Question
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