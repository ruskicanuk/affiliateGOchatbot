'use client';

import React, { useState, useEffect } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { db } from '@/lib/supabase';
import { ChatSession } from '@/types';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Simple password protection as specified
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
      loadSessions();
    } else {
      setError('Invalid password');
    }
  };

  const loadSessions = async () => {
    setLoading(true);
    try {
      const allSessions = await db.getAllSessions();
      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              <Button 
                onClick={handleLogin}
                className="w-full"
                disabled={!password.trim()}
              >
                Login
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              For demo purposes, try password: admin123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard sessions={sessions} />;
}
