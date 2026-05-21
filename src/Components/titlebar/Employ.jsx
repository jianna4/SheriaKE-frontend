import { Users, Briefcase} from 'lucide-react'

/* 
  setRole function

*/


export default function Employ ({ setRole, role }){
    return(
        <div className="flex gap-2
            max-sm:gap-1  max-sm:max-w-full
        
        ">
              <button
                      onClick={() => setRole('employee')}
                      className={` h-8 flex-1 flex items-center justify-center gap-2 px-2.5 py-2.5 rounded-xl font-medium transition-all ${
                          role === 'employee'
                          ? 'bg-slate-800 text-teal-300 shadow-lg shadow-green-200 dark:shadow-none'
                          : 'bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                      
                      max-sm:h-8 max-sm:gap-1 max-sm:px-2 max-sm:text-sm
                      
                      `}
              >
                <Users className="w-4 h-4 shrink-0 
                
                  max-sm:w-3.5 max-sm:h-3.5" />
                <span>Employee</span>
              </button>

              <button
                onClick={() => setRole('employer')}
                className={` h-8 flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  role === 'employer'
                    ? 'bg-slate-800 text-teal-300 shadow-lg shadow-red-200 dark:shadow-none'
                    : 'bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
                    max-sm:h-8 max-sm:gap-1 max-sm:px-2 max-sm:text-sm
                `}
              >
                <Briefcase className="w-4 h-4  
                
                  shrink-0 max-sm:w-3.5 max-sm:h-3.5" />
                <span>Employer</span>
              </button>
            </div>
    )

}