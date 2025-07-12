"use client";
import React, { useState, useEffect } from "react";
import { X, Target, User, FileText } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast";

interface GoalModelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function GoalModel({ open, setOpen }: GoalModelProps) {
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [counsellors, setCounsellors] = useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, setToast } = useToast();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/counsellors`
      );
      const data = await response.json();
      setCounsellors(data);
    } catch (error) {
      console.error("Error fetching counsellors:", error);
    }
  };

  const handleSubmit = async () => {
    if (goalTitle && goalDescription && selectedCounsellor) {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/goals`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: goalTitle,
              description: goalDescription,
              counsellor_id: selectedCounsellor,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create goal");
        }

        setGoalTitle("");
        setGoalDescription("");
        setSelectedCounsellor("");
        setOpen(false);

        setToast({
          open: true,
          message: "Goal Created Successfully",
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
          <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Target className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Create New Goal</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Goal Title */}
            <div className="space-y-3">
              <label className="block text-lg font-medium text-gray-700">
                Goal Title
              </label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Enter goal title"
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Goal Description */}
            <div className="space-y-3">
              <label className="block text-lg font-medium text-gray-700">
                Goal Description
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-gray-400" size={20} />
                <textarea
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="Describe the goal in detail..."
                  rows={4}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Counsellor Selection */}
            <div className="space-y-3">
              <label className="block text-lg font-medium text-gray-700">
                Assign Counsellor
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedCounsellor}
                  onChange={(e) => setSelectedCounsellor(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Counsellor</option>
                  {counsellors.map((counsellor: any) => (
                    <option key={counsellor._id} value={counsellor._id}>
                      {counsellor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-8 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-lg text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 text-lg bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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