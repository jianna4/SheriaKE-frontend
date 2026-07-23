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

  // Styles
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f9fafb',
      overflow: 'hidden'
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minWidth: 0
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: 0
    },
    menuButton: {
      padding: '6px 8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerBrand: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      minWidth: 0
    },
    brandIcon: {
      width: '28px',
      height: '28px',
      backgroundColor: '#081c2b',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    brandTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#081c2b',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    brandSubtitle: {
      fontSize: '10px',
      color: '#6b7280',
      display: 'none'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      flexShrink: 0
    },
    roleToggle: {
      display: 'flex',
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      padding: '2px'
    },
    roleButton: (isActive) => ({
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '10px',
      fontWeight: 500,
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      backgroundColor: isActive ? '#081c2b' : 'transparent',
      color: isActive ? '#ffffff' : '#6b7280',
      transition: 'all 0.2s'
    }),
    authStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    username: {
      fontSize: '12px',
      color: '#6b7280',
      display: 'none',
      maxWidth: '60px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    logoutButton: {
      padding: '6px 8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loginButton: {
      padding: '6px 12px',
      backgroundColor: '#081c2b',
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '10px',
      fontWeight: 500,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      whiteSpace: 'nowrap',
      border: 'none',
      cursor: 'pointer'
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 16px'
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      textAlign: 'center',
      padding: '0 16px'
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      backgroundColor: '#081c2b',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '12px'
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#081c2b',
      marginBottom: '8px'
    },
    emptySubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      maxWidth: '448px',
      marginBottom: '16px'
    },
    questionsGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      justifyContent: 'center',
      maxWidth: '672px'
    },
    questionButton: {
      padding: '6px 12px',
      backgroundColor: '#f3f4f6',
      border: 'none',
      borderRadius: '8px',
      fontSize: '11px',
      color: '#374151',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    guestNote: {
      fontSize: '12px',
      color: '#9ca3af',
      marginTop: '16px'
    },
    messagesList: {
      maxWidth: '768px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '0 4px'
    },
    messageWrapper: (type) => ({
      display: 'flex',
      justifyContent: type === 'user' ? 'flex-end' : 'flex-start'
    }),
    messageBubble: (type) => ({
      maxWidth: '90%',
      borderRadius: '8px',
      padding: '8px 12px',
      backgroundColor: type === 'user' ? '#081c2b' : type === 'system' ? '#f3f4f6' : '#ffffff',
      color: type === 'user' ? '#ffffff' : type === 'system' ? '#6b7280' : '#1f2937',
      border: type === 'system' ? 'none' : type === 'user' ? 'none' : '1px solid #e5e7eb',
      fontStyle: type === 'system' ? 'italic' : 'normal',
      fontSize: type === 'system' ? '12px' : '14px',
      wordBreak: 'break-word'
    }),
    messageContent: {
      fontSize: '14px',
      lineHeight: '1.5'
    },
    sources: {
      marginTop: '8px',
      paddingTop: '8px',
      borderTop: '1px solid #e5e7eb'
    },
    sourcesText: {
      fontSize: '10px',
      color: '#6b7280'
    },
    loadingDots: {
      display: 'flex',
      justifyContent: 'flex-start'
    },
    loadingBubble: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '8px 16px'
    },
    dotContainer: {
      display: 'flex',
      gap: '4px'
    },
    dot: (delay) => ({
      width: '8px',
      height: '8px',
      backgroundColor: '#9ca3af',
      borderRadius: '50%',
      animation: 'bounce 1.4s infinite ease-in-out',
      animationDelay: delay
    }),
    inputArea: {
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      padding: '8px 12px',
      flexShrink: 0
    },
    inputContainer: {
      maxWidth: '768px',
      margin: '0 auto',
      display: 'flex',
      gap: '8px'
    },
    newChatButton: {
      padding: '6px 8px',
      background: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#6b7280',
      alignSelf: 'flex-end',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    textareaWrapper: {
      flex: 1,
      position: 'relative',
      minWidth: 0
    },
    textarea: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      resize: 'none',
      minHeight: '42px',
      maxHeight: '120px',
      fontFamily: 'inherit'
    },
    sendButton: (disabled) => ({
      padding: '8px 12px',
      borderRadius: '8px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      backgroundColor: disabled ? '#081c2b' : '#081c2b',
      color: disabled ? '#9ca3af' : '#ffffff',
      opacity: disabled ? 0.6 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'opacity 0.2s'
    }),
    footer: {
      maxWidth: '768px',
      margin: '4px auto 0',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '10px',
      color: '#9ca3af',
      padding: '0 4px'
    }
  };

  // Inject keyframe animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      
      @media (min-width: 480px) {
        .brand-subtitle { display: block !important; }
        .username-desktop { display: inline !important; }
        .role-label-full { display: inline !important; }
        .role-label-short { display: none !important; }
        .login-label-full { display: inline !important; }
        .login-label-short { display: none !important; }
        .header-padding { padding: 12px 16px !important; }
        .message-bubble { max-width: 80% !important; }
        .empty-icon-size { width: 80px !important; height: 80px !important; }
        .empty-icon-svg { width: 32px !important; height: 32px !important; }
        .empty-title-size { font-size: 24px !important; }
        .message-text-size { font-size: 15px !important; }
        .input-padding { padding: 12px 16px !important; }
        .send-padding { padding: 12px 16px !important; }
        .footer-text { font-size: 12px !important; }
        .guest-note-margin { margin-top: 24px !important; }
        .questions-gap { gap: 8px !important; }
        .question-text { font-size: 13px !important; }
        .question-padding { padding: 8px 12px !important; }
        .messages-padding { padding: 16px !important; }
        .header-title { font-size: 18px !important; }
        .header-subtitle { font-size: 12px !important; }
        .role-text { font-size: 12px !important; }
        .role-padding { padding: 4px 12px !important; }
        .login-text { font-size: 12px !important; }
        .login-padding { padding: 8px 16px !important; }
        .messages-gap { gap: 16px !important; }
        .message-padding { padding: 12px 16px !important; }
        .message-bubble-padding { padding: 8px 16px !important; }
        .input-gap { gap: 12px !important; }
        .dot-size { width: 10px !important; height: 10px !important; }
        .brand-icon-size { width: 32px !important; height: 32px !important; }
        .brand-icon-svg { width: 18px !important; height: 18px !important; }
        .menu-button-padding { padding: 8px !important; }
        .menu-icon-size { width: 24px !important; height: 24px !important; }
        .send-icon-size { width: 20px !important; height: 20px !important; }
        .new-chat-icon { width: 20px !important; height: 20px !important; }
        .input-text-size { font-size: 15px !important; }
        .input-min-height { min-height: 48px !important; }
        .role-icon-size { width: 14px !important; height: 14px !important; }
        .logout-icon-size { width: 20px !important; height: 20px !important; }
        .auth-gap { gap: 8px !important; }
        .username-max { max-width: 100px !important; }
        .username-text { font-size: 14px !important; }
      }
      
      @media (max-width: 479px) {
        .brand-subtitle { display: none !important; }
        .username-desktop { display: none !important; }
        .role-label-full { display: none !important; }
        .role-label-short { display: inline !important; }
        .login-label-full { display: none !important; }
        .login-label-short { display: inline !important; }
        .header-padding { padding: 8px 12px !important; }
        .message-bubble { max-width: 90% !important; }
        .empty-icon-size { width: 64px !important; height: 64px !important; }
        .empty-icon-svg { width: 28px !important; height: 28px !important; }
        .empty-title-size { font-size: 20px !important; }
        .message-text-size { font-size: 14px !important; }
        .input-padding { padding: 8px 12px !important; }
        .send-padding { padding: 8px 12px !important; }
        .footer-text { font-size: 10px !important; }
        .guest-note-margin { margin-top: 16px !important; }
        .questions-gap { gap: 6px !important; }
        .question-text { font-size: 11px !important; }
        .question-padding { padding: 6px 12px !important; }
        .messages-padding { padding: 8px !important; }
        .header-title { font-size: 16px !important; }
        .header-subtitle { font-size: 10px !important; }
        .role-text { font-size: 10px !important; }
        .role-padding { padding: 4px 8px !important; }
        .login-text { font-size: 10px !important; }
        .login-padding { padding: 6px 12px !important; }
        .messages-gap { gap: 12px !important; }
        .message-padding { padding: 6px 12px !important; }
        .message-bubble-padding { padding: 8px 12px !important; }
        .input-gap { gap: 8px !important; }
        .dot-size { width: 8px !important; height: 8px !important; }
        .brand-icon-size { width: 28px !important; height: 28px !important; }
        .brand-icon-svg { width: 16px !important; height: 16px !important; }
        .menu-button-padding { padding: 6px 8px !important; }
        .menu-icon-size { width: 20px !important; height: 20px !important; }
        .send-icon-size { width: 18px !important; height: 18px !important; }
        .new-chat-icon { width: 18px !important; height: 18px !important; }
        .input-text-size { font-size: 14px !important; }
        .input-min-height { min-height: 42px !important; }
        .role-icon-size { width: 12px !important; height: 12px !important; }
        .logout-icon-size { width: 16px !important; height: 16px !important; }
        .auth-gap { gap: 4px !important; }
        .username-max { max-width: 60px !important; }
        .username-text { font-size: 12px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      <ChatSidebar />

      <div style={styles.mainArea}>
        {/* Header */}
        <header className="header-padding" style={styles.header}>
          <div style={styles.headerLeft}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-button-padding"
              style={styles.menuButton}
            >
              <Menu className="menu-icon-size" size={20} />
            </button>
            <div style={styles.headerBrand}>
              <div className="brand-icon-size" style={styles.brandIcon}>
                <Sparkles className="brand-icon-svg" size={16} style={{ color: '#c9a84c' }} />
              </div>
              <div>
                <h1 className="header-title" style={styles.brandTitle}>SheriaAI Chat</h1>
                <p className="brand-subtitle header-subtitle" style={styles.brandSubtitle}>
                  {role === 'employee' ? 'Employee Mode' : 'Employer Mode'}
                </p>
              </div>
            </div>
          </div>

          <div className="auth-gap" style={styles.headerRight}>
            {/* Role Toggle */}
            <div style={styles.roleToggle}>
              <button
                onClick={() => handleRoleChange('employee')}
                className="role-padding role-text"
                style={styles.roleButton(role === 'employee')}
              >
                <User className="role-icon-size" size={12} />
                <span className="role-label-full">Employee</span>
                <span className="role-label-short">Emp</span>
              </button>
              <button
                onClick={() => handleRoleChange('employer')}
                className="role-padding role-text"
                style={styles.roleButton(role === 'employer')}
              >
                <Briefcase className="role-icon-size" size={12} />
                <span className="role-label-full">Employer</span>
                <span className="role-label-short">Emp</span>
              </button>
            </div>

            {/* Auth Status */}
            {isAuthenticated ? (
              <div className="auth-gap" style={styles.authStatus}>
                <span className="username-desktop username-text username-max" style={styles.username}>
                  {user?.first_name || user?.username}
                </span>
                <button
                  onClick={logout}
                  className="logout-icon-size"
                  style={styles.logoutButton}
                  title="Logout"
                >
                  <LogOut className="logout-icon-size" size={16} />
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="login-padding login-text"
                style={styles.loginButton}
              >
                <LogIn size={14} />
                <span className="login-label-full">Sign In</span>
                <span className="login-label-short">Login</span>
              </a>
            )}
          </div>
        </header>

        {/* Messages Area */}
        <div className="messages-padding" style={styles.messagesArea}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <div className="empty-icon-size" style={styles.emptyIcon}>
                <Sparkles className="empty-icon-svg" size={28} style={{ color: '#c9a84c' }} />
              </div>
              <h2 className="empty-title-size" style={styles.emptyTitle}>
                Kenya Employment Act Assistant
              </h2>
              <p style={styles.emptySubtitle}>
                Ask me anything about the Employment Act 2007 (Chapter 226)
              </p>
              <div className="questions-gap" style={styles.questionsGrid}>
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="question-padding question-text"
                    style={styles.questionButton}
                    onClick={() => {
                      setInput(question);
                      setTimeout(handleSend, 100);
                    }}
                  >
                    {question}
                  </button>
                ))}
              </div>
              {!isAuthenticated && (
                <p className="guest-note-margin" style={styles.guestNote}>
                  ✨ Sign in to save your chat history
                </p>
              )}
            </div>
          ) : (
            <div className="messages-gap" style={styles.messagesList}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={styles.messageWrapper(message.type)}
                >
                  <div
                    className="message-bubble message-bubble-padding message-text-size"
                    style={styles.messageBubble(message.type)}
                  >
                    {message.type === 'system' ? (
                      <div style={{ textAlign: 'center' }}>{message.content}</div>
                    ) : (
                      <div style={styles.messageContent}>
                        {message.content.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < message.content.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                        {message.sources && (
                          <div style={styles.sources}>
                            <p style={styles.sourcesText}>Sources: {message.sources.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={styles.loadingDots}>
                  <div style={styles.loadingBubble}>
                    <div className="dot-size" style={styles.dotContainer}>
                      <div style={styles.dot('0ms')}></div>
                      <div style={styles.dot('150ms')}></div>
                      <div style={styles.dot('300ms')}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-padding" style={styles.inputArea}>
          <div className="input-gap" style={styles.inputContainer}>
            <button
              onClick={handleNewChat}
              className="new-chat-icon"
              style={styles.newChatButton}
              title="New Chat"
            >
              <Sparkles className="new-chat-icon" size={18} />
            </button>
            <div style={styles.textareaWrapper}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about the Employment Act..."
                className="input-text-size input-min-height"
                style={styles.textarea}
                rows={1}
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="send-padding send-icon-size"
              style={styles.sendButton(!input.trim() || loading)}
            >
              <Send className="send-icon-size" size={18} />
            </button>
          </div>
          <div className="footer-text" style={styles.footer}>
            <span>Powered by SheriaAI</span>
            <span>{isAuthenticated ? '💾 Saved' : '🔒 Sign in to save'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;