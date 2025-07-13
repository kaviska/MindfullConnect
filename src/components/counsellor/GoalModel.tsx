"use client";
import React, { useState } from "react";
import { X, Target, FileText } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast";

interface GoalModelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GoalModel({ open, setOpen }: GoalModelProps) {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, setToast } = useToast();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (goalTitle && goalDescription) {
      setLoading(true);
      try {
        const response = await fetch("/api/goals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: goalTitle,
            description: goalDescription,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create goal");
        }
        setToast({
          open: true,
          message: "Goal Created Successfully",
          type: "success",
        });

        setGoalTitle("");
        setGoalDescription("");

        // Close the modal after a short delay (e.g., 1.5 seconds)
        setTimeout(() => {
          setOpen(false);
        }, 1500);

       
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
        message: "Please fill all fields!",
        type: "error",
      });
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
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Create New Goal</h3>
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
            {/* Goal Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Goal Title
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Enter goal title"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Goal Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Goal Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Describe the goal in detail..."
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating..." : "Create Goal"}
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