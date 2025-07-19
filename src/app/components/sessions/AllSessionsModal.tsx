"use client";
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, X, MessageSquare, Video, Phone } from 'lucide-react';
import { BookedSession } from '../types';
import Link from 'next/link';
import SessionDetailsModal from './SessionDetailsModal'; // ✅ Add this import

interface AllSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllSessionsModal({ isOpen, onClose }: AllSessionsModalProps) {
  const [sessions, setSessions] = useState<BookedSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<BookedSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');


  
  // ✅ Fetch sessions when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  // ✅ Filter sessions when filter or search changes
  useEffect(() => {
    filterSessions();
  }, [sessions, filter, searchTerm]);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sessions/my", {
        credentials: 'include',
      });

      const data = await res.json();
      if (res.ok) {
        // Add isUpcoming flag to each session
        const sessionsWithStatus = data.sessions.map((session: BookedSession) => ({
          ...session,
          isUpcoming: new Date(`${session.date}T${session.time}`) > new Date(),
        }));
        setSessions(sessionsWithStatus);
      } else {
        console.error("❌ Error loading sessions:", data.error);
      }
    } catch (err) {
      console.error("❌ Network error loading sessions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    // Filter by status/time
    if (filter === 'upcoming') {
      filtered = filtered.filter(session => 
        new Date(`${session.date}T${session.time}`) > new Date() && 
        session.status !== 'cancelled'
      );
    } else if (filter === 'past') {
      filtered = filtered.filter(session => 
        new Date(`${session.date}T${session.time}`) < new Date() || 
        session.status === 'completed'
      );
    } else if (filter !== 'all') {
      filtered = filtered.filter(session => session.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.counselor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (upcoming first, then past)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      const now = new Date();

      const aIsUpcoming = dateA > now;
      const bIsUpcoming = dateB > now;

      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;
      
      return aIsUpcoming ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

    setFilteredSessions(filtered);
  };

  const getStatusColor = (status: string, isUpcoming: boolean) => {
    if (!isUpcoming && status !== 'cancelled') return 'bg-gray-100 text-gray-700';
    
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6" />
              <h2 className="text-2xl font-bold">All My Sessions</h2>
            </div>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by counselor name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: 'all', label: 'All' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'past', label: 'Past' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    filter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-blue-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            // ✅ Beautiful Loader
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-500 mt-4 text-lg font-medium">Loading your sessions...</p>
              <p className="text-gray-400 text-sm">Please wait while we fetch your appointment history</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            // ✅ Empty State
            <div className="text-center py-16">
              <Calendar className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm || filter !== 'all' ? 'No sessions match your filters' : 'No sessions found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start your wellness journey by booking your first session'
                }
              </p>
              {(!searchTerm && filter === 'all') && (
                <Link href="/session">
                  <button 
                    onClick={onClose}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Book Your First Session
                  </button>
                </Link>
              )}
            </div>
          ) : (
            // ✅ Sessions List
            <div className="space-y-4">
              {filteredSessions.map((session) => {
                const isUpcoming = new Date(`${session.date}T${session.time}`) > new Date();
                const isToday = new Date(session.date).toDateString() === new Date().toDateString();
                
                return (
                  <div 
                    key={session.id} 
                    className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-all ${
                      isToday ? 'ring-2 ring-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Session Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {session.counselor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-lg">{session.counselor.name}</h3>
                              {isToday && (
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Today
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2">{session.counselor.specialty}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(session.date)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(session.time)} ({session.duration} min)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-3">
                        {/* Status */}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status, isUpcoming)}`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {/* Chat Button */}
                          <Link href={`/chat/${session.counselor.id}`}>
                            <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors" title="Chat">
                              <MessageSquare className="h-4 w-4" />
                            </button>
                          </Link>

                          {/* Join/View Button */}
                          {isUpcoming && session.status === 'confirmed' ? (
                            isToday ? (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1">
                                <Video className="h-4 w-4" />
                                Join Now
                              </button>
                            ) : (
                              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                View Details
                              </button>
                            )
                          ) : (
                            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium cursor-not-allowed">
                              {session.status === 'completed' ? 'Completed' : 'Unavailable'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredSessions.length} of {sessions.length} sessions
            </p>
            <Link href="/session">
              <button 
                onClick={onClose}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Book New Session
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}