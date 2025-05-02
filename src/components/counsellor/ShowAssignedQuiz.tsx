"use client";

import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Alert } from "@mui/material";

interface ShowAssignedQuizProps {
  counsellor_id: string;
  patient_id: string;
}

export default function ShowAssignedQuiz({ counsellor_id, patient_id }: ShowAssignedQuizProps) {
  const [assignedQuizzes, setAssignedQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);

  useEffect(() => {
    const fetchAssignedQuizzes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/assign-quiz?counsellor_id=${counsellor_id}&patient_id=${patient_id}`
        );
        const data = await response.json();

        if (response.ok) {
          setAssignedQuizzes(data.assignedQuizzes || []);
        } else {
          setError(data.message || "Failed to fetch assigned quizzes.");
        }
      } catch (err) {
        console.error("Error fetching assigned quizzes:", err);
        setError("An error occurred while fetching assigned quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedQuizzes();
  }, [counsellor_id, patient_id]);

  const handleViewQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
  };

  const handleCloseModal = () => {
    setSelectedQuiz(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (assignedQuizzes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Alert severity="info">No assigned quizzes found for this patient.</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Assigned Quizzes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedQuizzes.map((quiz) => (
          <Card key={quiz._id} className="shadow-lg">
            <CardContent>
              <Typography variant="h6" className="font-bold mb-2">
                {quiz.quiz_id.title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-4">
                {quiz.quiz_id.description}
              </Typography>
              <Typography variant="body2" className="text-gray-500 mb-2">
                <strong>Status:</strong> {quiz.status}
              </Typography>
              <Typography variant="body2" className="text-gray-500 mb-4">
                <strong>Assigned At:</strong> {new Date(quiz.assignedAt).toLocaleDateString()}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                className="w-full"
                onClick={() => handleViewQuiz(quiz)}
              >
                View Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for Viewing Quiz Details */}
      {selectedQuiz && (
        <Dialog open={!!selectedQuiz} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>{selectedQuiz.quiz_id.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" className="mb-4">
              {selectedQuiz.quiz_id.description}
            </Typography>
            <div className="space-y-4">
              {selectedQuiz.questions.map((question: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm">
                  <Typography variant="h6" className="font-bold mb-2">
                    Q{index + 1}: {question.question}
                  </Typography>
                  <div className="space-y-2">
                    {question.choices.map((choice: string, choiceIndex: number) => (
                      <Typography
                        key={choiceIndex}
                        variant="body2"
                        className={`p-2 rounded-lg ${
                          choice === question.correctAnswer
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100"
                        }`}
                      >
                        {choice}
                      </Typography>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}