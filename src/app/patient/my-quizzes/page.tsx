"use client";
import { useState, useEffect } from "react";
import { FileText, Calendar, Clock, Award, CheckCircle, Play, RotateCcw } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast";
import { useRouter } from "next/navigation";

interface PatientQuiz {
  _id: string;
  quizId: {
    _id: string;
    title: string;
    description: string;
  };
  status: string;
  assignedDate: string;
  dueDate?: string;
  completedDate?: string;
  score: number;
  attempts: number;
  maxAttempts: number;
  timeSpent: number;
  correctAnswers: number;
  totalQuestions: number;
}

export default function MyQuizzesPage() {
  const [quizzes, setQuizzes] = useState<PatientQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast, setToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchMyQuizzes();
  }, []);

  const fetchMyQuizzes = async () => {
    try {
      const response = await fetch("/api/patient-quizzes");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
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
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleStartQuiz = (quizId: string) => {
    // Navigate to quiz taking interface
    window.location.href = `/patient/take-quiz/${quizId}`;
  };

  const canRetakeQuiz = (quiz: PatientQuiz) => {
    return quiz.attempts < quiz.maxAttempts && quiz.status !== 'completed';
  };

  const isQuizExpired = (quiz: PatientQuiz) => {
    return quiz.dueDate && new Date(quiz.dueDate) < new Date();
  };

  // Calculate stats
  const completedQuizzes = quizzes.filter(q => q.status === 'completed').length;
  const averageScore = quizzes.length > 0 
    ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length) 
    : 0;
  const totalTimeSpent = quizzes.reduce((sum, q) => sum + q.timeSpent, 0);

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
        <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
        <p className="text-gray-600 mt-2">Complete assigned quizzes and track your performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedQuizzes}</p>
            </div>
          </div>
        </div>

      
       
      </div>

      {/* Quizzes List */}
      {quizzes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Quizzes Assigned Yet</h3>
          <p className="text-gray-600">Your counselor will assign quizzes for you to complete.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Quiz Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {quiz.quizId.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(quiz.status)}`}>
                    {quiz.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {quiz.quizId.description}
                </p>

                {/* Quiz Stats */}
                <div className="space-y-3 mb-6">
                  {quiz.status === 'completed' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Score:</span>
                      <span className={`font-semibold ${getScoreColor(quiz.score)}`}>
                        {quiz.score}({quiz.correctAnswers}/{quiz.totalQuestions})
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Attempts:</span>
                    <span className="text-sm font-medium">
                      {quiz.attempts}/{quiz.maxAttempts}
                    </span>
                  </div>

                  {quiz.timeSpent > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Time Spent:</span>
                      <span className="text-sm font-medium">{formatTime(quiz.timeSpent)}</span>
                    </div>
                  )}

                  {/* <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Assigned:</span>
                    <span className="text-sm font-medium">
                      {new Date(quiz.assignedDate).toLocaleDateString()}
                    </span>
                  </div> */}

                  {quiz.dueDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Due:</span>
                      <span className={`text-sm font-medium ${
                        isQuizExpired(quiz) ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {new Date(quiz.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-200">
                  {quiz.status === 'completed' ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => router.push(`/patient/quiz-result/${quiz._id}`)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Award className="h-4 w-4" />
                        View Results
                      </button>
                      {canRetakeQuiz(quiz) && (
                        <button
                          onClick={() => handleStartQuiz(quiz._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Retake Quiz
                        </button>
                      )}
                    </div>
                  ) : quiz.status === 'assigned' || canRetakeQuiz(quiz) ? (
                    <button
                      onClick={() => handleStartQuiz(quiz._id)}
                      disabled={isQuizExpired(quiz)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {quiz.status === 'assigned' ? (
                        <>
                          <Play className="h-4 w-4" />
                          Start Quiz
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4" />
                          Retake Quiz
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="w-full text-center py-2 bg-gray-100 text-gray-600 rounded-lg">
                      No more attempts available
                    </div>
                  )}
                </div>
              </div>
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
