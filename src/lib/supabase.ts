import { createClient } from '@supabase/supabase-js';
import { ChatSession, ChatMessage, KnowledgeQuery } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database utility functions
export const db = {
  // Chat Sessions
  async createSession(sessionId: string): Promise<ChatSession> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        session_id: sessionId,
        user_responses: {},
        qualification_score: 0,
        session_status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      sessionId: data.session_id,
      userResponses: data.user_responses,
      qualificationScore: data.qualification_score,
      sessionStatus: data.session_status,
      createdAt: new Date(data.created_at)
    };
  },

  async getSession(sessionId: string): Promise<ChatSession | null> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (error) return null;
    return {
      id: data.id,
      sessionId: data.session_id,
      userResponses: data.user_responses,
      qualificationScore: data.qualification_score,
      sessionStatus: data.session_status,
      createdAt: new Date(data.created_at)
    };
  },

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<void> {
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
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: session.id,
        message_type: messageType,
        content
      });

    if (error) throw error;
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const session = await this.getSession(sessionId);
    if (!session) return [];

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data.map(msg => ({
      id: msg.id,
      sessionId: sessionId,
      messageType: msg.message_type,
      content: msg.content,
      createdAt: new Date(msg.created_at)
    }));
  },

  // Knowledge Queries
  async addKnowledgeQuery(sessionId: string, queryText: string, responseProvided: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    const { error } = await supabase
      .from('knowledge_queries')
      .insert({
        session_id: session.id,
        query_text: queryText,
        response_provided: responseProvided
      });

    if (error) throw error;
  },

  // Admin functions
  async getAllSessions(): Promise<ChatSession[]> {
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
