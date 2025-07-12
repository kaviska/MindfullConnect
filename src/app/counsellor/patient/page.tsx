"use client";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useToast } from "@/contexts/ToastContext"; // Import toast context
import Toast from "@/components/main/Toast"; // Import Toast component
import ShowAssignedGoals from "@/components/counsellor/ShowAssignedGoals"; // Import ShowAssignedGoals component
import ShowAssignedQuizzes from "@/components/counsellor/ShowAssignedQuiz"; // Import ShowAssignedQuizzes component

export default function Patient() {
  const [goals, setGoals] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [patientId, setPatientId] = useState("680bb88687f58f114cf1fd4b"); // Replace with actual patient ID
  const [counsellorId, setCounsellorId] = useState("6811c012122428543028f1e4"); // Replace with actual counsellor ID
  const { toast, setToast } = useToast(); // Use toast context

  useEffect(() => {
    // Fetch goals
    const fetchGoals = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/goals`
        );
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
        setToast({
          open: true,
          message: "Failed to fetch goals!",
          type: "error",
        });
      }
    };

    // Fetch quizzes
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/quiz`
        );
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setToast({
          open: true,
          message: "Failed to fetch quizzes!",
          type: "error",
        });
      }
    };

    fetchGoals();
    fetchQuizzes();
  }, []);

  const handleAssignQuiz = async () => {
    if (!selectedQuiz || !patientId || !counsellorId) {
      setToast({
        open: true,
        message: "Please select a quiz and ensure patient and counsellor IDs are set.",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/assign-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quiz_id: selectedQuiz,
            patient_id: patientId,
            counsellor_id: counsellorId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setToast({
          open: true,
          message: "Quiz assigned successfully!",
          type: "success",
        });
      } else {
        setToast({
          open: true,
          message: data.message || "Failed to assign quiz.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error assigning quiz:", error);
      setToast({
        open: true,
        message: "An error occurred while assigning the quiz.",
        type: "error",
      });
    }
  };

  const handleAssignGoal = async () => {
    if (!selectedGoal || !patientId || !counsellorId) {
      setToast({
        open: true,
        message: "Please select a goal and ensure patient and counsellor IDs are set.",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/assign-goal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goal_id: selectedGoal,
            patient_id: patientId,
            counsellor_id: counsellorId,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setToast({
          open: true,
          message: "Goal assigned successfully!",
          type: "success",
        });
      } else {
        setToast({
          open: true,
          message: data.message || "Failed to assign goal.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error assigning goal:", error);
      setToast({
        open: true,
        message: "An error occurred while assigning the goal.",
        type: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Patient Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goal Selection */}
        <div className="flex flex-col bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Assign Goal</h2>
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
          <button
            onClick={handleAssignGoal}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600"
          >
            Assign Goal
          </button>
        </div>

        {/* Quiz Selection */}
        <div className="flex flex-col bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Assign Quiz</h2>
          <TextField
            fullWidth
            select
            label="Select Quiz"
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="" disabled>
              Select a Quiz
            </MenuItem>
            {quizzes.map((quiz: any) => (
              <MenuItem key={quiz._id} value={quiz._id}>
                {quiz.title}
              </MenuItem>
            ))}
          </TextField>
          <button
            onClick={handleAssignQuiz}
            className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-600"
          >
            Assign Quiz
          </button>
        </div>
      </div>

      <ShowAssignedGoals counsellor_id={counsellorId} patient_id={patientId} />
      <ShowAssignedQuizzes counsellor_id={counsellorId} patient_id={patientId} />

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}