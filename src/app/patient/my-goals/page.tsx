"use client";
import { useState, useEffect } from "react";
import { Target, Calendar, CheckCircle, Clock, User, Award, TrendingUp } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast";

interface Milestone {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  targetDate?: string;
  completedDate?: string;
}

interface PatientGoal {
  _id: string;
  goalId: {
    _id: string;
    title: string;
    description: string;
  };
  status: string;
  progress: number;
  startDate: string;
  targetDate?: string;
  completedDate?: string;
  milestones: Milestone[];
  notes: Array<{
    content: string;
    addedAt: string;
  }>;
}

export default function MyGoalsPage() {
  const [goals, setGoals] = useState<PatientGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast, setToast } = useToast();

  useEffect(() => {
    fetchMyGoals();
  }, []);

  const fetchMyGoals = async () => {
    try {
      const response = await fetch("/api/patient-goals");
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const markMilestoneComplete = async (goalId: string, milestoneId: string) => {
    setUpdating(milestoneId);
    try {
      const response = await fetch("/api/patient-goals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientGoalId: goalId,
          milestoneId: milestoneId,
        }),
      });

      if (response.ok) {
        setToast({
          open: true,
          message: "Milestone marked as completed!",
          type: "success",
        });
        fetchMyGoals(); // Refresh data
      } else {
        throw new Error("Failed to update milestone");
      }
    } catch (error) {
      setToast({
        open: true,
        message: "Failed to update milestone",
        type: "error",
      });
    } finally {
      setUpdating(null);
    }
  };

  const updateGoalProgress = async (goalId: string, newProgress: number) => {
    try {
      const response = await fetch("/api/patient-goals", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientGoalId: goalId,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'in_progress',
        }),
      });

      if (response.ok) {
        setToast({
          open: true,
          message: "Progress updated successfully!",
          type: "success",
        });
        fetchMyGoals(); // Refresh data
      }
    } catch (error) {
      setToast({
        open: true,
        message: "Failed to update progress",
        type: "error",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const totalMilestones = goals.reduce((total, goal) => total + goal.milestones.length, 0);
  const completedMilestones = goals.reduce((total, goal) => 
    total + goal.milestones.filter(m => m.status === 'completed').length, 0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Goals</h1>
        <p className="text-gray-600 mt-2">Track your progress and complete milestones</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Goals</p>
              <p className="text-2xl font-bold text-gray-900">{completedGoals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Milestones</p>
              <p className="text-2xl font-bold text-gray-900">{completedMilestones}/{totalMilestones}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Goals Assigned Yet</h3>
          <p className="text-gray-600">Your counselor will assign goals for you to work on.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Goal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {goal.goalId.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{goal.goalId.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Progress Slider */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Progress
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateGoalProgress(goal._id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(goal.status)}`}>
                      {goal.status.replace('_', ' ')}
                    </span>
                    {goal.targetDate && (
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Milestones */}
              {goal.milestones.length > 0 && (
                <div className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Milestones</h4>
                  <div className="space-y-3">
                    {goal.milestones.map((milestone) => (
                      <div
                        key={milestone._id}
                        className={`flex items-start p-4 rounded-lg border ${
                          milestone.status === 'completed'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <button
                          onClick={() => markMilestoneComplete(goal._id, milestone._id)}
                          disabled={milestone.status === 'completed' || updating === milestone._id}
                          className={`mr-3 mt-0.5 p-1 rounded-full ${
                            milestone.status === 'completed'
                              ? 'bg-green-500 text-white'
                              : 'bg-white border-2 border-gray-300 hover:border-green-500'
                          } ${updating === milestone._id ? 'animate-pulse' : ''}`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>

                        <div className="flex-1">
                          <h5 className={`font-medium ${
                            milestone.status === 'completed' ? 'text-green-800 line-through' : 'text-gray-900'
                          }`}>
                            {milestone.title}
                          </h5>
                          {milestone.description && (
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                          )}
                          {milestone.targetDate && (
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              Target: {new Date(milestone.targetDate).toLocaleDateString()}
                            </div>
                          )}
                          {milestone.completedDate && (
                            <div className="flex items-center mt-2 text-xs text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
}
