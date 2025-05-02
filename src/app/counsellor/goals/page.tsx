"use client";
import PatientCard from "@components/counsellor/PatientCard";
import QuestionModel from "@components/counsellor/QuestionModel";
import GoalModel from "@components/counsellor/GoalModel";
import MileStoneModel from "@components/counsellor/MileStoneModel";
import { useState } from "react";

export default function Counsellor() {
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-center sm:text-left">
            Counsellor Dashboard
          </h1>
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            <button
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              onClick={() => setQuestionnaireOpen(true)}
            >
              Add Questionnaire
            </button>
            <button
              className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              onClick={() => {
                setGoalOpen(true);
              }}
            >
              Add Goal
            </button>
            <button
              className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              onClick={() => {
                setMilestoneOpen(true);
              }}
            >
              Add Milestone
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No patients found.
            </p>
          )}
        </div>
      </div>

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