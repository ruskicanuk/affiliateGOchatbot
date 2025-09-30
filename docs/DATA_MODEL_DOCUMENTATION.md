# Data Model Documentation - Simplified POC Schema

## Overview

This document defines the simplified data model structure for the Green Office Villas chatbot POC, focusing on essential functionality with minimal complexity.

## Database Schema (PostgreSQL/Supabase) - Simplified for POC

### 1. Chat Sessions Table (Simplified)

```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_responses JSONB DEFAULT '{}', -- Combined flow state and user profile
  qualification_score INTEGER DEFAULT 0,
  session_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(session_status);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at);
```

### 2. Chat Messages Table (Simplified)

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_type VARCHAR(50) NOT NULL, -- 'user', 'bot', 'knowledge_base'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_message_type CHECK (message_type IN ('user', 'bot', 'knowledge_base'))
);

-- Indexes
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_type ON chat_messages(message_type);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
```

### 3. Knowledge Queries Table (Simplified)

```sql
CREATE TABLE knowledge_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  response_provided TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_knowledge_queries_session_id ON knowledge_queries(session_id);
CREATE INDEX idx_knowledge_queries_created_at ON knowledge_queries(created_at);
```

## Removed Tables for POC Simplification

The following tables from the original design are removed for the POC to reduce complexity:

- **leads** - Lead data stored in chat_sessions.user_responses
- **flow_questions** - Questions hardcoded in application logic
- **knowledge_topics** - Knowledge base stored as static JSON file
- **analytics_events** - Simple console logging instead



## TypeScript Interfaces (Simplified for POC)

### 1. Core Chat Types

```typescript
interface ChatSession {
  id: string;
  sessionId: string;
  userResponses: Record<string, any>; // Combined user profile and flow state
  qualificationScore: number;
  sessionStatus: 'active' | 'completed' | 'abandoned';
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  messageType: 'user' | 'bot' | 'knowledge_base';
  content: string;
  createdAt: Date;
}

interface KnowledgeQuery {
  id: string;
  sessionId: string;
  queryText: string;
  responseProvided: string;
  createdAt: Date;
}
```

### 2. Simplified Application Types

```typescript
// Static knowledge base structure (TypeScript file)
interface KnowledgeBase {
  [topic: string]: {
    keywords: string[];
    response: string;
  };
}

// Question flow structure (hardcoded in app)
interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'text' | 'number';
  options?: string[];
  next: (answer: any) => string;
}

// Basic types
type UserRole = 'planner' | 'internal_lead' | 'other';
type SessionStatus = 'active' | 'completed' | 'abandoned';
type MessageType = 'user' | 'bot' | 'knowledge_base';
```

## Data Relationships (Simplified)

### Primary Relationships
- `chat_sessions` → `chat_messages` (1:many)
- `chat_sessions` → `knowledge_queries` (1:many)

### Data Flow
1. **Session Creation**: New chat session created with unique sessionId
2. **Message Exchange**: Messages stored with session reference
3. **User Responses**: All user data stored in chat_sessions.user_responses JSONB field
4. **Knowledge Queries**: Simple tracking for knowledge base interactions

## Implementation Notes for POC

### Simplifications Made
- **Combined Data Storage**: User profile and flow state merged into single JSONB field
- **Hardcoded Questions**: Flow questions defined in application code, not database
- **Static Knowledge Base**: Knowledge content stored in TypeScript file, not database
- **No Complex Analytics**: Simple console logging instead of event tracking
- **No Separate Leads Table**: Lead data stored within chat sessions

### Benefits of Simplified Approach
- **Faster Development**: Fewer tables and relationships to manage
- **Easier Testing**: Less complex data setup required
- **Rapid Iteration**: Changes to flow and knowledge base don't require migrations
- **Reduced Complexity**: Single source of truth for user data

This simplified data model provides the essential functionality needed for the POC while maintaining the ability to scale to the full schema when needed.
