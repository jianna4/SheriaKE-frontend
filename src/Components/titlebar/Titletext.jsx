import { Scale, Sparkles } from 'lucide-react'

export default function Titletext(){
    return(
        <div className="flex items-center gap-3
            max-md:gap-2 max-sm:items-start
        ">
                    {/* Items starts */}
                    <div className=" p-2.5 bg-slate-800 text-gray-50 rounded-xl shadow-lg">
                        <Scale className="w-6 h-6 text-teal-500
                            max-md:w-5 max-md:h-5
                            max-sm:w-7 max-sm:h-7

                        " />
                    </div>

                    <div className="min-w-0  
                        max-sm:hidden
                    ">
                        <h1 className="text-base font-bold bg-clip-text text-gray-50
                            max-md:text-[10px] max-md:leading-tight
                            max-sm:text-xs max-sm:leading-tight
                        ">
                            Kenya Employment Act 2007
                        </h1>
                        <p className="text-xs text-gray-100 flex items-center gap-1
                            max-sm:text-[10px] max-sm:flex-wrap
                        ">
                            <Sparkles className="w-3 h-3" />
                            Know Your Rights • Fahamu Haki Zako
                    </p>
                    </div>

                </div>


    )

}