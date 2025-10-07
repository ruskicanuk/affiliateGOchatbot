'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import Image from 'next/image';
import { SimpleChatbot } from '@/lib/chatbot';
import { db } from '@/lib/supabase';
import { ChatMessage } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import '../styles/chat-animations.css';

interface Message {
  id: string;
  type: 'bot' | 'user' | 'bot-with-options';
  content: string;
  timestamp: Date;
  options?: string[];
  selectedOption?: number;
  questionId?: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => uuidv4());
  const [chatbot] = useState(() => new SimpleChatbot());
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureMessage, setLeadCaptureMessage] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize session and show greeting with first question
    const initializeChat = async () => {
      try {
        // Try to create session, but don't fail if database is not available
        try {
          await db.createSession(sessionId);
        } catch (dbError) {
          console.warn('Database not available, continuing without persistence:', dbError);
        }

        // Create initial message with combined welcome and first question
        const firstQuestion = chatbot.getCurrentQuestion();
        const initialMessages: Message[] = [];

        if (firstQuestion && firstQuestion.type === 'multiple_choice' && firstQuestion.options) {
          // Combine welcome message with first question as per documentation
          const combinedMessage: Message = {
            id: uuidv4(),
            type: 'bot-with-options',
            content: "Welcome! I'll help you explore whether Green Office is a fit by asking you a series of questions.  You can always ask a change the topic by asking a custom question (at the bottom of the chat window).  What best describes your role?",
            timestamp: new Date(),
            options: firstQuestion.options,
            questionId: firstQuestion.id
          };
          initialMessages.push(combinedMessage);
        } else if (firstQuestion) {
          const combinedMessage: Message = {
            id: uuidv4(),
            type: 'bot',
            content: "Welcome! I'll help you explore whether Green Office is a fit by asking you a series of questions.  You can always ask a change the topic by asking a custom question (at the bottom of the chat window).  " + firstQuestion.text,
            timestamp: new Date()
          };
          initialMessages.push(combinedMessage);
        } else {
          // Fallback welcome message
          const welcomeMessage: Message = {
            id: uuidv4(),
            type: 'bot',
            content: "Welcome! I'll help you explore whether Green Office is a fit by asking you a series of questions.  You can always ask a change the topic by asking a custom question (at the bottom of the chat window).",
            timestamp: new Date()
          };
          initialMessages.push(welcomeMessage);
        }

        setMessages(initialMessages);

        // Save to database if available
        try {
          for (const message of initialMessages) {
            const dbType = message.type === 'bot-with-options' ? 'bot' : message.type;
            await db.addMessage(sessionId, dbType, message.content);
          }
        } catch (error) {
          console.warn('Database not available, messages not persisted:', error instanceof Error ? error.message : error);
        }

      } catch (error) {
        console.error('Failed to initialize chat:', error);
        // Fallback: at least show the welcome message
        setMessages([{
          id: uuidv4(),
          type: 'bot',
          content: "Welcome to Green Office Villas! I'm here to help you plan the perfect retreat for your team.",
          timestamp: new Date()
        }]);
      }
    };

    // Only initialize if messages array is empty
    if (messages.length === 0) {
      initializeChat();
    }
  }, [messages.length, sessionId, chatbot]);

  const addMessage = async (type: 'bot' | 'user' | 'bot-with-options', content: string, options?: string[], questionId?: string) => {
    const message: Message = {
      id: uuidv4(),
      type,
      content,
      timestamp: new Date(),
      options,
      questionId
    };

    setMessages(prev => [...prev, message]);

    try {
      // Map new message types to database types
      const dbType = type === 'bot-with-options' ? 'bot' : type;
      await db.addMessage(sessionId, dbType, content);
    } catch (error) {
      console.warn('Database not available, message not persisted:', error instanceof Error ? error.message : error);
    }
  };

  const handleUserResponse = async (response: string | number, showUserMessage: boolean = true) => {
    setIsLoading(true);

    try {
      // Add user message only if specified (hide for multiple choice selections)
      if (showUserMessage) {
        await addMessage('user', response.toString());
      }

      // Process normal flow response
      const result = chatbot.processResponse(response);

      if (result.response) {
        // Special response (like waitlist message)
        await addMessage('bot', result.response);
        setLeadCaptureMessage(result.response);
        setShowLeadCapture(true);
      } else if (result.nextQuestion === 'LEAD_CAPTURE') {
        setShowLeadCapture(true);
      } else {
        // Continue with next question
        const nextQuestion = chatbot.getCurrentQuestion();
        if (nextQuestion) {
          // Add bot message with options for interactive display
          if (nextQuestion.type === 'multiple_choice' && nextQuestion.options) {
            await addMessage('bot-with-options', nextQuestion.text, nextQuestion.options, nextQuestion.id);
          } else {
            await addMessage('bot', nextQuestion.text);
          }
        } else {
          // End of conversation flow
          await addMessage('bot', "Thank you for completing our comprehensive retreat planning questionnaire! Based on your responses, I believe Green Office Villas would be an excellent fit for your team. Feel free to ask any additional questions about our facilities, services, or booking process.");
        }
      }

      // Update session with responses and score
      try {
        const userResponses = chatbot.getUserResponses();
        const qualificationScore = chatbot.calculateQualificationScore();
        await db.updateSession(sessionId, { userResponses, qualificationScore });
      } catch (error) {
        console.warn('Database not available, session not updated:', error instanceof Error ? error.message : error);
      }
    } catch (error) {
      console.error('Error processing response:', error);
      // Only show error message if it's a real error, not a normal flow issue
      if (error instanceof Error && !error.message.includes('next question')) {
        await addMessage('bot', "I'm sorry, there was an error processing your response. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setCurrentInput('');
    }
  };

  const handleLeadCapture = async (email: string) => {
    try {
      const userResponses = chatbot.getUserResponses();
      userResponses.email = email;
      userResponses.leadCaptured = true;
      
      try {
        await db.updateSession(sessionId, {
          userResponses,
          sessionStatus: 'completed',
          qualificationScore: chatbot.calculateQualificationScore()
        });
      } catch (error) {
        console.warn('Database not available, lead capture not persisted:', error instanceof Error ? error.message : error);
      }
      
      await addMessage('bot', "Thank you! We've captured your information and will be in touch soon. Feel free to ask any other questions about Green Office Villas.");
      setShowLeadCapture(false);
    } catch (error) {
      console.error('Error capturing lead:', error);
    }
  };



  // Handle custom question input
  const handleCustomQuestion = async () => {
    if (!customQuestion.trim()) return;

    setIsLoading(true);
    try {
      await addMessage('user', customQuestion);

      // Handle custom question with OpenAI or static knowledge base
      try {
        // Include conversation context for better responses
        const conversationContext = messages.map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content
        }));

        const openaiResponse = await fetch('/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: customQuestion,
            context: conversationContext,
            type: 'knowledge'
          })
        });

        let knowledgeResponse: string;
        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          knowledgeResponse = data.response;
        } else {
          // Fallback to static knowledge base
          const { searchKnowledge } = await import('@/lib/knowledge-static');
          knowledgeResponse = searchKnowledge(customQuestion);
        }

        await addMessage('bot', knowledgeResponse);
        try {
          await db.addKnowledgeQuery(sessionId, customQuestion, knowledgeResponse);
        } catch (error) {
          console.warn('Database not available, knowledge query not persisted:', error instanceof Error ? error.message : error);
        }
      } catch (error) {
        console.error('Custom question failed:', error);
        const { searchKnowledge } = await import('@/lib/knowledge-static');
        const fallbackResponse = searchKnowledge(customQuestion);
        await addMessage('bot', fallbackResponse);
        try {
          await db.addKnowledgeQuery(sessionId, customQuestion, fallbackResponse);
        } catch (error) {
          console.warn('Database not available, knowledge query not persisted:', error instanceof Error ? error.message : error);
        }
      }

      // After answering custom question, re-present current question options
      const currentQuestion = chatbot.getCurrentQuestion();
      if (currentQuestion && currentQuestion.type === 'multiple_choice' && currentQuestion.options) {
        await addMessage('bot-with-options',
          "Now, let's continue with your retreat planning. " + currentQuestion.text,
          currentQuestion.options,
          currentQuestion.id
        );
      }
    } catch (error) {
      console.error('Error handling custom question:', error);
      await addMessage('bot', "I'm sorry, I couldn't process your question. Please try again.");
    } finally {
      setIsLoading(false);
      setCustomQuestion('');
    }
  };

  // Handle option selection with in-place update
  const handleOptionSelect = async (optionIndex: number, messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.options) return;

    // Update the message in place to show the selection
    setMessages(prev => prev.map(m =>
      m.id === messageId
        ? { ...m, selectedOption: optionIndex }
        : m
    ));

    // Process the response
    await handleUserResponse(optionIndex, false);
  };

  // Render interactive message content
  const renderMessageContent = (message: Message) => {
    if (message.type === 'bot-with-options' && message.options) {
      // If an option has been selected, show only the selected option with dark green background
      if (message.selectedOption !== undefined) {
        const selectedOption = message.options[message.selectedOption];
        return (
          <div className="space-y-4">
            <p className="text-lg text-gray-900">{message.content}</p>
            <div className="space-y-3">
              <div className="w-full text-left p-4 rounded-lg bg-green-500 text-white text-lg">
                {selectedOption}
              </div>
            </div>
          </div>
        );
      }

      // Show all options if none selected yet
      return (
        <div className="space-y-4">
          <p className="text-lg text-gray-900">{message.content}</p>
          <div className="space-y-3">
            {message.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index, message.id)}
                disabled={isLoading}
                className="option-button w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 disabled:opacity-50 text-lg"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return <p className="text-lg">{message.content}</p>;
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white flex-1 flex flex-col">
        {/* Header - Fixed at top */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Image
              src="/images/goLogo.png"
              alt="Green Office Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <h1 className="text-2xl font-semibold text-gray-900">Retreat Planning AI Assistant</h1>
          </div>
        </div>

        {/* Lead Capture Modal */}
        {showLeadCapture && (
          <div className="p-6 border-b border-gray-200 bg-blue-50">
            <h3 className="font-semibold mb-2">Let's stay in touch!</h3>
            <p className="text-sm text-gray-600 mb-3">{leadCaptureMessage || "Please provide your email so we can follow up with you."}</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your.email@company.com"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && currentInput.trim() && handleLeadCapture(currentInput.trim())}
              />
              <Button
                onClick={() => currentInput.trim() && handleLeadCapture(currentInput.trim())}
                disabled={!currentInput.trim()}
              >
                Submit
              </Button>
            </div>
          </div>
        )}

        {/* Chat Messages - Full height scrollable area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-2xl lg:max-w-4xl px-6 py-4 rounded-lg transition-all duration-300 ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white message-user'
                    : 'bg-gray-100 text-gray-900 message-bot'
                }`}
              >
                {message.type === 'bot-with-options' ? (
                  renderMessageContent(message)
                ) : (
                  <p className="text-lg whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-6 py-4 rounded-lg typing-indicator">
                <p className="text-lg">Typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Custom Question Input - Fixed at bottom */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex gap-3">
            <Input
              placeholder="Ask your own question about Green Office Villas..."
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && customQuestion.trim() && handleCustomQuestion()}
              className="flex-1 custom-question-input text-lg p-4"
            />
            <Button
              onClick={handleCustomQuestion}
              disabled={!customQuestion.trim() || isLoading}
              className="px-8 py-4 text-lg"
            >
              Ask
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
