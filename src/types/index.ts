// All types in one file as per simplified approach

export interface ChatSession {
  id: string;
  sessionId: string;
  userResponses: Record<string, any>; // Combined user profile and flow state
  qualificationScore: number;
  sessionStatus: 'active' | 'completed' | 'abandoned';
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  messageType: 'user' | 'bot' | 'knowledge_base';
  content: string;
  createdAt: Date;
}

export interface KnowledgeQuery {
  id: string;
  sessionId: string;
  queryText: string;
  responseProvided: string;
  createdAt: Date;
}

// Static knowledge base structure (TypeScript file)
export interface KnowledgeBase {
  [topic: string]: {
    keywords: string[];
    response: string;
  };
}

// Question flow structure (hardcoded in app)
export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'text' | 'number';
  options?: string[];
  next: (answer: any) => string;
}

// Basic types
export type UserRole = 'planner' | 'internal_lead' | 'other';
export type SessionStatus = 'active' | 'completed' | 'abandoned';
export type MessageType = 'user' | 'bot' | 'knowledge_base';
