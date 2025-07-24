// ✅ Create src/components/ReportModal.tsx
"use client";
// ✅ src/components/ReportModal.tsx - Enhanced version
import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporteeId: string;
  reporteeName: string;
  chatReferenceId?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reporteeId,
  reporteeName,
  chatReferenceId
}) => {
  const { token } = useAuth();
  const [reportType, setReportType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const reportTypes = [
    'Harassment',
    'Inappropriate Language',
    'Unprofessional Behavior',
    'Spam or Scams',
    'Other'
  ];

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
        reporteeName,
        reportType,
        descriptionLength: description.length,
        chatReferenceId,
        hasToken: !!token
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

      console.log('[ReportModal] Response status:', response.status);
      
      const data = await response.json();
      console.log('[ReportModal] Response data:', data);

      if (response.ok) {
        console.log('[ReportModal] Report submitted successfully:', data.reportId);
        setIsSubmitted(true);
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        console.error('[ReportModal] Report submission failed:', {
          status: response.status,
          error: data.error,
          details: data.details
        });
        
        // Show user-friendly error messages
        switch (response.status) {
          case 400:
            setError(data.error || 'Please check your input and try again');
            break;
          case 401:
            setError('You need to be logged in to submit a report');
            break;
          case 404:
            setError('User not found. Please try again.');
            break;
          default:
            setError(data.error || 'Failed to submit report. Please try again.');
        }
      }
    } catch (error) {
      console.error('[ReportModal] Network error:', error);
      setError('Network error. Please check your connection and try again.');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-900">Report User</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            /* Success State */
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Report Submitted Successfully
              </h3>
              <p className="text-gray-600 mb-4">
                Thank you for your report. We will review it and take appropriate action.
              </p>
              <p className="text-sm text-gray-500">
                This window will close automatically...
              </p>
            </div>
          ) : (
            /* Report Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-gray-700 mb-4">
                  You are reporting: <span className="font-semibold">{reporteeName}</span>
                </p>
              </div>

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type *
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a reason...</option>
                  {reportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details about the issue (minimum 10 characters)..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  minLength={10}
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/1000 characters
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !reportType || !description.trim()}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;