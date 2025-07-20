"use client";
import PatientCard from "@components/counsellor/PatientCard";
import QuestionModel from "@components/counsellor/QuestionModel";
import GoalModel from "@components/counsellor/GoalModel";
import MileStoneModel from "@components/counsellor/MileStoneModel";
import AssignGoalModal from "@components/counsellor/AssignGoalModal";
import { useState, useEffect } from "react";
import { Plus, Target, CheckCircle, Users, TrendingUp, UserPlus, ClipboardList, Eye } from "lucide-react";
import AssignQuizModal from "@components/counsellor/AssignQuizModal";
import { useRouter } from "next/navigation";

export default function GoalsPage() {
  const router = useRouter();
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [assignGoalOpen, setAssignGoalOpen] = useState(false);
  const [patientGoals, setPatientGoals] = useState([]);
  const [assignQuizModal,setAssignQuizModal] = useState(false);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientGoalsRes, goalsRes] = await Promise.all([
        fetch("/api/patient-goals"),
        fetch("/api/goals")
      ]);
      
      const patientGoalsData = await patientGoalsRes.json();
      const goalsData = await goalsRes.json();
      
      setPatientGoals(patientGoalsData);
      setGoals(goalsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const totalPatients = new Set(
    patientGoals
      .filter((pg: any) => pg.patientId && pg.patientId._id)
      .map((pg: any) => pg.patientId._id)
  ).size;
  const activeGoals = patientGoals.filter((pg: any) => pg.status === 'in_progress' || pg.status === 'assigned').length;
  const completedMilestones = patientGoals.reduce((total: number, pg: any) => 
    total + pg.milestones.filter((m: any) => m.status === 'completed').length, 0
  );
  const totalMilestones = patientGoals.reduce((total: number, pg: any) => total + pg.milestones.length, 0);
  const successRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const stats = [
    {
      title: "Total Patients",
      value: totalPatients,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Goals",
      value: activeGoals,
      icon: Target,
      color: "bg-green-500",
    },
    {
      title: "Completed Milestones",
      value: completedMilestones,
      icon: CheckCircle,
      color: "bg-purple-500",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  // Get unique patients for display
  const patients = patientGoals
    .filter((pg: any) => pg.patientId && pg.patientId._id) // Filter out null patientId entries
    .reduce((unique: any[], pg: any) => {
      if (!unique.find(p => p._id === pg.patientId._id)) {
        const patientGoalsCount = patientGoals.filter((g: any) => 
          g.patientId && g.patientId._id === pg.patientId._id
        );
        const completedGoals = patientGoalsCount.filter((g: any) => g.status === 'completed').length;
        const avgProgress = patientGoalsCount.length > 0 
          ? patientGoalsCount.reduce((sum: number, g: any) => sum + g.progress, 0) / patientGoalsCount.length 
          : 0;
        
        unique.push({
          _id: pg.patientId._id,
          name: pg.patientId.fullName,
          email: pg.patientId.email,
          goalsCount: patientGoalsCount.length,
          completedGoals,
          avgProgress: Math.round(avgProgress),
          status: avgProgress >= 80 ? "healthy" : avgProgress >= 50 ? "warning" : "danger"
        });
      }
      return unique;
    }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
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
              onClick={() => setAssignGoalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm"
            >
              <UserPlus size={18} />
              Assign Goal
            </button>
           
            <button
              onClick={() => setAssignQuizModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 shadow-sm"
            >
              <ClipboardList size={18} />
              Assign Quiz
            </button>
            <button
              onClick={() => router.push("/counsellor/patient-quiz-results")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              <Eye size={18} />
              View Quiz Results
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

      {/* Active Goals Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Active Patient Goals</h2>
          <span className="text-sm text-gray-500">{patientGoals.length} assignments</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : patientGoals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Patient</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Goal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Progress</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Target Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patientGoals
                  .filter((pg: any) => pg.patientId && pg.patientId._id) // Add null check here too
                  .map((pg: any) => (
                  <tr key={pg._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{pg.patientId.fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{pg.goalId?.title || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${pg.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{pg.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pg.status === 'completed' ? 'bg-green-100 text-green-800' :
                        pg.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        pg.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {pg.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {pg.targetDate ? new Date(pg.targetDate).toLocaleDateString() : 'No deadline'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No goals assigned yet</p>
            <p className="text-gray-400 text-sm">Start by assigning goals to patients</p>
          </div>
        )}
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
              Patients will appear here once goals are assigned
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {questionnaireOpen && (
        <QuestionModel open={questionnaireOpen} setOpen={setQuestionnaireOpen} />
      )}
      {goalOpen && <GoalModel open={goalOpen} setOpen={setGoalOpen} />}
      {assignGoalOpen && (
        <AssignGoalModal 
          open={assignGoalOpen} 
          setOpen={setAssignGoalOpen}
          onSuccess={fetchData}
        />
      )}
      {milestoneOpen && (
        <MileStoneModel open={milestoneOpen} setOpen={setMilestoneOpen} />
      )}
      {
        assignQuizModal && (
          <AssignQuizModal 
            open={assignQuizModal} 
            setOpen={setAssignQuizModal}
            onSuccess={fetchData}
          />
        )}
     
    </div>
  );
}