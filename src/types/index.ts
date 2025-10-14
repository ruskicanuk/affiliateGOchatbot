// All types in one file as per simplified approach

// Option type enumeration for the four distinct interaction patterns
export enum OptionType {
  SINGLE_SELECT = 'SINGLE_SELECT',     // Default: click one option, immediate processing
  MULTI_SELECT = 'MULTI_SELECT',       // Select multiple options, confirm button to process
  USER_OVERRIDE = 'USER_OVERRIDE',     // "Ask a different question" - custom question input
  CUSTOM_RESPONSE = 'CUSTOM_RESPONSE'  // Input-specific buttons (number, date, email, text)
}

// Input type enumeration for custom response options
export enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  EMAIL = 'email'
}

// Visual state enumeration for option buttons
export enum OptionState {
  DEFAULT = 'default',
  HOVER = 'hover',
  SELECTED = 'selected',
  INPUT_ACTIVE = 'input_active',
  COMPLETED = 'completed'
}

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

// Enhanced Question interface with option type support
export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'multiple_choice_multi_select' | 'text' | 'number' | 'date' | 'yes_no';
  options?: string[];
  optionType?: OptionType; // Explicit option behavior definition
  inputType?: InputType;   // For CUSTOM_RESPONSE options
  next: (answer: any) => string;
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    dateAfter?: Date;
    dateBefore?: Date;
  };
}

// Enhanced Message interface for the ChatInterface component
export interface ChatInterfaceMessage {
  id: string;
  type: 'bot' | 'user' | 'bot-with-options';
  content: string;
  timestamp: Date;

  // Option configuration
  options?: string[];
  optionType?: OptionType;
  inputType?: InputType;

  // State management for different option types
  selectedOption?: number;           // Single-select: selected option index
  selectedOptions?: number[];        // Multi-select: array of selected indices
  isInputActive?: boolean;          // User-override & Custom-response: input field active
  inputValue?: string;              // Current input field value
  isCompleted?: boolean;            // Whether interaction is finished

  // User-override specific
  customQuestionText?: string;      // Stored custom question when submitted

  // Metadata
  questionId?: string;
  questionType?: string;

  // Visual state tracking
  optionStates?: Record<number, OptionState>; // Track visual state of each option
}

// Basic types
export type UserRole = 'planner' | 'internal_lead' | 'other';
export type SessionStatus = 'active' | 'completed' | 'abandoned';
export type MessageType = 'user' | 'bot' | 'knowledge_base';
