-- Green Office Villas Chatbot Database Setup
-- Run this in your Supabase SQL editor

-- 1. Chat Sessions Table (Simplified)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_responses JSONB DEFAULT '{}', -- Combined flow state and user profile
  qualification_score INTEGER DEFAULT 0,
  session_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for chat_sessions
CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(session_status);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at);

-- 2. Chat Messages Table (Simplified)
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_type VARCHAR(50) NOT NULL, -- 'user', 'bot', 'knowledge_base'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_message_type CHECK (message_type IN ('user', 'bot', 'knowledge_base'))
);

-- Indexes for chat_messages
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_type ON chat_messages(message_type);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- 3. Knowledge Queries Table (Simplified)
CREATE TABLE knowledge_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  response_provided TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for knowledge_queries
CREATE INDEX idx_knowledge_queries_session_id ON knowledge_queries(session_id);
CREATE INDEX idx_knowledge_queries_created_at ON knowledge_queries(created_at);

-- Enable Row Level Security (RLS) for security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_queries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (for POC - in production, you'd want more restrictive policies)
CREATE POLICY "Allow public access to chat_sessions" ON chat_sessions FOR ALL USING (true);
CREATE POLICY "Allow public access to chat_messages" ON chat_messages FOR ALL USING (true);
CREATE POLICY "Allow public access to knowledge_queries" ON knowledge_queries FOR ALL USING (true);
