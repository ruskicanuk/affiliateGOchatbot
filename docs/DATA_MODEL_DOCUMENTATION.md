# Data Model Documentation - Complete Application Schema

## Overview

This document defines the complete data model structure for the Green Office Villas chatbot application, including database schemas, TypeScript interfaces, and data relationships.

## Database Schema (PostgreSQL/Supabase)

### 1. Chat Sessions Table

```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) UNIQUE NOT NULL,
  user_profile JSONB,
  flow_state JSONB,
  current_question VARCHAR(50),
  flow_path TEXT[],
  interruption_point VARCHAR(50),
  qualification_score INTEGER DEFAULT 0,
  session_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT
);

-- Indexes
CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(session_status);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at);
```

### 2. Chat Messages Table

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_type VARCHAR(50) NOT NULL, -- 'user', 'bot', 'system', 'knowledge_base'
  content TEXT NOT NULL,
  question_id VARCHAR(50),
  response_data JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_message_type CHECK (message_type IN ('user', 'bot', 'system', 'knowledge_base'))
);

-- Indexes
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_type ON chat_messages(message_type);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
```

### 3. Knowledge Base Topics Table

```sql
CREATE TABLE knowledge_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_category CHECK (category IN (
    'about', 'pricing', 'amenities', 'sustainability', 
    'booking', 'location', 'activities', 'partnerships', 'faq'
  ))
);

-- Indexes
CREATE INDEX idx_knowledge_topics_category ON knowledge_topics(category);
CREATE INDEX idx_knowledge_topics_keywords ON knowledge_topics USING GIN(keywords);
CREATE INDEX idx_knowledge_topics_active ON knowledge_topics(is_active);
```

### 4. Knowledge Base Queries Table

```sql
CREATE TABLE knowledge_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  matched_topic_id UUID REFERENCES knowledge_topics(id),
  confidence_score DECIMAL(3,2),
  response_provided TEXT,
  was_helpful BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_knowledge_queries_session_id ON knowledge_queries(session_id);
CREATE INDEX idx_knowledge_queries_topic_id ON knowledge_queries(matched_topic_id);
CREATE INDEX idx_knowledge_queries_confidence ON knowledge_queries(confidence_score);
```

### 5. Leads Table

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  contact_preference VARCHAR(50) DEFAULT 'email',
  user_profile JSONB NOT NULL,
  qualification_score INTEGER NOT NULL,
  lead_status VARCHAR(50) DEFAULT 'new',
  lead_source VARCHAR(100) DEFAULT 'chatbot',
  follow_up_date DATE,
  notes TEXT,
  assigned_to VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_lead_status CHECK (lead_status IN (
    'new', 'contacted', 'qualified', 'proposal_sent', 
    'negotiating', 'closed_won', 'closed_lost', 'nurturing'
  )),
  CONSTRAINT valid_contact_preference CHECK (contact_preference IN ('email', 'phone', 'both'))
);

-- Indexes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(lead_status);
CREATE INDEX idx_leads_score ON leads(qualification_score);
CREATE INDEX idx_leads_created_at ON leads(created_at);
```

### 6. Flow Questions Table

```sql
CREATE TABLE flow_questions (
  id VARCHAR(50) PRIMARY KEY, -- Q1, Q2, Q2.1, etc.
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'integer', 'text', 'boolean'
  options JSONB, -- For multiple choice questions
  validation_rules JSONB,
  next_question_logic JSONB,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_question_type CHECK (question_type IN (
    'multiple_choice', 'integer', 'text', 'boolean'
  ))
);
```

### 7. Analytics Events Table

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
```

## TypeScript Interfaces

### 1. Core Chat Types

```typescript
interface ChatSession {
  id: string;
  sessionId: string;
  userProfile: UserProfile;
  flowState: FlowState;
  currentQuestion: string;
  flowPath: string[];
  interruptionPoint?: string;
  qualificationScore: number;
  sessionStatus: 'active' | 'completed' | 'abandoned';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  referrerUrl?: string;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  messageType: 'user' | 'bot' | 'system' | 'knowledge_base';
  content: string;
  questionId?: string;
  responseData?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
}

interface FlowState {
  currentQuestion: string;
  userResponses: Record<string, any>;
  flowPath: string[];
  interruptionPoint?: string;
  completedQuestions: string[];
  skippedQuestions: string[];
  branchingHistory: BranchingDecision[];
}

interface BranchingDecision {
  questionId: string;
  selectedOption: string | number;
  nextQuestion: string;
  timestamp: Date;
}
```

### 2. User Profile Types

```typescript
interface UserProfile {
  role: UserRole;
  attendeeCount?: number;
  budget?: BudgetRange;
  timeline?: string;
  requirements: string[];
  companySize?: CompanySize;
  industry?: string;
  decisionRole?: DecisionRole;
  contactPreference?: ContactPreference;
  retreatGoals?: RetreatGoal[];
  specialRequirements?: SpecialRequirement[];
  location?: string;
  duration?: number;
  teamDemographics?: TeamDemographics;
  sustainabilityPriority?: SustainabilityLevel;
}

