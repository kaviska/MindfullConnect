"use client";
import PatientCard from "@components/counsellor/PatientCard";
import QuestionModel from "@components/counsellor/QuestionModel";
import GoalModel from "@components/counsellor/GoalModel";
import MileStoneModel from "@components/counsellor/MileStoneModel";
import { useState } from "react";
import { Plus, Target, CheckCircle, Users, TrendingUp } from "lucide-react";

export default function GoalsPage() {
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [milestoneOpen, setMilestoneOpen] = useState(false);

  interface Patient {
    _id: string;
    name: string;
    age: number;
    status: string;
  }

  // Dummy patient data
  const patients: Patient[] = [
    { _id: "1", name: "John Doe", age: 30, status: "healthy" },
    { _id: "2", name: "Jane Smith", age: 25, status: "danger" },
    { _id: "3", name: "Alice Johnson", age: 40, status: "healthy" },
    { _id: "4", name: "Bob Brown", age: 35, status: "danger" },
  ];

  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Goals",
      value: "12",
      icon: Target,
      color: "bg-green-500",
    },
    {
      title: "Completed Milestones",
      value: "8",
      icon: CheckCircle,
      color: "bg-purple-500",
    },
    {
      title: "Success Rate",
      value: "85%",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Goals & Milestones
            </h1>
            <p className="text-gray-600 mt-1">
              Manage patient goals and track their progress
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setQuestionnaireOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              <Plus size={18} />
              Add Questionnaire
            </button>
            <button
              onClick={() => setGoalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              <Target size={18} />
              Add Goal
            </button>
            <button
              onClick={() => setMilestoneOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm"
            >
              <CheckCircle size={18} />
              Add Milestone
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patients Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Patient Overview
          </h2>
          <span className="text-sm text-gray-500">
            {patients.length} patients
          </span>
        </div>

        {patients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {patients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No patients found</p>
            <p className="text-gray-400 text-sm">
              Patients will appear here once added
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {questionnaireOpen && (
        <QuestionModel open={questionnaireOpen} setOpen={setQuestionnaireOpen} />
      )}
      {goalOpen && <GoalModel open={goalOpen} setOpen={setGoalOpen} />}
      {milestoneOpen && (
        <MileStoneModel open={milestoneOpen} setOpen={setMilestoneOpen} />
      )}
    </div>
  );
}