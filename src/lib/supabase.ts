import { createClient } from '@supabase/supabase-js';
import { ChatSession, ChatMessage, KnowledgeQuery } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase credentials are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database utility functions
export const db = {
  // Chat Sessions
  async createSession(sessionId: string): Promise<ChatSession> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      // Use upsert to handle duplicates gracefully
      const { data, error } = await supabase
        .from('chat_sessions')
        .upsert({
          session_id: sessionId,
          user_responses: {},
          qualification_score: 0,
          session_status: 'active'
        }, {
          onConflict: 'session_id',
          ignoreDuplicates: false
        })
        .select()
        .limit(1);

      if (error) {
        console.warn('Error creating/upserting session:', error.message, error.code);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from session creation');
      }

      const sessionData = data[0];
      return {
        id: sessionData.id,
        sessionId: sessionData.session_id,
        userResponses: sessionData.user_responses,
        qualificationScore: sessionData.qualification_score,
        sessionStatus: sessionData.session_status,
        createdAt: new Date(sessionData.created_at)
      };
    } catch (error: any) {
      console.warn('Failed to create session:', error.message, error.code);

      // If upsert fails, try to get existing session
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        console.warn('Duplicate session detected, attempting to retrieve existing session');
        const existingSession = await this.getSession(sessionId);
        if (existingSession) {
          return existingSession;
        }
      }

      throw new Error(`Failed to create session: ${error.message}`);
    }
  },

  async getSession(sessionId: string): Promise<ChatSession | null> {
    if (!supabase) {
      return null;
    }

    try {
      // Use array query instead of single() to avoid PGRST116 error
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        // Log the specific error for debugging
        console.warn('Failed to get session:', error.message, error.code);
        return null;
      }

      // Check if we got any results
      if (!data || data.length === 0) {
        console.warn('No session found for sessionId:', sessionId);
        return null;
      }

      // Take the most recent session if multiple exist
      const sessionData = data[0];

      return {
        id: sessionData.id,
        sessionId: sessionData.session_id,
        userResponses: sessionData.user_responses,
        qualificationScore: sessionData.qualification_score,
        sessionStatus: sessionData.session_status,
        createdAt: new Date(sessionData.created_at)
      };
    } catch (error) {
      console.warn('Unexpected error getting session:', error);
      return null;
    }
  },

  async getOrCreateSession(sessionId: string): Promise<ChatSession | null> {
    if (!supabase) {
      return null;
    }

    try {
      // First try to get existing session
      let session = await this.getSession(sessionId);

      if (!session) {
        // If session doesn't exist, create it
        try {
          session = await this.createSession(sessionId);
        } catch (createError: any) {
          console.warn('Failed to create session, trying to get existing:', createError.message);
          // Try one more time to get the session in case it was created by another request
          session = await this.getSession(sessionId);
        }
      }

      return session;
    } catch (error) {
      console.warn('Failed to get or create session:', error);
      return null;
    }
  },

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const updateData: any = {};
    if (updates.userResponses) updateData.user_responses = updates.userResponses;
    if (updates.qualificationScore !== undefined) updateData.qualification_score = updates.qualificationScore;
    if (updates.sessionStatus) updateData.session_status = updates.sessionStatus;

    const { error } = await supabase
      .from('chat_sessions')
      .update(updateData)
      .eq('session_id', sessionId);

    if (error) throw error;
  },

  // Chat Messages
  async addMessage(sessionId: string, messageType: 'user' | 'bot' | 'knowledge_base', content: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      // Use robust session handling
      const session = await this.getOrCreateSession(sessionId);
      if (!session) {
        throw new Error('Unable to get or create session');
      }

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: session.id,
          message_type: messageType,
          content
        });

      if (error) throw error;
    } catch (error: any) {
      // Provide more specific error information
      console.error('Failed to add message to database:', {
        sessionId,
        messageType,
        error: error.message,
        code: error.code
      });
      throw new Error(`Database error: ${error.message}`);
    }
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    if (!supabase) {
      return [];
    }

    try {
      const session = await this.getOrCreateSession(sessionId);
      if (!session) {
        console.warn('No session available for messages');
        return [];
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Failed to get messages:', error.message);
        return [];
      }

      return data.map(msg => ({
        id: msg.id,
        sessionId: sessionId,
        messageType: msg.message_type,
        content: msg.content,
        createdAt: new Date(msg.created_at)
      }));
    } catch (error) {
      console.warn('Unexpected error getting messages:', error);
      return [];
    }
  },

  // Knowledge Queries
  async addKnowledgeQuery(sessionId: string, queryText: string, responseProvided: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      const session = await this.getOrCreateSession(sessionId);
      if (!session) {
        throw new Error('Unable to get or create session');
      }

      const { error } = await supabase
        .from('knowledge_queries')
        .insert({
          session_id: session.id,
          query_text: queryText,
          response_provided: responseProvided
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Failed to add knowledge query to database:', {
        sessionId,
        error: error.message,
        code: error.code
      });
      throw new Error(`Database error: ${error.message}`);
    }
  },

  // Health check and utility functions
  async checkConnection(): Promise<boolean> {
    if (!supabase) {
      return false;
    }

    try {
      // Test the same type of query that was failing
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, session_id')
        .limit(1);

      if (error) {
        console.warn('Supabase connection check failed:', error.message, error.code);
        return false;
      }

      console.log('Supabase connection check passed, found', data?.length || 0, 'sessions');
      return true;
    } catch (error) {
      console.warn('Supabase connection check failed with exception:', error);
      return false;
    }
  },

  // Utility function to clean up duplicate sessions (for admin use)
  async cleanupDuplicateSessions(): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    try {
      // Find duplicate sessions
      const { data: duplicates, error } = await supabase
        .from('chat_sessions')
        .select('session_id, id, created_at')
        .order('session_id, created_at');

      if (error) throw error;

      // Group by session_id and keep only the oldest one
      const toDelete: number[] = [];
      const seen = new Set<string>();

      duplicates?.forEach(session => {
        if (seen.has(session.session_id)) {
          toDelete.push(session.id);
        } else {
          seen.add(session.session_id);
        }
      });

      if (toDelete.length > 0) {
        console.log(`Cleaning up ${toDelete.length} duplicate sessions`);
        const { error: deleteError } = await supabase
          .from('chat_sessions')
          .delete()
          .in('id', toDelete);

        if (deleteError) throw deleteError;
      }
    } catch (error) {
      console.error('Failed to cleanup duplicate sessions:', error);
      throw error;
    }
  },

  // Debug function to investigate specific session issues
  async debugSession(sessionId: string): Promise<any> {
    if (!supabase) {
      return { error: 'Supabase not configured' };
    }

    try {
      console.log('Debugging session:', sessionId);

      // Try different query approaches
      const results: any = {};

      // 1. Basic select without single()
      try {
        const { data: basicData, error: basicError } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('session_id', sessionId);

        results.basicQuery = {
          success: !basicError,
          error: basicError?.message,
          count: basicData?.length || 0,
          data: basicData
        };
      } catch (e) {
        results.basicQuery = { success: false, error: String(e) };
      }

      // 2. Count query
      try {
        const { count, error: countError } = await supabase
          .from('chat_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', sessionId);

        results.countQuery = {
          success: !countError,
          error: countError?.message,
          count: count
        };
      } catch (e) {
        results.countQuery = { success: false, error: String(e) };
      }

      // 3. Check for any sessions with similar IDs
      try {
        const { data: similarData, error: similarError } = await supabase
          .from('chat_sessions')
          .select('session_id, id, created_at')
          .ilike('session_id', `%${sessionId.slice(-8)}%`)
          .limit(10);

        results.similarSessions = {
          success: !similarError,
          error: similarError?.message,
          data: similarData
        };
      } catch (e) {
        results.similarSessions = { success: false, error: String(e) };
      }

      return results;
    } catch (error) {
      return { error: String(error) };
    }
  },

  // Admin functions
  async getAllSessions(): Promise<ChatSession[]> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(session => ({
      id: session.id,
      sessionId: session.session_id,
      userResponses: session.user_responses,
      qualificationScore: session.qualification_score,
      sessionStatus: session.session_status,
      createdAt: new Date(session.created_at)
    }));
  }
};