type UserRole = 'planner' | 'internal_lead' | 'other';
type BudgetRange = '<500' | '500-1000' | '1000-2000' | '>2000' | 'unsure';
type CompanySize = '<50' | '50-500' | '>500';
type DecisionRole = 'sole_decider' | 'influencer' | 'researcher';
type ContactPreference = 'email' | 'phone' | 'both';
type RetreatGoal = 'team_building' | 'work_focused' | 'both' | 'relaxation';
type SpecialRequirement = 'dietary' | 'accessibility' | 'sustainability' | 'tech' | 'none';
type TeamDemographics = 'fully_remote' | 'hybrid' | 'in_office';
type SustainabilityLevel = 'high' | 'medium' | 'low';
```

### 3. Knowledge Base Types

```typescript
interface KnowledgeTopic {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  category: KnowledgeCategory;
  subcategory?: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type KnowledgeCategory = 
  | 'about' 
  | 'pricing' 
  | 'amenities' 
  | 'sustainability' 
  | 'booking' 
  | 'location' 
  | 'activities' 
  | 'partnerships' 
  | 'faq';

interface KnowledgeQuery {
  id: string;
  sessionId: string;
  queryText: string;
  matchedTopicId?: string;
  confidenceScore?: number;
  responseProvided: string;
  wasHelpful?: boolean;
  createdAt: Date;
}

interface SearchResult {
  topic: KnowledgeTopic;
  relevanceScore: number;
  matchedKeywords: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
}
```

### 4. Flow Management Types

```typescript
interface FlowQuestion {
  id: string;
  questionText: string;
  questionType: QuestionType;
  options?: QuestionOption[];
  validationRules?: ValidationRule[];
  nextQuestionLogic: NextQuestionLogic;
  category?: string;
  isActive: boolean;
}

type QuestionType = 'multiple_choice' | 'integer' | 'text' | 'boolean';

interface QuestionOption {
  value: string | number;
  label: string;
  nextQuestion?: string;
  metadata?: Record<string, any>;
}

interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

interface NextQuestionLogic {
  default?: string;
  conditions: ConditionalLogic[];
}

interface ConditionalLogic {
  condition: string; // JavaScript expression
  nextQuestion: string;
  metadata?: Record<string, any>;
}
```

### 5. Lead Management Types

```typescript
interface Lead {
  id: string;
  sessionId?: string;
  email?: string;
  phone?: string;
  contactPreference: ContactPreference;
  userProfile: UserProfile;
  qualificationScore: number;
  leadStatus: LeadStatus;
  leadSource: string;
  followUpDate?: Date;
  notes?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'proposal_sent' 
  | 'negotiating' 
  | 'closed_won' 
  | 'closed_lost' 
  | 'nurturing';

interface LeadQualificationCriteria {
  attendeeCountWeight: number;
  budgetWeight: number;
  timelineWeight: number;
  decisionRoleWeight: number;
  companySizeWeight: number;
  requirementsMatchWeight: number;
}
```

### 6. Analytics Types

```typescript
interface AnalyticsEvent {
  id: string;
  sessionId?: string;
  eventType: string;
  eventData?: Record<string, any>;
  pageUrl?: string;
  createdAt: Date;
}

interface ConversationMetrics {
  totalSessions: number;
  completedSessions: number;
  averageSessionDuration: number;
  completionRate: number;
  dropOffPoints: DropOffPoint[];
  knowledgeBaseUsage: KnowledgeBaseMetrics;
  leadConversionRate: number;
}

interface DropOffPoint {
  questionId: string;
  dropOffCount: number;
  dropOffRate: number;
}

interface KnowledgeBaseMetrics {
  totalQueries: number;
  averageConfidenceScore: number;
  topCategories: CategoryUsage[];
  helpfulnessRating: number;
}

interface CategoryUsage {
  category: KnowledgeCategory;
  queryCount: number;
  averageConfidence: number;
}
```

## Data Relationships

### Primary Relationships
- `chat_sessions` → `chat_messages` (1:many)
- `chat_sessions` → `leads` (1:1)
- `chat_sessions` → `knowledge_queries` (1:many)
- `knowledge_topics` → `knowledge_queries` (1:many)
- `flow_questions` → `chat_messages` (1:many via questionId)

### Data Flow
1. **Session Creation**: New chat session created with unique sessionId
2. **Message Exchange**: Messages stored with session reference
3. **Flow Progression**: Flow state updated with each user response
4. **Knowledge Queries**: Separate tracking for knowledge base interactions
5. **Lead Generation**: Qualified sessions converted to leads
6. **Analytics**: Events tracked throughout user journey

## Data Validation Rules

### Session Management
- Session IDs must be unique and URL-safe
- Flow state must maintain valid JSON structure
- Qualification scores range from 0-100

### Message Validation
- Content cannot be empty for user/bot messages
- Question IDs must reference valid flow questions
- Response data must match question type expectations

### Knowledge Base
- Keywords must be lowercase and trimmed
- Content must be under 2000 characters
- Categories must match predefined enum values

### Lead Qualification
- Email format validation when provided
- Phone number format validation when provided
- Qualification score calculation based on weighted criteria

This data model provides a comprehensive foundation for the chatbot application, ensuring data integrity, efficient querying, and scalable analytics capabilities.
