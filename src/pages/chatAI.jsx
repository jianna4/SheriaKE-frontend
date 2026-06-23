// src/ChatAI.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Sparkles, User, Briefcase, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../Components/contexts/AuthContext';
import { useChat } from '../Components/contexts/chatcontext';
import ChatSidebar from '../Components/chatsection/chatsidebar';

const ChatAI = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { 
    messages, 
    sendMessage, 
    loading, 
    createNewSession,
    clearGuestChat,
    sidebarOpen,
    setSidebarOpen
  } = useChat();
  
  const [input, setInput] = useState('');
  const [role, setRole] = useState('employee');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle role change
  useEffect(() => {
    if (isAuthenticated && messages.length === 0) {
      // Create a new session when role changes
      createNewSession(role);
    }
  }, [role, isAuthenticated]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const query = input.trim();
    setInput('');
    await sendMessage(query, role);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    if (isAuthenticated) {
      createNewSession(role);
    } else {
      clearGuestChat();
      // Add welcome message for guest
      // The ChatContext handles this
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const suggestedQuestions = role === 'employee' 
    ? [
        "How much annual leave am I entitled to?",
        "What are the rules for maternity leave?",
        "Can I be fired without notice?",
        "What is unfair termination?",
        "How do I report a complaint?"
      ]
    : [
        "What records must I keep for employees?",
        "How do I properly terminate an employee?",
        "What are the requirements for a written contract?",
        "What deductions can I make from wages?",
        "What are the penalties for non-compliance?"
      ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ChatSidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center">
                <Sparkles size={18} className="text-gold-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-navy-700">SheriaAI Chat</h1>
                <p className="text-xs text-gray-500">
                  {role === 'employee' ? 'Employee Mode' : 'Employer Mode'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleRoleChange('employee')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  role === 'employee'
                    ? 'bg-[#081c2b]/95 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User size={14} />
                Employee
              </button>
              <button
                onClick={() => handleRoleChange('employer')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  role === 'employer'
                    ? 'bg-[#081c2b]/95 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Briefcase size={14} />
                Employer
              </button>
            </div>

            {/* Auth Status */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {user?.first_name || user?.username}
                </span>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="px-4 py-2 bg-navy-700 text-white rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors flex items-center gap-2"
              >
                <LogIn size={16} />
                Sign In
              </a>
            )}
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-navy-700 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles size={32} className="text-gold-400" />
              </div>
              <h2 className="text-2xl font-bold text-navy-700 mb-2">
                Kenya Employment Act Assistant
              </h2>
              <p className="text-gray-600 max-w-md mb-6">
                Ask me anything about the Employment Act 2007 (Chapter 226)
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(question);
                      setTimeout(handleSend, 100);
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
              {!isAuthenticated && (
                <p className="text-sm text-gray-400 mt-6">
                   Sign in to save your chat history
                </p>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-[#081c2b]/70 text-white'
                        : message.type === 'system'
                        ? 'bg-gray-100 text-gray-600 text-sm italic'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    {message.type === 'system' ? (
                      <div className="text-center">{message.content}</div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {message.content.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < message.content.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                        {message.sources && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Sources: {message.sources.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <button
              onClick={handleNewChat}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 self-end"
              title="New Chat"
            >
              <Sparkles size={20} />
            </button>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about the Employment Act..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: '50px', maxHeight: '150px' }}
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`p-3 rounded-lg transition-colors ${
                input.trim() && !loading
                  ? 'bg-[#081c2b]/95 text-white hover:bg-navy-800'
                  : 'bg-[#081c2b]/90 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="max-w-3xl mx-auto mt-2 flex justify-between text-xs text-gray-400">
            <span>Powered by SheriaAI</span>
            <span>{isAuthenticated ? ' Saved' : ' Sign in to save'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;