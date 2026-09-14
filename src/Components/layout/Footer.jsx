import { Scale } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="p-2 max-sm:p-1">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3 flex items-center justify-center gap-1 max-sm:text-[11px]">
          <Scale className="w-3 h-3 max-sm:w-2 max-sm:h-2" />
          Powered by the Employment Act 2007, Marriage Act 2014 &amp; Matrimonial Property Act 2013
        </p>
        <p className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-1 mb-2 max-sm:text-[9px]">
          SheriaAI provides legal information, not legal advice. For advice on your specific situation, consult a qualified advocate.
        </p>
      </div>
    </footer>
  )
}