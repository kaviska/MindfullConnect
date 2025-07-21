"use client";
import React, { useState, useEffect } from "react";
import { X, Target, User, Calendar, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast"; // Add this import


interface AssignGoalModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  goalId?: string;
  onSuccess?: () => void;
}

export default function AssignGoalModal({ open, setOpen, goalId, onSuccess }: AssignGoalModalProps) {
  const [patients, setPatients] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(goalId || "");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [milestones, setMilestones] = useState([{ title: "", description: "", targetDate: "" }]);
  const [loading, setLoading] = useState(false);
  const { toast, setToast } = useToast(); // Make sure to destructure toast as well

  useEffect(() => {
    if (open) {
      fetchPatients();
      if (!goalId) fetchGoals();
    }
  }, [open, goalId]);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients-for-counsellor");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/goals");
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", targetDate: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = milestones.map((milestone, i) => 
      i === index ? { ...milestone, [field]: value } : milestone
    );
    setMilestones(updated);
  };

  const handleSubmit = async () => {
    if (!selectedGoal || !selectedPatient) {
      setToast({
        open: true,
        message: "Please select both goal and patient!",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/patient-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId: selectedGoal,
          patientId: selectedPatient,
          targetDate,
          milestones: milestones.filter(m => m.title.trim())
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign goal");
      }

      setToast({
        open: true,
        message: "Goal assigned successfully!",
        type: "success",
      });

      // setOpen(false);
      if (onSuccess) onSuccess();
      
      // Reset form
      setSelectedGoal(goalId || "");
      setSelectedPatient("");
      setTargetDate("");
      setMilestones([{ title: "", description: "", targetDate: "" }]);

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
        
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Assign Goal to Patient</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
            {/* Goal Selection */}
            {!goalId && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Goal</label>
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a goal...</option>
                  {goals.map((goal: any) => (
                    <option key={goal._id} value={goal._id}>{goal.title}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Patient</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map((patient: any) => (
                    <option key={patient._id} value={patient._id}>{patient.fullName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Target Completion Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Milestones</label>
                <button
                  onClick={addMilestone}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                >
                  <Plus size={16} />
                  Add Milestone
                </button>
              </div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Milestone {index + 1}</span>
                    {milestones.length > 1 && (
                      <button
                        onClick={() => removeMilestone(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Milestone title"
                    value={milestone.title}
                    onChange={(e) => updateMilestone(index, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <textarea
                    placeholder="Milestone description"
                    value={milestone.description}
                    onChange={(e) => updateMilestone(index, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  
                  <input
                    type="date"
                    value={milestone.targetDate}
                    onChange={(e) => updateMilestone(index, "targetDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Assigning..." : "Assign Goal"}
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
