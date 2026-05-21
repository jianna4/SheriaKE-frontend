import Backend from './Backendstatus';
import Employ from './Employ'
import Titletext from './Titletext';

/* Functions in this area
    >  Backend Indicator signal  ln44 - ln50
    >  Switch dark  or light mode ln61 - ln67

    >  Props needed : setDarkMode, backendStatus
    > Add latter { setDarkMode, darkMode}


    > change size of the employ buttons.
*/

export default function Titlebar ({  backendStatus, setRole, role  }){
    return(

<>
        {/* Header */}
    <header className="sticky top-0 z-10 bg-gray-900 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="mx-auto p-3

        max-md:w-full
        max-sm:p-2 max-sm:w-full 

        ">
            <div className="flex items-center justify-between 
             
            ">
                <div>
                    <Titletext />
                </div>
                <div className=" flex gap-3
                    max-sm:gap-2
                ">
                    <Backend  backendStatus={backendStatus}/>
                    <Employ  setRole={setRole} role={role} />
                </div>
                    
            </div>
        </div>
    </header>
</>
    )
}