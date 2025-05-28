/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import axios from 'axios'
import Link from 'next/link'
import { useRoomStore } from '@/store/useRoomStore'
import { motion } from 'framer-motion'
import { Users, MessageCircle, Crown, Sparkles } from 'lucide-react'

const JoinedRooms = () => {
  interface Room {
    id: number
    name: string
    description: string
    banner: string
    totalMembers: number
    onlineMembers: number
  }

  const [joinedRooms, setJoinedRooms] = React.useState<Room[]>([])
  const [loading, setLoading] = React.useState(true)
  const members = useRoomStore((state) => state.members)

  const roomsFromDB = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:5000/room/joined', {
        withCredentials: true,
      })
      if (res.data.status === 'success') {
        setJoinedRooms(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch joined rooms', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    roomsFromDB()
  }, [])

  const getGradientForRoom = (index: number) => {
    const gradients = [
      'from-violet-500 to-purple-600',
      'from-blue-500 to-cyan-500',
      'from-emerald-500 to-teal-500',
      'from-pink-500 to-rose-500',
      'from-orange-500 to-amber-500',
      'from-indigo-500 to-blue-600'
    ]
    return gradients[index % gradients.length]
  }

  const getOnlineStatus = (onlineMembers: number, totalMembers: number) => {
    const percentage = (onlineMembers / totalMembers) * 100
    if (percentage >= 70) return { color: 'text-emerald-500', dot: '🟢' }
    if (percentage >= 40) return { color: 'text-yellow-500', dot: '🟡' }
    return { color: 'text-gray-500', dot: '⚪' }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <motion.div
            key={index}
            className="group relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/10 rounded-2xl animate-pulse"></div>
              
              <div className="relative flex items-center gap-4">
                {/* Avatar skeleton */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
                </div>
                
                {/* Content skeleton */}
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="w-32 h-5 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                  <div className="w-48 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (joinedRooms.length === 0) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/30 dark:border-gray-700/30 shadow-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-purple-500/20 dark:from-violet-500/30 dark:to-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">No rooms joined yet</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Start by joining some rooms to see them here</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {joinedRooms.map((room, index) => {
        const onlineStatus = getOnlineStatus(room.onlineMembers, room.totalMembers)
        
        return (
          <motion.div
            key={room.id}
            className="group relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <Link href={`/room/${room.id}`} className="block">
              <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 group-hover:border-violet-300/50 dark:group-hover:border-violet-600/50">
                
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-purple-500/0 dark:from-violet-500/0 dark:via-violet-500/10 dark:to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                
                {/* Floating accent */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                
                <div className="relative flex items-center gap-4">
                  {/* Enhanced Avatar */}
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradientForRoom(index)} rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                    <Avatar className="relative w-14 h-14 rounded-2xl border-2 border-white/20 dark:border-gray-700/30 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <AvatarImage src={room.banner} alt={room.name} className="rounded-2xl" />
                      <AvatarFallback className={`bg-gradient-to-br ${getGradientForRoom(index)} text-white font-semibold text-lg rounded-2xl`}>
                        {room.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online indicator */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                      <div className={`w-3 h-3 rounded-full ${room.onlineMembers > 0 ? 'bg-emerald-500' : 'bg-gray-400'} ${room.onlineMembers > 0 ? 'animate-pulse' : ''}`}></div>
                    </div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-300 truncate">
                        {room.name}
                      </h3>
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {onlineStatus.dot}
                        </span>
                        <span className={`text-xs font-semibold ${onlineStatus.color}`}>
                          {room.onlineMembers}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          /{room.totalMembers}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {room.description || 'No description available'}
                    </p>
                    
                    {/* Enhanced Stats */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <Users className="w-3 h-3" />
                        <span className="font-medium">{room.totalMembers} members</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <MessageCircle className="w-3 h-3" />
                        <span className="font-medium">Active</span>
                      </div>
                      {room.onlineMembers > room.totalMembers * 0.7 && (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="w-3 h-3" />
                          <span className="font-medium">Hot</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}

export default JoinedRooms