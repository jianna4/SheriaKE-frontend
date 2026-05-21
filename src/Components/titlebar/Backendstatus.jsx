export default function Backend({backendStatus}){
    return(
        <div className="flex items-center gap-2

        ">

                    {/* Backend Status Indicator */}

                    {/* the text */}
                    <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                        backendStatus === 'connected'  /* if backendstatus == connected then bg-green-100*/
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'

                        : backendStatus === 'disconnected' /* else if backendstatus == disconnected then bg-red-100 */
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'

                        /* else then bg-yellow-100  */
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }
                    
                         
                    `}> 
                    {/* the icon or circle */}
                        <div className={`w-1.5 h-1.5 rounded-full ${
                        backendStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                        }`} />
                        {backendStatus === 'connected' ? 'Connected' : backendStatus === 'disconnected' ? 'Disconnected' : 'Connecting...'}
                    </div>
                </div>
    )


}