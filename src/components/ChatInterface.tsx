'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import Image from 'next/image';
import { SimpleChatbot } from '@/lib/chatbot';
import { db, supabase } from '@/lib/supabase';
import { ChatMessage, Question, OptionType, InputType, ChatInterfaceMessage, OptionState } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import '../styles/chat-animations.css';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatInterfaceMessage[]>([]);
  const [sessionId] = useState(() => uuidv4());
  const [chatbot] = useState(() => new SimpleChatbot());
  const [isLoading, setIsLoading] = useState(false);
  
  // Input field management
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus custom response inputs when they're auto-expanded
  useEffect(() => {
    // Find the most recent message with isInputActive and CUSTOM_RESPONSE type
    const lastActiveInput = messages
      .slice()
      .reverse()
      .find(m => m.isInputActive && m.optionType === OptionType.CUSTOM_RESPONSE && !m.isCompleted);

    if (lastActiveInput) {
      // Focus the input field after a short delay to ensure DOM is ready
      setTimeout(() => {
        const inputRef = inputRefs.current[lastActiveInput.id];
        if (inputRef) {
          inputRef.focus();
        }
      }, 100);
    }
  }, [messages]);

  // Initialize chat on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const greeting = chatbot.getInitialGreeting();
        const firstQuestion = chatbot.getCurrentQuestion();
        
        const initialMessages: ChatInterfaceMessage[] = [
          {
            id: uuidv4(),
            type: 'bot',
            content: greeting,
            timestamp: new Date()
          }
        ];

        if (firstQuestion) {
          const questionMessage = await createQuestionMessage(firstQuestion);
          initialMessages.push(questionMessage);
        }

        setMessages(initialMessages);

        // Save to database if available
        if (supabase) {
          try {
            for (const message of initialMessages) {
              const dbType = message.type.startsWith('bot') ? 'bot' : (message.type === 'user' ? 'user' : 'bot');
              await db.addMessage(sessionId, dbType as 'bot' | 'user' | 'knowledge_base', message.content);
            }
          } catch (error) {
            console.warn('Database not available, messages not persisted:', error instanceof Error ? error.message : error);
          }
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

    if (messages.length === 0) {
      initializeChat();
    }
  }, [messages.length, sessionId, chatbot]);

  // Create a message from a Question object
  const createQuestionMessage = async (question: Question): Promise<ChatInterfaceMessage> => {
    const message: ChatInterfaceMessage = {
      id: uuidv4(),
      type: 'bot-with-options',
      content: question.text,
      timestamp: new Date(),
      questionId: question.id,
      questionType: question.type,
      isCompleted: false
    };

    // Use explicit option type if defined, otherwise determine from question type
    if (question.optionType && question.options) {
      message.options = question.options;
      message.optionType = question.optionType;
      if (question.inputType) {
        message.inputType = question.inputType;
      }
      // Auto-expand custom response inputs
      if (question.optionType === OptionType.CUSTOM_RESPONSE) {
        message.isInputActive = true;
      }
    } else {
      // Determine option type and configure message accordingly
      switch (question.type) {
        case 'multiple_choice':
          message.options = question.options;
          message.optionType = OptionType.SINGLE_SELECT;
          break;

        case 'multiple_choice_multi_select':
          message.options = question.options;
          message.optionType = OptionType.MULTI_SELECT;
          break;

        case 'text':
          message.options = ['Enter your answer'];
          message.optionType = OptionType.CUSTOM_RESPONSE;
          message.inputType = InputType.TEXT;
          message.isInputActive = true; // Auto-expand input field
          break;

        case 'number':
          const numberButtonText = question.id === 'Q3' ? 'Enter number of attendees' : 'Enter number';
          message.options = [numberButtonText];
          message.optionType = OptionType.CUSTOM_RESPONSE;
          message.inputType = InputType.NUMBER;
          message.isInputActive = true; // Auto-expand input field
          break;

        case 'date':
          const dateButtonText = question.id === 'Q4' ? 'Enter retreat date' :
                                question.id === 'Q24' ? 'Enter decision date' : 'Enter date';
          message.options = [dateButtonText];
          message.optionType = OptionType.CUSTOM_RESPONSE;
          message.inputType = InputType.DATE;
          message.isInputActive = true; // Auto-expand input field

          // Set default date value to 6 months from today
          const defaultDate = new Date();
          defaultDate.setMonth(defaultDate.getMonth() + 6);
          const defaultDateString = defaultDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
          message.inputValue = defaultDateString;

          // Also set in inputValues state so it appears in the input field
          setInputValues(prev => ({ ...prev, [message.id]: defaultDateString }));
          break;

        case 'yes_no':
          message.options = ['Yes', 'No'];
          message.optionType = OptionType.SINGLE_SELECT;
          break;

        default:
          message.type = 'bot';
          message.options = undefined;
      }
    }

    return message;
  };

  const addMessage = async (type: 'bot' | 'user' | 'bot-with-options', content: string, options?: string[], optionType?: OptionType) => {
    const message: ChatInterfaceMessage = {
      id: uuidv4(),
      type,
      content,
      timestamp: new Date(),
      options,
      optionType,
      isCompleted: false
    };

    setMessages(prev => [...prev, message]);

    // Only attempt database operations if Supabase is available
    if (supabase) {
      try {
        const dbType = type.startsWith('bot') ? 'bot' : (type === 'user' ? 'user' : 'bot');
        await db.addMessage(sessionId, dbType as 'bot' | 'user' | 'knowledge_base', content);
      } catch (error) {
        // More detailed error logging for debugging
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn('Database operation failed, continuing without persistence:', {
          sessionId,
          messageType: type,
          error: errorMessage,
          timestamp: new Date().toISOString()
        });

        // App continues to work normally even if database fails
        // This ensures the user experience is not interrupted
      }
    }
  };

  const handleUserResponse = async (response: string | number | number[], showUserMessage: boolean = true) => {
    setIsLoading(true);

    try {
      // Add user message only if specified (hide for multiple choice selections)
      if (showUserMessage) {
        await addMessage('user', response.toString());
      }

      const result = chatbot.processResponse(response);
      
      if (result.response) {
        await addMessage('bot', result.response);
      }

      // Handle conversation end
      if (result.nextQuestion === 'END') {
        // Conversation has ended, no more questions
        return;
      }

      const nextQuestion = chatbot.getCurrentQuestion();
      if (nextQuestion) {
        const questionMessage = await createQuestionMessage(nextQuestion);
        setMessages(prev => [...prev, questionMessage]);
      }
    } catch (error) {
      console.error('Error processing response:', error);
      await addMessage('bot', 'I apologize, but I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  // Handle option selection
  const handleOptionSelect = async (optionIndex: number, messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.options || isLoading) return;

    // Handle different option types
    switch (message.optionType) {
      case OptionType.SINGLE_SELECT:
        await handleSingleSelectOption(optionIndex, messageId);
        break;

      case OptionType.MULTI_SELECT:
        handleMultiSelectToggle(optionIndex, messageId);
        break;

      case OptionType.USER_OVERRIDE:
        handleUserOverrideActivation(messageId);
        break;

      case OptionType.CUSTOM_RESPONSE:
        handleCustomResponseActivation(messageId);
        break;

      default:
        await handleSingleSelectOption(optionIndex, messageId);
    }
  };

  // Single-select option handler
  const handleSingleSelectOption = async (optionIndex: number, messageId: string) => {
    // Update message to show selection
    setMessages(prev => prev.map(m =>
      m.id === messageId
        ? { ...m, selectedOption: optionIndex, isCompleted: true }
        : m
    ));

    // Process the response
    await handleUserResponse(optionIndex, false);
  };

  // Multi-select toggle handler
  const handleMultiSelectToggle = (optionIndex: number, messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const currentSelections = m.selectedOptions || [];
        const newSelections = currentSelections.includes(optionIndex)
          ? currentSelections.filter(i => i !== optionIndex)
          : [...currentSelections, optionIndex];

        return { ...m, selectedOptions: newSelections };
      }
      return m;
    }));
  };

  // Multi-select confirm handler
  const handleMultiSelectConfirm = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || !message.selectedOptions || message.selectedOptions.length === 0) return;

    // Mark as completed
    setMessages(prev => prev.map(m =>
      m.id === messageId
        ? { ...m, isCompleted: true }
        : m
    ));

    // Process the response
    await handleUserResponse(message.selectedOptions, false);
  };

  // User-override activation handler
  const handleUserOverrideActivation = (messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        // Store the original option type so we can restore it later
        return {
          ...m,
          isInputActive: true,
          optionType: OptionType.USER_OVERRIDE,
          originalOptionType: m.originalOptionType || m.optionType // Preserve original if not already stored
        };
      }
      return m;
    }));

    // Focus the input field after state update
    setTimeout(() => {
      const inputRef = inputRefs.current[messageId];
      if (inputRef) {
        inputRef.focus();
      }
    }, 0);
  };

  // Custom-response activation handler
  const handleCustomResponseActivation = (messageId: string) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId
        ? { ...m, isInputActive: true }
        : m
    ));

    // Focus the input field after state update
    setTimeout(() => {
      const inputRef = inputRefs.current[messageId];
      if (inputRef) {
        inputRef.focus();
      }
    }, 0);
  };

  // Input submission handler
  const handleInputSubmit = async (messageId: string, value: string) => {
    if (!value.trim()) return;

    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    // Update message to show completion
    setMessages(prev => prev.map(m =>
      m.id === messageId
        ? { ...m, inputValue: value, isCompleted: true, isInputActive: false }
        : m
    ));

    // Clear input value
    setInputValues(prev => ({ ...prev, [messageId]: '' }));

    // Process the response
    if (message.optionType === OptionType.USER_OVERRIDE) {
      // For user override, we need to handle custom question processing
      await handleCustomQuestion(value);
    } else {
      // For custom response, process as normal response but don't show duplicate user message
      await handleUserResponse(value, false);
    }
  };

  // Custom question handler
  const handleCustomQuestion = async (question: string) => {
    setIsLoading(true);
    try {
      // Don't add user message here - it's already embedded in the bot message
      // Process with OpenAI knowledge base
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: question,
          type: 'knowledge'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await addMessage('bot', data.response);
      } else {
        throw new Error('Failed to get AI response');
      }

      // Return to the original conversation flow
      const currentQuestion = chatbot.getCurrentQuestion();
      if (currentQuestion) {
        const questionMessage = await createQuestionMessage(currentQuestion);
        setMessages(prev => [...prev, questionMessage]);
      }
    } catch (error) {
      console.error('Error processing custom question:', error);
      await addMessage('bot', 'I apologize, but I encountered an error processing your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Click outside handler for input fields
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Check if click is outside any active input field or on a button/input element
      const isClickInsideInput = Object.values(inputRefs.current).some(ref =>
        ref && ref.contains(target)
      );

      // Don't trigger click-outside if clicking on buttons or input elements
      const isClickOnButton = target.tagName === 'BUTTON' || target.closest('button');
      const isClickOnInput = target.tagName === 'INPUT' || target.closest('input');

      if (!isClickInsideInput && !isClickOnButton && !isClickOnInput) {
        // Revert any active input fields back to button state
        setMessages(prev => prev.map(message => {
          // If this was a user-override activation, restore the original option type
          if (message.isInputActive && message.originalOptionType) {
            return {
              ...message,
              isInputActive: false,
              optionType: message.originalOptionType, // Restore original option type
              originalOptionType: undefined // Clear the stored original
            };
          }
          // For other input types (custom-response), just deactivate
          return {
            ...message,
            isInputActive: false
          };
        }));

        // Clear input values for reverted fields
        setInputValues({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Render options based on option type
  const renderMessageOptions = (message: ChatInterfaceMessage) => {
    if (!message.options) return null;

    // If message is completed, show the final state
    if (message.isCompleted) {
      return renderCompletedOptions(message);
    }

    // If input is active and option type is USER_OVERRIDE, render user override options
    if (message.isInputActive && message.optionType === OptionType.USER_OVERRIDE) {
      return renderUserOverrideOptions(message);
    }

    // Render based on option type
    switch (message.optionType) {
      case OptionType.SINGLE_SELECT:
        return renderSingleSelectOptions(message);
      case OptionType.MULTI_SELECT:
        return renderMultiSelectOptions(message);
      case OptionType.USER_OVERRIDE:
        return renderUserOverrideOptions(message);
      case OptionType.CUSTOM_RESPONSE:
        return renderCustomResponseOptions(message);
      default:
        return renderSingleSelectOptions(message);
    }
  };

  // Render completed options (show selected state)
  const renderCompletedOptions = (message: ChatInterfaceMessage) => {
    if (message.selectedOption !== undefined && message.options) {
      // Single-select completed
      return (
        <div className="space-y-3">
          <div className="w-full text-left p-4 rounded-lg bg-green-500 text-white text-lg">
            {message.options[message.selectedOption]}
          </div>
        </div>
      );
    }

    if (message.selectedOptions && message.options) {
      // Multi-select completed
      return (
        <div className="space-y-3">
          {message.selectedOptions.map(index => (
            <div key={index} className="w-full text-left p-4 rounded-lg bg-green-500 text-white text-lg">
              {message.options![index]}
            </div>
          ))}
        </div>
      );
    }

    if (message.inputValue) {
      // Input completed
      return (
        <div className="space-y-3">
          <div className="w-full text-left p-4 rounded-lg bg-green-500 text-white text-lg">
            {message.inputValue}
          </div>
        </div>
      );
    }

    return null;
  };

  // Render single-select options
  const renderSingleSelectOptions = (message: ChatInterfaceMessage) => {
    const optionsWithCustom = [...(message.options || [])];

    // Add user-override option for single-select (except for yes/no questions)
    if (message.questionType !== 'yes_no') {
      optionsWithCustom.push("Ask a different question about Green Office");
    }

    return (
      <div className="space-y-3">
        {optionsWithCustom.map((option, index) => {
          const isCustomOption = index === optionsWithCustom.length - 1 && option.includes("Ask a different question");

          return (
            <button
              key={index}
              onClick={() => {
                if (isCustomOption) {
                  handleUserOverrideActivation(message.id);
                } else {
                  handleOptionSelect(index, message.id);
                }
              }}
              disabled={isLoading}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 disabled:opacity-50 text-lg ${
                isCustomOption
                  ? 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  };

  // Render multi-select options
  const renderMultiSelectOptions = (message: ChatInterfaceMessage) => {
    const selectedOptions = message.selectedOptions || [];
    const hasSelections = selectedOptions.length > 0;

    return (
      <div className="space-y-3">
        {/* Regular options with checkboxes */}
        {message.options?.map((option, index) => {
          const isSelected = selectedOptions.includes(index);

          return (
            <button
              key={index}
              onClick={() => handleMultiSelectToggle(index, message.id)}
              disabled={isLoading}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 text-lg ${
                isSelected
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                }`}>
                  {isSelected && <span className="text-white text-sm">✓</span>}
                </div>
                {option}
              </div>
            </button>
          );
        })}

        {/* Confirm button */}
        {hasSelections && (
          <button
            onClick={() => handleMultiSelectConfirm(message.id)}
            disabled={isLoading}
            className="w-full text-left p-4 rounded-lg border border-green-500 bg-green-500 text-white text-lg hover:bg-green-600 transition-all duration-200"
          >
            Confirm Selection{selectedOptions.length > 1 ? 's' : ''} ({selectedOptions.length})
          </button>
        )}

        {/* User-override option */}
        <button
          onClick={() => handleUserOverrideActivation(message.id)}
          disabled={isLoading}
          className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 text-lg"
        >
          Ask a different question about Green Office
        </button>
      </div>
    );
  };

  // Render user-override options (custom question input)
  const renderUserOverrideOptions = (message: ChatInterfaceMessage) => {
    if (message.isInputActive) {
      const currentValue = inputValues[message.id] || '';

      return (
        <div className="space-y-3">
          {/* Show other options as interactive */}
          {message.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index, message.id)}
              disabled={isLoading}
              className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-lg"
            >
              {option}
            </button>
          ))}

          {/* Active input field */}
          <div className="flex gap-2">
            <Input
              ref={(el) => { inputRefs.current[message.id] = el; }}
              type="text"
              placeholder="Ask your own question about Green Office..."
              value={currentValue}
              onChange={(e) => setInputValues(prev => ({ ...prev, [message.id]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && currentValue.trim() && handleInputSubmit(message.id, currentValue.trim())}
              className="flex-1 text-lg"
              disabled={isLoading}
              autoFocus
            />
            <Button
              onClick={() => handleInputSubmit(message.id, currentValue)}
              disabled={!currentValue.trim() || isLoading}
              className="px-6 py-2"
            >
              Enter
            </Button>
          </div>
        </div>
      );
    }

    // Show as regular single-select with user-override option
    return renderSingleSelectOptions(message);
  };

  // Render custom-response options (input-specific buttons)
  const renderCustomResponseOptions = (message: ChatInterfaceMessage) => {
    if (message.isInputActive) {
      const currentValue = inputValues[message.id] || '';

      // Get input type and placeholder
      const inputType = message.inputType || InputType.TEXT;
      const getPlaceholder = () => {
        switch (inputType) {
          case InputType.NUMBER:
            return message.questionId === 'Q3' ? 'Enter number of attendees' : 'Enter number';
          case InputType.DATE:
            return message.questionId === 'Q4' ? 'Select retreat date' :
                   message.questionId === 'Q24' ? 'Select decision date' : 'Select date';
          case InputType.EMAIL:
            return 'Enter your email address';
          default:
            return 'Enter your answer';
        }
      };

      return (
        <div className="space-y-3">
          {/* Active input field */}
          <div className="flex gap-2">
            <Input
              ref={(el) => { inputRefs.current[message.id] = el; }}
              type={inputType}
              placeholder={getPlaceholder()}
              value={currentValue}
              onChange={(e) => setInputValues(prev => ({ ...prev, [message.id]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && currentValue.trim() && handleInputSubmit(message.id, currentValue.trim())}
              className="flex-1 text-lg"
              disabled={isLoading}
              autoFocus
            />
            <Button
              onClick={() => handleInputSubmit(message.id, currentValue)}
              disabled={!currentValue.trim() || isLoading}
              className="px-6 py-2"
            >
              Enter
            </Button>
          </div>

          {/* User-override option */}
          <button
            onClick={() => handleUserOverrideActivation(message.id)}
            disabled={isLoading}
            className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 text-lg"
          >
            Ask a different question about Green Office
          </button>
        </div>
      );
    }

    // Show button that transforms to input
    return (
      <div className="space-y-3">
        {message.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleCustomResponseActivation(message.id)}
            disabled={isLoading}
            className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-lg"
          >
            {option}
          </button>
        ))}

        {/* User-override option */}
        <button
          onClick={() => handleUserOverrideActivation(message.id)}
          disabled={isLoading}
          className="w-full text-left p-4 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 text-lg"
        >
          Ask a different question about Green Office
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-3">
        <div className="flex items-center gap-4">
          <Image
            src="/images/goLogo.png"
            alt="Green Office"
            width={0}
            height={0}
            sizes="100vw"
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AI Assistant</h1>
            <p className="text-sm text-gray-600">Retreat venue discovery</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col min-h-0">


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
                className={`w-full max-w-2xl lg:max-w-4xl px-6 py-4 rounded-lg transition-all duration-300 ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white message-user'
                    : 'bg-gray-100 text-gray-900 message-bot'
                }`}
              >
                {message.type === 'bot-with-options' ? (
                  <div className="space-y-4">
                    <p className="text-lg text-gray-900">{message.content}</p>
                    {renderMessageOptions(message)}
                  </div>
                ) : (
                  <p className="text-lg whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};
