'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';
import { SimpleChatbot } from '@/lib/chatbot';
import { db } from '@/lib/supabase';
import { ChatMessage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  type: 'bot' | 'user' | 'knowledge_base';
  content: string;
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => uuidv4());
  const [chatbot] = useState(() => new SimpleChatbot());
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [knowledgeMode, setKnowledgeMode] = useState(false);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptureMessage, setLeadCaptureMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize session and show greeting
    const initializeChat = async () => {
      try {
        await db.createSession(sessionId);
        const greeting = chatbot.getInitialGreeting();
        const initialMessage: Message = {
          id: uuidv4(),
          type: 'bot',
          content: greeting,
          timestamp: new Date()
        };
        setMessages([initialMessage]);
        await db.addMessage(sessionId, 'bot', greeting);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initializeChat();
  }, [sessionId, chatbot]);

  const addMessage = async (type: 'bot' | 'user' | 'knowledge_base', content: string) => {
    const message: Message = {
      id: uuidv4(),
      type,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, message]);
    
    try {
      await db.addMessage(sessionId, type, content);
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const handleUserResponse = async (response: string | number) => {
    setIsLoading(true);
    
    try {
      // Add user message
      await addMessage('user', response.toString());

      if (knowledgeMode) {
        // Handle knowledge base query with OpenAI enhancement
        try {
          const openaiResponse = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: response.toString(),
              type: 'knowledge'
            })
          });

          let knowledgeResponse: string;
          if (openaiResponse.ok) {
            const data = await openaiResponse.json();
            knowledgeResponse = data.response + "\n\nThanks for the question! Now, to help tailor this better, let's continue where we left off.";
          } else {
            // Fallback to static knowledge base
            knowledgeResponse = chatbot.handleKnowledgeQuery(response.toString());
          }

          await addMessage('knowledge_base', knowledgeResponse);
          await db.addKnowledgeQuery(sessionId, response.toString(), knowledgeResponse);
        } catch (error) {
          console.error('OpenAI knowledge query failed:', error);
          const fallbackResponse = chatbot.handleKnowledgeQuery(response.toString());
          await addMessage('knowledge_base', fallbackResponse);
          await db.addKnowledgeQuery(sessionId, response.toString(), fallbackResponse);
        }

        setKnowledgeMode(false);

        // Show current question again
        const currentQuestion = chatbot.getCurrentQuestion();
        if (currentQuestion) {
          await addMessage('bot', currentQuestion.text);
        }
      } else {
        // Process normal flow response
        const result = chatbot.processResponse(response);
        
        if (result.response) {
          // Special response (like waitlist message)
          await addMessage('bot', result.response);
          setLeadCaptureMessage(result.response);
          setShowLeadCapture(true);
        } else if (result.nextQuestion === 'KNOWLEDGE_BASE') {
          setKnowledgeMode(true);
          await addMessage('bot', "What would you like to know about Green Office Villas?");
        } else if (result.nextQuestion === 'LEAD_CAPTURE') {
          setShowLeadCapture(true);
        } else {
          // Continue with next question
          const nextQuestion = chatbot.getCurrentQuestion();
          if (nextQuestion) {
            await addMessage('bot', nextQuestion.text);
          } else {
            // End of conversation flow
            await addMessage('bot', "Thank you for completing our comprehensive retreat planning questionnaire! Based on your responses, I believe Green Office Villas would be an excellent fit for your team. Feel free to ask any additional questions about our facilities, services, or booking process.");
            setKnowledgeMode(true);
          }
        }

        // Update session with responses and score
        const userResponses = chatbot.getUserResponses();
        const qualificationScore = chatbot.calculateQualificationScore();
        await db.updateSession(sessionId, { userResponses, qualificationScore });
      }
    } catch (error) {
      console.error('Error processing response:', error);
      await addMessage('bot', "I'm sorry, there was an error processing your response. Please try again.");
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
      
      await db.updateSession(sessionId, { 
        userResponses, 
        sessionStatus: 'completed',
        qualificationScore: chatbot.calculateQualificationScore()
      });
      
      await addMessage('bot', "Thank you! We've captured your information and will be in touch soon. Feel free to ask any other questions about Green Office Villas.");
      setShowLeadCapture(false);
      setKnowledgeMode(true);
    } catch (error) {
      console.error('Error capturing lead:', error);
    }
  };

  const renderCurrentQuestion = () => {
    if (showLeadCapture) {
      return (
        <Card className="mt-4">
          <CardContent>
            <h3 className="font-semibold mb-2">Let's stay in touch!</h3>
            <p className="text-sm text-gray-600 mb-3">{leadCaptureMessage || "Please provide your email so we can follow up with you."}</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your.email@company.com"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && currentInput.trim() && handleLeadCapture(currentInput.trim())}
              />
              <Button 
                onClick={() => currentInput.trim() && handleLeadCapture(currentInput.trim())}
                disabled={!currentInput.trim()}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (knowledgeMode) {
      return (
        <Card className="mt-4">
          <CardContent>
            <h3 className="font-semibold mb-2">Ask me anything about Green Office Villas</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Type your question here..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && currentInput.trim() && handleUserResponse(currentInput.trim())}
              />
              <Button 
                onClick={() => currentInput.trim() && handleUserResponse(currentInput.trim())}
                disabled={!currentInput.trim() || isLoading}
              >
                Ask
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    const currentQuestion = chatbot.getCurrentQuestion();
    if (!currentQuestion) return null;

    return (
      <Card className="mt-4">
        <CardContent>
          {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto py-3 px-4"
                  onClick={() => handleUserResponse(index)}
                  disabled={isLoading}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : currentQuestion.type === 'number' ? (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter number of attendees"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && currentInput && handleUserResponse(parseInt(currentInput))}
              />
              <Button 
                onClick={() => currentInput && handleUserResponse(parseInt(currentInput))}
                disabled={!currentInput || isLoading}
              >
                Submit
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Type your answer..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && currentInput.trim() && handleUserResponse(currentInput.trim())}
              />
              <Button 
                onClick={() => currentInput.trim() && handleUserResponse(currentInput.trim())}
                disabled={!currentInput.trim() || isLoading}
              >
                Submit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Green Office Villas</h1>
          <p className="text-gray-600">Your AI assistant for retreat planning</p>
        </div>
        
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : message.type === 'knowledge_base'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <p className="text-sm">Typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-6 border-t border-gray-200">
          {renderCurrentQuestion()}
        </div>
      </div>
    </div>
  );
};
