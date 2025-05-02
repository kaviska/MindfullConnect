"use client";
import PatientCard from "@components/counsellor/PatientCard";
import QuestionModel from "@components/counsellor/QuestionModel";
import GoalModel from "@components/counsellor/GoalModel";
import MileStoneModel from "@components/counsellor/MileStoneModel";
import { useState, useEffect } from "react";

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

  const [patients, setPatients] = useState<Patient[]>([]);

  // Dummy counsellor ID
  const counsellorId = "6811c012122428543028f1e4";

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`/api/counsellors?id=${counsellorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [counsellorId]);

  return (
    <div className="container mx-auto ">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Counsellor Dashboard</h1>
          <div className="flex gap-3">
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

        <div className="grid grid-cols-4 gap-4">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <PatientCard key={patient._id} patient={patient} />
            ))
          ) : (
            <p className="text-gray-500 col-span-4 text-center">
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