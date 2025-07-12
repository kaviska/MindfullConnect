"use client";
import React, { useState } from "react";
import { X, HelpCircle, Users, Brain } from "lucide-react";
import QuestionGroup from "./QuestionModel/QuestionGroup";
import Question from "./QuestionModel/Question";
import Quiz from "./QuestionModel/Quiz";

interface QuestionModelProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QuestionModel({ open, setOpen }: QuestionModelProps) {
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [
    { label: "Question Group", icon: Users, component: QuestionGroup },
    { label: "Question", icon: HelpCircle, component: Question },
    { label: "Quiz", icon: Brain, component: Quiz },
  ];

  if (!open) return null;

  const ActiveComponent = tabs[tabIndex].component;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={() => setOpen(false)}
        />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <HelpCircle className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Add Question
              </h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-8">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setTabIndex(index)}
                    className={`
                      flex items-center gap-3 py-5 px-2 border-b-2 font-medium text-lg transition-colors
                      ${
                        tabIndex === index
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <ActiveComponent />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-8 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-lg text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
