"use client";
import React, { useState, useEffect } from "react";
import { X, FileText, User, Calendar } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast"; // Add this import


interface AssignQuizModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

export default function AssignQuizModal({ open, setOpen, onSuccess }: AssignQuizModalProps) {
  const [patients, setPatients] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [loading, setLoading] = useState(false);
  const { toast, setToast } = useToast(); // Make sure to destructure toast as well

  useEffect(() => {
    if (open) {
      fetchPatients();
      fetchQuizzes();
    }
  }, [open]);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients-for-counsellor");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quiz");
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedQuiz || !selectedPatient) {
      setToast({
        open: true,
        message: "Please select both quiz and patient!",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/patient-quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: selectedQuiz,
          patientId: selectedPatient,
          dueDate,
          maxAttempts
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign quiz");
      }

      setToast({
        open: true,
        message: "Quiz assigned successfully!",
        type: "success",
      });

      // setOpen(false);
      if (onSuccess) onSuccess();
      
      // Reset form
      setSelectedQuiz("");
      setSelectedPatient("");
      setDueDate("");
      setMaxAttempts(3);

    } catch (error) {
      setToast({
        open: true,
        message: error instanceof Error ? error.message : "Something went wrong!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setOpen(false)} />
        
        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <FileText className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Assign Quiz to Patient</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quiz Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Quiz</label>
              <select
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Choose a quiz...</option>
                {quizzes.map((quiz: any) => (
                  <option key={quiz._id} value={quiz._id}>{quiz.title}</option>
                ))}
              </select>
            </div>

            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Patient</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((patient: any) => (
                    <option key={patient._id} value={patient._id}>{patient.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Due Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Max Attempts */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Maximum Attempts</label>
              <input
                type="number"
                min="1"
                max="10"
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Assign Quiz"}
            </button>
          </div>
        </div>
      </div>
       <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}
