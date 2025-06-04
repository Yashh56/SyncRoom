import { Loader } from 'lucide-react'
import React from 'react'

const AnimatedLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <Loader className="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
        </div>
    )
}

export default AnimatedLoader