'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ChatSession } from '@/types';

interface AdminDashboardProps {
  sessions: ChatSession[];
}

type DateRangeFilter = 'Today' | 'WTD' | 'MTD' | 'All';
type Q1Filter = 'Both' | '0' | '1';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  // Filter states
  const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeFilter>('All');
  const [minScoreFilter, setMinScoreFilter] = useState<string>('');
  const [q1Filter, setQ1Filter] = useState<Q1Filter>('Both');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter sessions based on current filter settings
  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];

    // Date range filter
    if (dateRangeFilter !== 'All') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let startDate: Date;
      if (dateRangeFilter === 'Today') {
        startDate = today;
      } else if (dateRangeFilter === 'WTD') {
        const dayOfWeek = now.getDay();
        startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek);
      } else if (dateRangeFilter === 'MTD') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        startDate = new Date(0); // All time
      }

      filtered = filtered.filter(session => session.createdAt >= startDate);
    }

    // Minimum score filter
    if (minScoreFilter.trim() !== '') {
      const minScore = parseInt(minScoreFilter);
      if (!isNaN(minScore)) {
        filtered = filtered.filter(session => session.qualificationScore >= minScore);
      }
    }

    // Q1 response filter
    if (q1Filter !== 'Both') {
      const q1Value = parseInt(q1Filter);
      filtered = filtered.filter(session => session.userResponses.Q1 === q1Value);
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(session => session.sessionStatus === statusFilter);
    }

    return filtered;
  }, [sessions, dateRangeFilter, minScoreFilter, q1Filter, statusFilter]);

  const exportLeads = () => {
    const leads = sessions.filter(s => s.userResponses.email);
    const csvContent = [
      ['Email', 'Score', 'Status', 'Created', 'Role', 'Attendees', 'Budget', 'Timeline'].join(','),
      ...leads.map(session => [
        session.userResponses.email || '',
        session.qualificationScore,
        session.sessionStatus,
        session.createdAt.toLocaleDateString(),
        session.userResponses.Q1 === 0 ? 'Retreat Planner' : session.userResponses.Q1 === 1 ? 'Internal Team Lead' : 'Other',
        session.userResponses.Q2_1 || session.userResponses.Q3 || 'N/A',
        session.userResponses.Q9 === 0 ? 'Under $500' : session.userResponses.Q9 === 1 ? '$500-$1000' : session.userResponses.Q9 === 2 ? '$1000-$2000' : session.userResponses.Q9 === 3 ? 'Over $2000' : 'N/A',
        session.userResponses.Q8 === 0 ? 'Within 3 months' : session.userResponses.Q8 === 1 ? '3-6 months' : session.userResponses.Q8 === 2 ? '6-12 months' : 'More than 12 months'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `green-office-villas-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const qualifiedSessions = filteredSessions.filter(s => s.qualificationScore >= 50);
  const completedSessions = filteredSessions.filter(s => s.sessionStatus === 'completed');
  const highQualitySessions = filteredSessions.filter(s => s.qualificationScore >= 70);
  const sessionsWithEmail = filteredSessions.filter(s => s.userResponses.email);
  const averageScore = filteredSessions.length > 0 ? Math.round(filteredSessions.reduce((sum, s) => sum + s.qualificationScore, 0) / filteredSessions.length) : 0;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header - matching ChatInterface styling */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/goLogo.png"
              alt="Green Office"
              width={0}
              height={0}
              sizes="100vw"
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">User session analytics</p>
            </div>
          </div>
          {sessionsWithEmail.length > 0 && (
            <Button onClick={exportLeads} variant="outline">
              Export Leads ({sessionsWithEmail.length})
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="text-xl font-bold text-primary-600">{filteredSessions.length}</div>
                <div className="text-xs text-gray-600">Total Sessions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-xl font-bold text-green-600">{completedSessions.length}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-xl font-bold text-blue-600">{qualifiedSessions.length}</div>
                <div className="text-xs text-gray-600">Qualified (50+)</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-xl font-bold text-orange-600">{highQualitySessions.length}</div>
                <div className="text-xs text-gray-600">High Quality (70+)</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-xl font-bold text-purple-600">{sessionsWithEmail.length}</div>
                <div className="text-xs text-gray-600">Email Captured</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-xl font-bold text-indigo-600">{averageScore}</div>
                <div className="text-xs text-gray-600">Avg Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Controls */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value as DateRangeFilter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="All">All</option>
                  <option value="Today">Today</option>
                  <option value="WTD">WTD</option>
                  <option value="MTD">MTD</option>
                </select>
              </div>

              {/* Minimum Score Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Score</label>
                <Input
                  type="number"
                  placeholder="Enter minimum score"
                  value={minScoreFilter}
                  onChange={(e) => setMinScoreFilter(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Q1 Response Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Q1 (Role)</label>
                <select
                  value={q1Filter}
                  onChange={(e) => setQ1Filter(e.target.value as Q1Filter)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Both">Both</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="All">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sessions List */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Sessions</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSession?.id === session.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">
                            Session {session.sessionId.slice(0, 8)}...
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.createdAt.toLocaleDateString()} {session.createdAt.toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            session.qualificationScore >= 70 ? 'text-green-600' :
                            session.qualificationScore >= 50 ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}>
                            Score: {session.qualificationScore}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full ${
                            session.sessionStatus === 'completed' ? 'bg-green-100 text-green-800' :
                            session.sessionStatus === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {session.sessionStatus}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredSessions.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No sessions match the current filters.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

        {/* Session Details */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Session Details</h2>
          </CardHeader>
          <CardContent>
            {selectedSession ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Session Information</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div><span className="font-medium">ID:</span> {selectedSession.sessionId}</div>
                    <div><span className="font-medium">Status:</span> {selectedSession.sessionStatus}</div>
                    <div><span className="font-medium">Score:</span> {selectedSession.qualificationScore}/100</div>
                    <div><span className="font-medium">Created:</span> {selectedSession.createdAt.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">User Responses</h3>
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(selectedSession.userResponses, null, 2)}
                    </pre>
                  </div>
                </div>

                {selectedSession.userResponses.email && (
                  <div>
                    <h3 className="font-medium text-gray-900">Contact Information</h3>
                    <div className="mt-2 text-sm">
                      <div><span className="font-medium">Email:</span> {selectedSession.userResponses.email}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a session to view details
              </div>
            )}
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
