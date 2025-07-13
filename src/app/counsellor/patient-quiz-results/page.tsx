"use client";
import { useState, useEffect } from "react";
import { User, FileText, Award, Clock, ChevronDown, ChevronUp, CheckCircle, XCircle, Eye } from "lucide-react";

interface PatientQuizResult {
  _id: string;
  quizId: {
    title: string;
    description: string;
  };
  patientId: {
    _id: string;
    fullName: string;
    email: string;
  };
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  status: string;
  completedDate: string;
  answers: Array<{
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }>;
}

interface QuestionDetail {
  _id: string;
  question: string;
  options: string[];
  correct_answer_index: number;
}

export default function PatientQuizResultsPage() {
  const [quizResults, setQuizResults] = useState<PatientQuizResult[]>([]);
  const [questions, setQuestions] = useState<{ [key: string]: QuestionDetail[] }>({});
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [expandedResults, setExpandedResults] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizResults();
  }, []);

  const fetchQuizResults = async () => {
    try {
      const response = await fetch("/api/patient-quizzes");
      if (response.ok) {
        const data = await response.json();
        const completedQuizzes = data.filter((quiz: PatientQuizResult) => quiz.status === 'completed');
        setQuizResults(completedQuizzes);
        
        // Fetch questions for each unique quiz
        const uniqueQuizIds = [...new Set(completedQuizzes.map((quiz: PatientQuizResult) => quiz.quizId._id))];
        fetchQuestionsForQuizzes(uniqueQuizIds);
      }
    } catch (error) {
      console.error("Error fetching quiz results:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionsForQuizzes = async (quizIds: string[]) => {
    const questionsMap: { [key: string]: QuestionDetail[] } = {};
    
    for (const quizId of quizIds) {
      try {
        const response = await fetch(`/api/quiz/${quizId}/questions`);
        if (response.ok) {
          const data = await response.json();
          questionsMap[quizId] = data;
        }
      } catch (error) {
        console.error(`Error fetching questions for quiz ${quizId}:`, error);
      }
    }
    
    setQuestions(questionsMap);
  };

  const toggleExpanded = (resultId: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [resultId]: !prev[resultId]
    }));
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
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Get unique patients for filter
  const patients = [...new Set(quizResults.map(result => result.patientId._id))]
    .map(patientId => {
      const result = quizResults.find(r => r.patientId._id === patientId);
      return result?.patientId;
    })
    .filter(Boolean);

  // Filter results by selected patient
  const filteredResults = selectedPatient 
    ? quizResults.filter(result => result.patientId._id === selectedPatient)
    : quizResults;

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
            <h1 className="text-3xl font-bold text-gray-900">Patient Quiz Results</h1>
            <p className="text-gray-600 mt-1">Monitor patient quiz performance and detailed answers</p>
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
                <option key={patient?._id} value={patient?._id}>
                  {patient?.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz Results</h3>
          <p className="text-gray-600">No completed quizzes found for the selected criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result) => {
            const isExpanded = expandedResults[result._id];
            const quizQuestions = questions[result.quizId._id] || [];
            
            return (
              <div key={result._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Result Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-semibold text-gray-900">{result.patientId.fullName}</span>
                        <span className="text-sm text-gray-500">({result.patientId.email})</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {result.quizId.title}
                      </h3>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span>Score: <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(result.score)}`}>
                            {result.score}%
                          </span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>{result.correctAnswers}/{result.totalQuestions} correct</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(result.timeSpent)}</span>
                        </div>
                        <div>
                          Completed: {new Date(result.completedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleExpanded(result._id)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      {isExpanded ? 'Hide Details' : 'View Details'}
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Detailed Answers */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Answers</h4>
                    
                    <div className="space-y-6">
                      {quizQuestions.map((question, index) => {
                        const userAnswer = result.answers.find(a => a.questionId === question._id);
                        const isCorrect = userAnswer?.isCorrect || false;
                        
                        return (
                          <div 
                            key={question._id} 
                            className={`p-6 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                              }`}>
                                {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                              </div>
                              
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 mb-3">
                                  Question {index + 1}: {question.question}
                                </h5>
                                
                                <div className="space-y-2">
                                  {question.options.map((option, optionIndex) => {
                                    const isUserAnswer = userAnswer?.selectedOption === optionIndex;
                                    const isCorrectAnswer = question.correct_answer_index === optionIndex;
                                    
                                    let optionClass = "p-3 rounded border ";
                                    let iconElement = null;
                                    
                                    if (isCorrectAnswer) {
                                      optionClass += "bg-green-100 border-green-300 text-green-800";
                                      iconElement = <CheckCircle className="h-4 w-4 text-green-600" />;
                                    } else if (isUserAnswer && !isCorrect) {
                                      optionClass += "bg-red-100 border-red-300 text-red-800";
                                      iconElement = <XCircle className="h-4 w-4 text-red-600" />;
                                    } else if (isUserAnswer && isCorrect) {
                                      optionClass += "bg-green-100 border-green-300 text-green-800";
                                      iconElement = <div className="w-4 h-4 bg-green-600 rounded-full" />;
                                    } else {
                                      optionClass += "bg-gray-50 border-gray-200 text-gray-700";
                                    }
                                    
                                    return (
                                      <div key={optionIndex} className={optionClass}>
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                              {String.fromCharCode(65 + optionIndex)}.
                                            </span>
                                            <span>{option}</span>
                                            {isUserAnswer && (
                                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full ml-2">
                                                Patient's Answer
                                              </span>
                                            )}
                                          </div>
                                          {iconElement}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                
                                <div className="mt-3 text-sm">
                                  {isCorrect ? (
                                    <div className="flex items-center gap-2 text-green-700 font-medium">
                                      <CheckCircle className="h-4 w-4" />
                                      Correct answer selected
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 text-red-700 font-medium">
                                      <XCircle className="h-4 w-4" />
                                      Incorrect - Correct answer: {String.fromCharCode(65 + question.correct_answer_index)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Summary */}
                    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">Performance Summary</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Questions:</span>
                          <span className="ml-2 font-medium">{result.totalQuestions}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Correct:</span>
                          <span className="ml-2 font-medium text-green-600">{result.correctAnswers}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Incorrect:</span>
                          <span className="ml-2 font-medium text-red-600">{result.totalQuestions - result.correctAnswers}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="ml-2 font-medium">{Math.round((result.correctAnswers / result.totalQuestions) * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
