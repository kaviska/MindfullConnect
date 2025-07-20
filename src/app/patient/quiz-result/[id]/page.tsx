"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, ArrowLeft, Trophy } from "lucide-react";

interface QuizResult {
  _id: string;
  quizId: {
    title: string;
    description: string;
  };
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
  answers: Array<{
    questionId: string;
    selectedOption: number;
  }>;
}

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizResult();
  }, []);

  const fetchQuizResult = async () => {
    try {
      const response = await fetch(`/api/patient-quizzes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setResult(data.patientQuiz);
      }
    } catch (error) {
      console.error("Error fetching quiz result:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "Excellent work!";
    if (percentage >= 60) return "Good job!";
    return "Keep practicing!";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Result Not Found</h2>
        <button
          onClick={() => router.push("/patient/my-quizzes")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to My Quizzes
        </button>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="mb-4">
            <Trophy className={`h-16 w-16 mx-auto ${getScoreColor(result.score, result.totalQuestions)}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
          <h2 className="text-xl text-gray-600 mb-4">{result.quizId.title}</h2>
          <p className="text-lg text-gray-700">{getScoreMessage(result.score, result.totalQuestions)}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className={`text-3xl font-bold ${getScoreColor(result.score, result.totalQuestions)}`}>
              {result.score}/{result.totalQuestions}
            </div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className={`text-3xl font-bold ${getScoreColor(result.score, result.totalQuestions)}`}>
              {percentage}%
            </div>
            <div className="text-sm text-gray-600">Percentage</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {formatTime(result.timeSpent)}
            </div>
            <div className="text-sm text-gray-600">Time Spent</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                percentage >= 80 ? 'bg-green-500' : 
                percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/patient/my-quizzes")}
            className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Quizzes
          </button>
        </div>
      </div>
    </div>
  );
}
