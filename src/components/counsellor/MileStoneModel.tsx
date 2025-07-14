"use client";
import React, { useState, useEffect } from "react";
import { X, Plus, Minus, Target, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext"; 
import Toast from "@/components/main/Toast";

interface MileStoneModelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MileStoneModel({ open, setOpen }: MileStoneModelProps) {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [breakdowns, setBreakdowns] = useState([{ description: "", time: "" }]);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
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

        setBreakdowns([{ description: "", time: "" }]);
        setSelectedGoal("");
        setOpen(false);

        setToast({
          open: true,
          message: "Milestone Created Successfully",
          type: "success",
        });
      } catch (error) {
        setToast({
          open: true,
          message: error instanceof Error ? error.message : "Something went wrong!",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setToast({
        open: true,
        message: "Please fill out all fields for the milestone.",
        type: "error",
      });
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Add Milestone</h3>
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
            {/* Goal Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Goal
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select a Goal</option>
                  {goals.map((goal: any) => (
                    <option key={goal._id} value={goal._id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Breakdowns */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Milestone Breakdowns
                </label>
                <button
                  onClick={handleAddBreakdown}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus size={16} />
                  Add Breakdown
                </button>
              </div>

              <div className="space-y-4">
                {breakdowns.map((breakdown, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Breakdown {index + 1}
                      </span>
                      {breakdowns.length > 1 && (
                        <button
                          onClick={() => handleRemoveBreakdown(index)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-600">
                          Description
                        </label>
                        <textarea
                          value={breakdown.description}
                          onChange={(e) =>
                            handleBreakdownChange(index, "description", e.target.value)
                          }
                          placeholder="Describe this milestone step..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-gray-600">
                          Time Frame
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <input
                            type="text"
                            value={breakdown.time}
                            onChange={(e) =>
                              handleBreakdownChange(index, "time", e.target.value)
                            }
                            placeholder="e.g., 2 weeks, 1 month"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Create Milestone"}
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