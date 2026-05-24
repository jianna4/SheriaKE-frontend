import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import Titlebar from '../Components/titlebar/Titlebar'
import Chatsection from '../Components/chatsection/Chatsection'



// ✅ Get backend URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('employee');
  const [darkMode, setDarkMode] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen,setIsOpen] = useState(false)

  // sugestions
    


  // Check backend health on startup
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.get('/legal/health');
        setBackendStatus('connected');
        console.log('Backend connected:');
      } catch (error) {
        console.error(' Backend connection failed:', error);
        setBackendStatus('disconnected');
      }
    };
    checkBackend();
  }, []);

  // Apply dark mode to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        type: 'bot',
        content: `## Welcome to the Kenya Employment Act Assistant!

I'm here to help you understand your rights and obligations under the **Employment Act 2007 (Chapter 226)**.

### Current Mode: **${role === 'employee' ? 'Employee Mode 👥' : 'Employer Mode 💼'}**

${role === 'employee' 
  ? `### 🔹 What I can help you with:
- **Leave entitlements** (annual, maternity, paternity, sick leave)
- **Termination & dismissal** rules
- **Discrimination** protections
- **Wage payment** regulations
- **Housing & medical** benefits
- How to **file complaints**

### 💡 Try asking:
- "How much annual leave am I entitled to?"
- "Can my employer terminate me without notice?"
- "What is the maternity leave policy?"`


  : `### 🔹 What I can help you with:
- **Contract requirements** (written contracts, particulars)
- **Record keeping** obligations
- **Proper termination** procedures
- **Legal deductions** from wages
- **Health & safety** requirements
- **Compliance & penalties**

### 💡 Try asking:
- "What records must I keep for employees?"
- "How do I properly terminate an employee?"
- "What are the requirements for a valid contract?"`

}

How can I assist you today?`,
        timestamp: new Date()
      }
    ]);
  }, []);

  // Update when role changes (add system message)
  useEffect(() => {
    if (messages.length > 0 && messages[0].id === 'welcome') {
      const systemMessage = {
        id: `system-${Date.now()}`,
        type: 'system',
        content: `🔄 Switched to **${role === 'employee' ? 'Employee Mode' : 'Employer Mode'}**`,
        timestamp: new Date()
      };
      setMessages(prev => [prev[0], systemMessage, ...prev.slice(1)]);
    }
  }, [role]);


  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    if (backendStatus !== 'connected') {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: ` **Backend not connected**

Please make sure:
1. The backend server is running
2. Your .env file has the correct backend URL 
3. The backend URL is accessible

Check the browser console for more details.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/legal/ask/', {
        query: input,
        role: role
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.data.answer,
        sources: response.data.sources,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      
      let errorContent = ` **Sorry, I encountered an error**\n\n`;
      
      if (error.response) {
        // Server responded with error
        errorContent += `**Status:** ${error.response.status}\n`;
        errorContent += `**Details:** ${error.response.data?.detail || error.message}\n\n`;
      } else if (error.request) {
        // No response received
        errorContent += `**Cannot reach backend server**\n\n`;

        errorContent += `Please verify:\n`;
        errorContent += `1. The backend is deployed and running\n`;
        errorContent += `2. Your backend URL is correct\n`;
        errorContent += `3. CORS is properly configured on the backend\n`;
      } else {
        errorContent += `**Error:** ${error.message}\n`;
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: errorContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };



  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

const deleteChatById = (idToDelete) => {
  setMessages((prevMessages) => 
    prevMessages.filter((message) => message.id !== idToDelete)
  );
};

const PopupMessage = messages.filter(m => m.type === "system")

useEffect(() => {

  const systemMessageCount = PopupMessage.filter(m => m.type === 'system').length;

  if (systemMessageCount <= 1) return;


  setMessages((prevMessages) => {
    // Double-check inside the batch to avoid race conditions
    if (prevMessages.length > 3) {
      // .slice(1) removes the first item at index 0 and returns the rest
      return prevMessages.filter(m => m.type !== 'system')
    }
    return prevMessages;
  });

}, [PopupMessage]);


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
  
        
        <div className='h-screen grid grid-rows-[60px_1fr_60px] '>
          {/* Header */}  
            <Titlebar  setDarkMode={setDarkMode} backendStatus={backendStatus} darkMode={darkMode}  setRole={setRole} role={role}
            />
            { /* Chatsection */}
            <Chatsection messages={messages} setRole={setRole} role={role} sendMessage={sendMessage}
              messagesEndRef={messagesEndRef} deleteChatById={deleteChatById} loading={loading} 
              setInput={setInput}  handleKeyPress={handleKeyPress}
              inputRef={inputRef} input={input} suggestedQuestions={suggestedQuestions}
              isOpen={isOpen} setIsOpen={setIsOpen}

            />
            


        </div>
        


  );
};

export default Chat;