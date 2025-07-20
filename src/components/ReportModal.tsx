// ✅ Create src/components/ReportModal.tsx
"use client";
import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporteeId: string;
  reporteeName: string;
  chatReferenceId?: string;
}

const reportTypes = [
  'Harassment',
  'Inappropriate Language', 
  'Unprofessional Behavior',
  'Spam or Scams',
  'Other'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reporteeId,
  reporteeName,
  chatReferenceId
}) => {
  const { token } = useAuth();
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // ✅ Update src/components/ReportModal.tsx - Add better debugging
// ✅ Update ReportModal.tsx back to production code
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!reportType || !description.trim()) {
    setError('Please select a report type and provide a description');
    return;
  }

  if (description.length < 10) {
    setError('Description must be at least 10 characters long');
    return;
  }

  setIsSubmitting(true);
  setError('');

  try {
    console.log('[ReportModal] Submitting report:', {
      reporteeId,
      reportType,
      descriptionLength: description.length,
      chatReferenceId
    });

    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        reporteeId,
        reportType,
        description: description.trim(),
        chatReferenceId
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('[ReportModal] Report submitted successfully:', data.reportId);
      setIsSubmitted(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    } else {
      console.error('[ReportModal] Report submission failed:', data.error);
      setError(data.error || 'Failed to submit report');
    }
  } catch (error) {
    console.error('[ReportModal] Error submitting report:', error);
    setError('Network error. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleClose = () => {
    setReportType('');
    setDescription('');
    setError('');
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Report User</h2>
              <p className="text-sm text-gray-600">Report {reporteeName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            // Success State
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Submitted</h3>
              <p className="text-gray-600">
                Thank you for reporting this issue. Our team will review it and take appropriate action.
              </p>
            </div>
          ) : (
            // Report Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of issue are you reporting?
                </label>
                <div className="space-y-2">
                  {reportTypes.map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="radio"
                        name="reportType"
                        value={type}
                        checked={reportType === type}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Please describe the issue in detail
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide specific details about what happened..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    Minimum 10 characters required
                  </span>
                  <span className="text-xs text-gray-500">
                    {description.length}/1000
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reportType || description.length < 10}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;