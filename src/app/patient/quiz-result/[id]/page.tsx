"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Clock, Award, RotateCcw, Home, Trophy, Target } from "lucide-react";

interface QuizResult {
  _id: string;
  quizId: {
    title: string;
    description: string;
  };
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  completedDate: string;
  attempts: number;
  maxAttempts: number;
  answers: Array<{
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }>;
  patientId: {
    fullName: string;
  };
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  correct_answer_index: number;
}

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  useEffect(() => {
    fetchQuizResult();
  }, []);

  const fetchQuizResult = async () => {
    try {
      const response = await fetch(`/api/patient-quizzes/${params.id}/result`);
      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
        setQuestions(data.questions);
      } else {
        console.error("Failed to fetch quiz result");
      }
    } catch (error) {
      console.error("Error fetching quiz result:", error);
    } finally {
      setLoading(false);
    }
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { message: "Excellent work!", icon: Trophy, color: "text-yellow-600" };
    if (score >= 80) return { message: "Great job!", icon: Award, color: "text-green-600" };
    if (score >= 70) return { message: "Good effort!", icon: Target, color: "text-blue-600" };
    if (score >= 60) return { message: "Keep practicing!", icon: Target, color: "text-yellow-600" };
    return { message: "Need improvement", icon: Target, color: "text-red-600" };
  };

  const canRetake = result && result.attempts < result.maxAttempts;

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
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Result Not Found</h2>
        <p className="text-gray-600 mb-4">The quiz result you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push("/patient/my-quizzes")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to My Quizzes
        </button>
      </div>
    );
  }

  const performance = getPerformanceMessage(result.score);
  const PerformanceIcon = performance.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${getScoreBgColor(result.score)}`}>
          <PerformanceIcon className={`h-10 w-10 ${performance.color}`} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
        <p className={`text-xl font-semibold ${performance.color}`}>{performance.message}</p>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{result.quizId.title}</h2>
          <p className="text-gray-600">{result.quizId.description}</p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-8">
          <div className={`inline-block text-6xl font-bold mb-2 ${getScoreColor(result.score)}`}>
            {result.score}%
          </div>
          <p className="text-gray-600 text-lg">
            {result.correctAnswers} out of {result.totalQuestions} questions correct
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{result.correctAnswers}</div>
            <div className="text-sm text-blue-700">Correct</div>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{result.totalQuestions - result.correctAnswers}</div>
            <div className="text-sm text-red-700">Incorrect</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{formatTime(result.timeSpent)}</div>
            <div className="text-sm text-purple-700">Time Spent</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{result.attempts}</div>
            <div className="text-sm text-green-700">Attempt #{result.attempts}</div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Accuracy</span>
            <span className="font-semibold">{Math.round((result.correctAnswers / result.totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(result.correctAnswers / result.totalQuestions) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Completed: {new Date(result.completedDate).toLocaleDateString()}</span>
            {canRetake && (
              <span>Attempts remaining: {result.maxAttempts - result.attempts}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showDetailedResults ? 'Hide' : 'Show'} Detailed Results
          </button>
          
          {canRetake && (
            <button
              onClick={() => router.push(`/patient/take-quiz/${result._id}`)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </button>
          )}
          
          <button
            onClick={() => router.push("/patient/my-quizzes")}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Quizzes
          </button>
        </div>
      </div>

      {/* Detailed Results */}
      {showDetailedResults && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Question by Question Review</h3>
          
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = result.answers.find(a => a.questionId === question._id);
              const isCorrect = userAnswer?.isCorrect || false;
              
              return (
                <div key={question._id} className={`p-6 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Question {index + 1}: {question.question}
                      </h4>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = userAnswer?.selectedOption === optionIndex;
                          const isCorrectAnswer = question.correct_answer_index === optionIndex;
                          
                          let optionClass = "p-3 rounded border ";
                          if (isCorrectAnswer) {
                            optionClass += "bg-green-100 border-green-300 text-green-800";
                          } else if (isUserAnswer && !isCorrect) {
                            optionClass += "bg-red-100 border-red-300 text-red-800";
                          } else {
                            optionClass += "bg-gray-50 border-gray-200 text-gray-700";
                          }
                          
                          return (
                            <div key={optionIndex} className={optionClass}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                                <span>{option}</span>
                                {isCorrectAnswer && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                                {isUserAnswer && !isCorrect && <XCircle className="h-4 w-4 text-red-600 ml-auto" />}
                                {isUserAnswer && isCorrect && <div className="w-4 h-4 bg-green-600 rounded-full ml-auto" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-3 text-sm">
                        {isCorrect ? (
                          <span className="text-green-700 font-medium">✓ Correct answer</span>
                        ) : (
                          <span className="text-red-700 font-medium">✗ Incorrect - Correct answer: {String.fromCharCode(65 + question.correct_answer_index)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
