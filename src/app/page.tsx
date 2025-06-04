/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import Header from "@/components/header"
import AnimatedLoader from "@/components/loader"
import JoinedRooms from "@/components/room/joined-rooms"
import SuggestedRooms from "@/components/room/suggested-rooms"
import Sidebar from "@/components/Sidebar"
import { useAuthStore } from "@/store/useAuthStore"
import { useFavouriteRoomStore } from "@/store/useFavouriteRoomStore"
import { motion } from "framer-motion"
import { Users, Star, Sparkles, TrendingUp, Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isInitialized && user === null) {
      router.replace("/landing");
    }
  }, [isInitialized, user]);


  if (!isInitialized) return null // or loading spinner
  if (!user) return null

  if (isLoading) {
    return (
      <AnimatedLoader />
    )
  }
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 dark:bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Enhanced Sidebar */}
      {/* {favouriteRooms.length > 0 && (
        <motion.aside 
          className="hidden md:block w-20 border-r border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-lg"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="relative h-full">
            <Sidebar />
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent dark:from-violet-500/10 pointer-events-none"></div>
          </div>
        </motion.aside>
      )} */}

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Enhanced Header */}
        <motion.header
          className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Header />
          {/* Header gradient accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent"></div>
        </motion.header>

        {/* Enhanced Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="relative">
            {/* Content Container */}
            <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
              {/* Welcome Section */}
              {user && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                          Welcome back, {user.name}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Discover and join conversations that matter to you
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Joined Rooms Section */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Your Rooms</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rooms you&lsquo;ve joined and are active in</p>
                  </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <JoinedRooms />
                </div>
              </motion.section>

              {/* Enhanced Separator */}
              <motion.div
                className="flex items-center gap-4 my-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500/20 to-purple-500/20 dark:from-violet-500/30 dark:to-purple-500/30 rounded-full flex items-center justify-center border border-violet-200 dark:border-violet-800">
                  <Star className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
              </motion.div>

              {/* Suggested Rooms Section */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Discover Rooms</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Popular and trending rooms you might like</p>
                  </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <SuggestedRooms />
                </div>
              </motion.section>

              {/* Bottom spacing */}
              <div className="h-8"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 right-8 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 rounded-full blur-2xl animate-pulse delay-700 pointer-events-none"></div>
            <div className="absolute bottom-40 left-12 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000 pointer-events-none"></div>
          </div>
        </main>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: rgb(209 213 219);
          border-radius: 3px;
        }
        
        .dark .scrollbar-thumb-gray-700::-webkit-scrollbar-thumb {
          background-color: rgb(55 65 81);
          border-radius: 3px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgb(156 163 175);
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgb(75 85 99);
        }
      `}</style>
    </div>
  )
}