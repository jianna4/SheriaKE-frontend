import { HelpCircle } from 'lucide-react'

export default function NavItem ({ suggestedQuestions, isOpen, setInput }) {

  return(
    <div className=" h-full  p-3 cursor-pointer bg-slate-800 rounded-lg transition-colors ">

      <div className={`flex flex-col flex-wrap gap-1.5 w-full h-full overflow-y-auto text-slate-100 whitespace-nowrap transition-all duration-300 ${
        isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
      }`}>
        {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInput(q)}
              className="shrink-0 w-full p-2 text-sm text-wrap flex items-center justify-start bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all shadow-sm hover:shadow-md"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              {q}
            </button>
          ))}
      </div>
    </div>
  )
}
