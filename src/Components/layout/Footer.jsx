import { Scale } from 'lucide-react'

export default function Footer (){
return(
    <footer className=" bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className=" p-2
            max-sm:p-1
        ">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3 flex items-center justify-center gap-1
                max-sm:text-[11px]
            
            ">
            <Scale className="w-3 h-3
            max-sm:w-2 max-sm:h-2
            " />
            Powered by the Kenya Employment Act 2007 (Chapter 226)
            
          </p>
        </div>
    </footer>
)}