import { SendHorizontal, HelpCircle } from 'lucide-react'

export default function Textbox({ suggestedQuestions, setInput, sendMessage, inputRef, input, loading  }){
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        sendMessage();
      }
    }
  };


    return(
  <div className="
      /* Desktop First Default Layout */
      w-full max-w-3xl mx-auto p-1.5
      
      /* Responsive Adaptations */
      max-sm:px-2 max-sm:pt-2
    ">
      <div className="w-full relative px-1 
      
      ">
      {/* 
        Horizontal Scroll View Container
        - Uses 'snap-x' for physical mobile gesture anchoring
        - 'no-scrollbar' utility removes the ugly desktop bars
      */}
      <div className="flex gap-3 overflow-x-auto w-full pb-3 pt-1 scrollbar-none snap-x snap-mandatory [-webkit-overflow-scrolling:touch]
      max-sm:hidden
      ">
        {/* Suggestions */}
        {suggestedQuestions.map((suggest, id) => (
          <button
            key={id}
            onClick={() => setInput(suggest)}
            className="group flex items-center gap-2 shrink-0 w-6 sm:w-65 p-1.5 text-left text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 hover:border-gray-300 dark:hover:border-gray-750 transition-all duration-200 cursor-pointer snap-start focus:outline-hidden focus:ring-1 focus:ring-emerald-500/50 shadow-3xs"
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" />
            <span className="line-clamp-2 leading-relaxed">
              {suggest}
            </span>
          </button>
        ))}
      </div>
    </div>

      <div className="
        flex gap-3 items-end p-2 bg-white dark:bg-gray-900 
        border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl
        focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500
        transition-all duration-200
        
        /* Responsive Adaptations */
        max-sm:gap-2 max-sm:p-1.5 max-sm:rounded-xl
      ">
        
        {/* 3. RELATIVE TEXTAREA FIELD HOLDER */}
        <div className="flex-1 min-w-0"> 
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here... Press Enter to send"
            rows="1"
            className="
              w-full bg-transparent text-gray-800 dark:text-gray-100 
              outline-none px-2 py-2 placeholder:text-gray-400 dark:placeholder:text-gray-600
              text-base resize-none leading-relaxed block
              
              /* Responsive Adaptations */
              max-sm:text-sm max-sm:px-1 max-sm:py-1.5
            "
            style={{ minHeight: '36px', maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
        </div>

        {/* 4. ACTION SUBMIT BUTTON */}
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="
            /* Desktop First Default Structure */
            p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl 
            disabled:bg-gray-100 dark:disabled:bg-gray-800 
            disabled:text-gray-400 dark:disabled:text-gray-600
            disabled:cursor-not-allowed transition-all duration-200 shrink-0
            
            /* Responsive Adaptations */
            max-sm:p-2 max-sm:rounded-lg
          "
        >
          <SendHorizontal size={18} className="max-sm:w-4 max-sm:h-4" />
        </button>

      </div>
    </div>
    )


}