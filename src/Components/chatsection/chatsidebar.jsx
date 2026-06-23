// src/Components/chatsection/chatsidebar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  MessageCircle, 
  Trash2, 
  ChevronLeft, 
  Edit2, 
  Check, 
  X, 
  Home,
  LogIn,
  Sparkles,
  Menu
} from 'lucide-react';
import { useChat } from '../contexts/chatcontext';
import { useAuth } from '../contexts/AuthContext';

const ChatSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    sessions, 
    currentSession, 
    loading, 
    sidebarOpen, 
    setSidebarOpen,
    loadSession,
    createNewSession,
    deleteSession,
    updateSessionTitle,
    isAuthenticated
  } = useChat();
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Ensure sessions is always an array
  const sessionsList = Array.isArray(sessions) ? sessions : [];

  const handleNewChat = async () => {
    if (isAuthenticated) {
      const session = await createNewSession();
      if (session) {
        navigate(`/chat/${session.id}`);
      }
    } else {
      navigate('/chat');
    }
    setSidebarOpen(false);
  };

  const handleSelectSession = (sessionId) => {
    loadSession(sessionId);
    navigate(`/chat/${sessionId}`);
    setSidebarOpen(false);
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat?')) {
      await deleteSession(sessionId);
      if (location.pathname === `/chat/${sessionId}`) {
        navigate('/chat');
      }
    }
  };

  const startEdit = (e, session) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title || 'New Chat');
  };

  const saveEdit = async (e) => {
    e.stopPropagation();
    if (editTitle.trim() && editingId) {
      await updateSessionTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit(e);
    } else if (e.key === 'Escape') {
      cancelEdit(e);
    }
  };

  const handleGoHome = () => {
    navigate('/');
    setSidebarOpen(false);
  };

  const handleGoLogin = () => {
    navigate('/login');
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed lg:relative z-50
          w-[320px] h-full
         bg-[#081c2b]/95
          text-white
          transition-all duration-300 ease-in-out
          shadow-2xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
          border-r border-black-700/50
        `}
      >
        {/* Header with gradient accent */}
        <div className="relative p-5 border-b border-black-700/50 bg-gradient-to-r from-black-800/50 to-transparent">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20 cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={handleGoHome}
              >
                <Sparkles size={20} className="text-black-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">
                  SheriaAI
                </h1>
                <p className="text-xs text-black-300 font-light tracking-wider">Legal Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-black-300 hover:text-white p-1.5 hover:bg-black-700/50 rounded-lg transition-all duration-200"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          
          {/* Decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500/50 via-gold-400/20 to-transparent"></div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 border-b border-black-700/50">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-black-300 hover:text-white hover:bg-black-700/50 rounded-xl transition-all duration-200 text-sm group"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Home</span>
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-black-700/50">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-black-900 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} className="font-bold" />
            New Chat
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212, 168, 67, 0.3) transparent' }}>
          {!isAuthenticated ? (
            <div className="text-center text-black-300 p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-black-700/50 rounded-2xl flex items-center justify-center">
                <MessageCircle size={32} className="text-black-400" />
              </div>
              <p className="text-sm font-medium text-black-200">Sign in to save chats</p>
              <p className="text-xs text-black-400 mt-1">Your conversations will be saved</p>
              <button
                onClick={handleGoLogin}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-black-900 rounded-xl text-sm font-semibold hover:from-gold-400 hover:to-gold-300 transition-all duration-200 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 flex items-center gap-2 mx-auto"
              >
                <LogIn size={16} />
                Sign In
              </button>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-10 h-10 border-3 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
            </div>
          ) : sessionsList.length === 0 ? (
            <div className="text-center text-black-300 p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-black-700/50 rounded-2xl flex items-center justify-center">
                <MessageCircle size={32} className="text-black-400" />
              </div>
              <p className="text-sm font-medium text-black-200">No chats yet</p>
              <p className="text-xs text-black-400 mt-1">Start a new conversation</p>
            </div>
          ) : (
            sessionsList.map((session) => (
              <div
                key={session.id}
                className={`
                  group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer
                  transition-all duration-200
                  ${currentSession?.id === session.id 
                    ? 'bg-gradient-to-r from-gold-500/20 to-gold-400/10 border border-gold-500/30 shadow-lg shadow-gold-500/10' 
                    : 'hover:bg-black-700/40 hover:scale-[1.02]'
                  }
                `}
                onClick={() => handleSelectSession(session.id)}
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${currentSession?.id === session.id 
                    ? 'bg-gold-500/20 text-gold-400' 
                    : 'bg-black-700/50 text-black-400 group-hover:text-black-300'
                  }
                `}>
                  <MessageCircle size={16} />
                </div>
                
                {editingId === session.id ? (
                  <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-black-800/80 text-white text-sm rounded-lg px-3 py-1.5 outline-none border-2 border-gold-500/50 focus:border-gold-400 transition-all duration-200"
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm truncate font-medium">
                      {session.title || 'New Chat'}
                    </span>
                    <span className="text-xs text-black-400 flex-shrink-0">
                      {new Date(session.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        onClick={(e) => startEdit(e, session)}
                        className="p-1.5 text-black-400 hover:text-white hover:bg-black-600/50 rounded-lg transition-all duration-200"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="p-1.5 text-black-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black-700/50 bg-gradient-to-t from-black-900 to-transparent">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-black-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse"></div>
              <span>Online</span>
            </div>
            <div className="text-black-400">
              {isAuthenticated ? (
                <span className="flex items-center gap-1.5">
                  <span className="text-green-400">●</span> Saved
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="text-yellow-400">●</span> Guest
                </span>
              )}
            </div>
          </div>
          <div className="mt-1 text-[10px] text-black-500 text-center font-light tracking-wider">
            {isAuthenticated ? '💾 All chats are saved securely' : '🔒 Sign in to save your chats'}
          </div>
        </div>
      </div>

      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`
          lg:hidden fixed top-4 left-4 z-30 
          bg-gradient-to-r from-black-800 to-black-700 
          text-white p-3 rounded-xl 
          shadow-2xl shadow-black-900/30 
          hover:from-black-700 hover:to-black-600 
          transition-all duration-200 
          hover:scale-105 active:scale-95
          border border-black-600/50
          ${sidebarOpen ? 'hidden' : 'flex items-center gap-2'}
        `}
      >
        <Menu size={20} />
        <span className="text-xs font-medium">Chat</span>
      </button>
    </>
  );
};

export default ChatSidebar;