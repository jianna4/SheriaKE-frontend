import { User, Bot, BookOpen, Loader2, Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown';

export default function Chatdata({ messages, messagesEndRef, deleteChatById, loading }) {
  // 1. Calculate how many system messages exist right now
  
  return (
    <div className="chat-scroll-container flex-1 overflow-y-auto 
    min-h-0 w-full max-w-4xl mx-auto px-4 space-y-8 py-6 custom-scrollbar
    
    max-md:p-4
    max-sm:p-1  max-sm:text-sm max-sm:w-full
    ">


      {messages.map((message) => (
        <div
          key={message.id}
          className={`animate-slide-up flex w-full ${
            message.type === 'user' 
              ? 'justify-end' 
              : message.type === 'system'
              ? 'justify-center'
              : 'justify-start'
          }`}
        >
          {message.type === 'system' ? (
            /* System Event Message Bubble */
            <div className="px-4 py-1.5 bg-slate-800  border border-gray-200/40  rounded text-xs font-medium text-white shadow-2xs backdrop-blur-xs">    
            
              {message.content}
            </div>
          ) : (
            /* Main Interaction Box (User / Bot) */
            <div className={`flex gap-4 w-full group relative ${
              message.type === 'user' ? 'flex-row-reverse max-w-[85%]' : 'flex-row'
            }
            
            max-sm:gap-2
            
            `}>
              
              {/* Profile Avatar Frame */}
              <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border shadow-3xs transition-transform duration-200 

              max-sm:hidden
              ${
                 
                message.type === 'user'
                  ? 'bg-linear-to-br from-emerald-500 to-teal-600 border-emerald-400/20 text-white'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}>
                {message.type === 'user' 
                  ? <User className="w-3.5 h-3.5" /> 
                  : <Bot className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                }
              </div>

              {/* Message Structure & Controls */}
              <div className={`flex flex-col gap-1 w-full 
              
              max-sm:w-full
              
              ${
                message.type === 'user' ? 'items-end' : 'items-start'
              }`}>
                
                {/* Text Bubble Container */}
                <div className={`w-full p-2  transition-all duration-200 
                 rounded-xl shadow-md shadow-slate-200/50 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 
                max-sm:py-0 max-sm:text-wrap
                ${
                  message.type === 'user'
                    ? 'bg-white text-slate-900 border border-slate-200/80 '
                    : 'bg-white text-slate-900 border border-slate-200/80 '
                }`}>
                  
                  {/* Markdown Presentation Layer green*/}
                  <div className="  rounded prose prose-sm dark:prose-invert max-w-none wrap-break-word text-sm leading-relaxed tracking-normal
                  max-sm:text-xm
                  ">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="text-base font-bold mb-2 text-gray-900 tracking-tight">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-sm font-semibold mb-2 mt-4 text-gray-900 ">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xs font-semibold mb-1 mt-3 text-gray-800 ">{children}</h3>,
                        p: ({ children }) => <p className="mb-2 last:mb-0 text-gray-700">{children}</p>,
                        strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 text-gray-700 ">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 text-gray-700">{children}</ol>,
                        li: ({ children }) => <li className="text-sm pl-0.5">{children}</li>,
                        code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-800/80 px-1.5 py-0.5 rounded font-mono text-xs text-rose-600 dark:text-rose-400 border border-gray-200/30 dark:border-gray-700/30">{children}</code>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>

                  {/* Contextual Reference Sources Panel */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800/80">
                      <div className="text-[11px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                        <span>Sources: {message.sources.map(s => s.section).filter(s => s !== 'Unknown').join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Micro-Interaction Bar (Reveals on item hover) */}
                <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-150${
                  message.type === 'user' ? '-left-10' : '-right-10'
                }`}>
                  <button
                    onClick={() => deleteChatById(message.id)}
                    className="p-1.5 rounded-md hover:text-orange-900 hover:bg-orange-200 border border-transparent hover:border-gray-200/40 dark:hover:border-gray-700/40 transition-all duration-150"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      ))}

      {/* Modern Loader State */}
      {loading && (
        <div className="flex justify-start animate-slide-up gap-4 w-full max-w-[90%]">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-3xs">
            <Bot className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 animate-pulse" />
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-3 shadow-2xs flex items-center">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-500 dark:text-emerald-400" />
          </div>
        </div>
      )}

    <div ref={messagesEndRef} className="h-2 w-full shrink-0" />
    </div>
    
  );
}