"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import Toast from "@/components/main/Toast";

interface Question {
  _id: string;
  question: string;
  options: string[];
}

interface PatientQuiz {
  _id: string;
  quizId: {
    title: string;
    description: string;
  };
  status: string;
  attempts: number;
  maxAttempts: number;
}

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<PatientQuiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast, setToast } = useToast();

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted]);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`/api/patient-quizzes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.patientQuiz);
        setQuestions(data.questions);
      } else {
        setToast({
          open: true,
          message: "Failed to load quiz",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      setToast({
        open: true,
        message: "Error loading quiz",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    try {
      const response = await fetch(`/api/patient-quizzes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });

      if (response.ok) {
        setQuizStarted(true);
        setToast({
          open: true,
          message: "Quiz started! Good luck!",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error starting quiz:", error);
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption,
      }));

      const response = await fetch(`/api/patient-quizzes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          answers: formattedAnswers,
          timeSpent,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setToast({
          open: true,
          message: "Quiz submitted successfully!",
          type: "success",
        });
        
        // Redirect to results page instead of quiz list
        setTimeout(() => {
          router.push(`/patient/quiz-result/${params.id}`);
        }, 1500);
      } else {
        throw new Error("Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setToast({
        open: true,
        message: "Failed to submit quiz",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredQuestions = Object.keys(answers).length;
  const allQuestionsAnswered = answeredQuestions === questions.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quiz || !questions.length) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Not Found</h2>
        <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push("/patient/my-quizzes")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to My Quizzes
        </button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.quizId.title}</h1>
            <p className="text-gray-600 mb-6">{quiz.quizId.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{questions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{quiz.attempts + 1}</div>
              <div className="text-sm text-gray-600">Attempt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{quiz.maxAttempts}</div>
              <div className="text-sm text-gray-600">Max Attempts</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Read each question carefully before selecting your answer</li>
              <li>• You can navigate between questions using the navigation buttons</li>
              <li>• Make sure to answer all questions before submitting</li>
              <li>• Your time will be tracked once you start the quiz</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/patient/my-quizzes")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 inline mr-2" />
              Back to Quizzes
            </button>
            <button
              onClick={startQuiz}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.quizId.title}</h1>
            <p className="text-gray-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="font-mono text-lg">{formatTime(timeSpent)}</span>
            </div>
            <div className="text-sm text-gray-600">
              {answeredQuestions}/{questions.length} answered
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                answers[currentQuestion._id] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={index}
                  checked={answers[currentQuestion._id] === index}
                  onChange={() => handleAnswerSelect(currentQuestion._id, index)}
                  className="mr-3"
                />
                <span className="text-gray-900">{option}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : answers[questions[index]._id] !== undefined
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <button
            onClick={submitQuiz}
            disabled={!allQuestionsAnswered || submitting}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Submit Quiz
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
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
