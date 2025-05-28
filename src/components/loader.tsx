import { Loader } from 'lucide-react'
import React from 'react'

const AnimatedLoader = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
            <Loader className="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
        </div>
    )
}

export default AnimatedLoader