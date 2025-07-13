"use client";
import { useState, useEffect } from "react";
import { User, Target, CheckCircle, Calendar, TrendingUp, Clock } from "lucide-react";

interface PatientProgress {
  _id: string;
  goalId: {
    title: string;
    description: string;
  };
  patientId: {
    _id: string;
    fullName: string;
    email: string;
  };
  status: string;
  progress: number;
  startDate: string;
  targetDate?: string;
  milestones: Array<{
    _id: string;
    title: string;
    status: string;
    completedDate?: string;
  }>;
  updatedAt: string;
}

export default function PatientProgressPage() {
  const [patientGoals, setPatientGoals] = useState<PatientProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  useEffect(() => {
    fetchPatientProgress();
  }, []);

  const fetchPatientProgress = async () => {
    try {
      const response = await fetch("/api/patient-goals");
      if (response.ok) {
        const data = await response.json();
        setPatientGoals(data);
      }
    } catch (error) {
      console.error("Error fetching patient progress:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique patients
  const patients = patientGoals.reduce((unique: any[], pg) => {
    if (!unique.find(p => p._id === pg.patientId._id)) {
      unique.push(pg.patientId);
    }
    return unique;
  }, []);

  // Filter goals by selected patient
  const filteredGoals = selectedPatient 
    ? patientGoals.filter(pg => pg.patientId._id === selectedPatient)
    : patientGoals;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Progress</h1>
            <p className="text-gray-600 mt-1">Monitor patient goal achievements and milestones</p>
          </div>
          
          {/* Patient Filter */}
          <div className="flex items-center gap-4">
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Patients</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Data</h3>
          <p className="text-gray-600">No goals have been assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredGoals.map((goalProgress) => (
            <div key={goalProgress._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Goal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {goalProgress.patientId.fullName}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({goalProgress.patientId.email})
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {goalProgress.goalId.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{goalProgress.goalId.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{goalProgress.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${goalProgress.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Started: {new Date(goalProgress.startDate).toLocaleDateString()}
                      </div>
                      {goalProgress.targetDate && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Due: {new Date(goalProgress.targetDate).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Last Updated: {new Date(goalProgress.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(goalProgress.status)}`}>
                      {goalProgress.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestones Progress */}
              {goalProgress.milestones.length > 0 && (
                <div className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Milestone Progress</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goalProgress.milestones.map((milestone) => (
                      <div
                        key={milestone._id}
                        className={`p-4 rounded-lg border ${
                          milestone.status === 'completed'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            milestone.status === 'completed'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1">
                            <h5 className={`font-medium ${
                              milestone.status === 'completed' ? 'text-green-800' : 'text-gray-900'
                            }`}>
                              {milestone.title}
                            </h5>
                            
                            {milestone.completedDate && (
                              <p className="text-xs text-green-600 mt-1">
                                Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                              </p>
                            )}
                            
                            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                              milestone.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {milestone.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </div>
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
    </div>
  );
}
