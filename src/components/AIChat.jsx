/**
 * @file AIChat.jsx
 * @description Interactive streaming AI chat widget for BloodLink AI.
 * Enables live conversational assistance for blood donors, recipients, and medical staff
 * with token streaming, auto-scroll, and context-aware system prompting.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User, Loader } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import { getStreamingChatAssistance } from '../services/openaiService';

/**
 * AIChat Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {'general'|'emergency'|'donor'|'medical'} [props.context='general'] - System prompt role context.
 * @param {string} [props.className=''] - Additional CSS/Tailwind classes for container customization.
 * @returns {JSX.Element} Interactive streaming chat window.
 */
const AIChat = ({ context = 'general', className = '' }) => {
  // Chat message history list
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI blood bank assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  // Current text input state
  const [inputMessage, setInputMessage] = useState('');

  // Flag denoting active response generation and streaming
  const [isLoading, setIsLoading] = useState(false);

  // Ref anchor to automatically scroll to the bottom upon new messages
  const messagesEndRef = useRef(null);

  /**
   * Smoothly scrolls the chat viewport to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom every time message state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Submits user message to the OpenAI streaming service and streams tokens into state.
   */
  const handleSendMessage = async () => {
    if (!inputMessage?.trim() || isLoading) return;

    // Construct user message object
    const userMessage = {
      id: Date.now()?.toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Append user message immediately & reset input field
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Initialize an empty placeholder AI message for streaming updates
    const aiMessageId = (Date.now() + 1)?.toString();
    const aiMessage = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // Stream tokens dynamically into the active AI message bubble
      await getStreamingChatAssistance(
        inputMessage,
        (chunk) => {
          setMessages(prev => 
            prev?.map(msg => 
              msg?.id === aiMessageId 
                ? { ...msg, content: msg?.content + chunk }
                : msg
            )
          );
        },
        context
      );
    } catch (error) {
      console.error('Chat error:', error);
      // Gracefully notify user in case of connectivity or token failure
      setMessages(prev => 
        prev?.map(msg => 
          msg?.id === aiMessageId 
            ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles keyboard shortcuts (Enter to send, Shift+Enter for new line).
   * @param {React.KeyboardEvent} e - Keyboard event.
   */
  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col bg-white rounded-lg shadow-md ${className}`}>
      {/* Chat Header with Status Indicator */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200">
        <MessageCircle className="w-5 h-5 text-red-600" />
        <h3 className="font-semibold text-gray-800">AI Assistant</h3>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Online
        </span>
      </div>

      {/* Messages Scroll Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
        {messages?.map((message) => (
          <div
            key={message?.id}
            className={`flex items-start gap-3 ${
              message?.type === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* User / Bot Avatar Icon */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-white text-sm
              ${message?.type === 'user' ? 'bg-blue-600' : 'bg-red-600'}
            `}>
              {message?.type === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>

            {/* Message Bubble Content */}
            <div className={`
              max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-lg
              ${message?.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}
            `}>
              <p className="text-sm whitespace-pre-wrap">{message?.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message?.timestamp?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Loading Spinner during Token Generation */}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input & Action Buttons */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e?.target?.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage?.trim() || isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
          >
            <Send size={16} />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AIChat;
