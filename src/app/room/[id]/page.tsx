/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client'

import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import RoomHeader from '@/components/room/room-header'
import Link from 'next/link'
import { Loader2, RefreshCw, AlertCircle, MessageCircle, BookOpen, Users, Calendar, Settings, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import AnimatedLoader from '@/components/loader'
import { localURL } from '@/lib/url'

interface Chat {
  id: string
  name?: string
  isActive?: boolean
}

interface RoomDetails {
  id: string
  name: string
  description: string
  members: Array<{
    id: string
    userId: string
    role: 'ADMIN' | 'MODERATOR' | 'MEMBER'
    user?: {
      name: string
      avatar?: string
    }
  }>
  createdAt: string
  inviteCode: string
  banner?: string
  Chat: Chat[]
}

interface ApiResponse {
  status: 'success' | 'error'
  data: RoomDetails
  message?: string
}

const RoomPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const maxRetries = 3
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || localURL

  const getRoomDetails = useCallback(async (showToast = false) => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      if (showToast) {
        toast.loading('Refreshing room details...', { id: 'refresh-room' })
      }

      const res = await axios.get<ApiResponse>(`${baseApiUrl}/room/details/${id}`, {
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      })

      if (res.data.status === 'success' && res.data.data) {
        setRoomDetails(res.data.data)
        setRetryCount(0)
        document.title = `${res.data.data.name}`
        if (showToast) {
          toast.success('Room details refreshed!', { id: 'refresh-room' })
        }
      } else {
        throw new Error(res.data.message || 'Failed to fetch room details')
      }
    } catch (error) {
      console.error('Failed to fetch room details:', error)

      const errorMessage = 'Failed to load room details'

      setError(errorMessage)

      if (showToast) {
        toast.error(errorMessage, { id: 'refresh-room' })
      }

      // Auto-retry logic
      if (retryCount < maxRetries && !showToast) {
        setRetryCount(prev => prev + 1)
        setTimeout(() => getRoomDetails(), 2000 * (retryCount + 1))
      }

      // Handle specific error cases
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError('Room not found. It may have been deleted or you may not have access.')
      } else if (axios.isAxiosError(error) && error.response?.status === 403) {
        setError('You do not have permission to access this room.')
      }
    } finally {
      setLoading(false)
    }
  }, [id, baseApiUrl, retryCount])

  const handleSettingsClick = useCallback(() => {
    router.push(`/${id}/settings`)
  }, [id, router])

  const handleShareClick = useCallback(() => {
    if (!roomDetails) return

    if (navigator.share) {
      navigator.share({
        title: roomDetails.name,
        text: `Join ${roomDetails.name} on our platform!`,
        url: window.location.href,
      }).catch(() => {
        // Fallback to clipboard
        copyRoomLink()
      })
    } else {
      copyRoomLink()
    }
  }, [roomDetails])

  const copyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Room link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy room link'))
  }

  const handleRetry = () => {
    setRetryCount(0)
    getRoomDetails()
  }

  const handleRefresh = () => {
    getRoomDetails(true)
  }

  const handleBack = () => {
    router.back()
  }

  useEffect(() => {
    getRoomDetails()
  }, [getRoomDetails])

  // Loading state
  if (loading && !roomDetails) {
    return (
      <AnimatedLoader />
    )
  }

  // Error state
  if (error && !roomDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full space-y-6 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Unable to Load Room
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {error}
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  // No room data
  if (!roomDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] w-full space-y-6 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Room Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This room may have been deleted or you may not have access to it.
          </p>
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    )
  }

  const activeChat = roomDetails.Chat?.[0]
  const hasActiveChat = activeChat?.id

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 dark:bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Room Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <RoomHeader
            roomDetails={roomDetails}
            onSettingsClick={handleSettingsClick}
            onShareClick={handleShareClick}
          />
        </div>
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="sm"
          className="ml-4"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Room Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {/* Chat Card */}
        {hasActiveChat ? (
          <Link href={`/${id}/chat/${activeChat.id}`} className="group">
            <div className="relative backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/20 dark:border-white/10 rounded-2xl h-56 p-6 flex flex-col justify-center items-center shadow-xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:from-blue-500/30 group-hover:to-purple-600/30">
              <MessageCircle className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Join Chat</h3>
              <p className="text-sm text-white/80 text-center mb-4">
                Connect with {roomDetails.members?.length || 0} members in real-time
              </p>
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-pulse">
                LIVE
              </div>
            </div>
          </Link>
        ) : (
          <div className="relative backdrop-blur-lg bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-white/20 dark:border-white/10 rounded-2xl h-56 p-6 flex flex-col justify-center items-center shadow-xl opacity-60">
            <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Chat Unavailable</h3>
            <p className="text-sm text-white/80 text-center">
              No active chat sessions available
            </p>
          </div>
        )}

        {/* Materials Card */}
        <Link href={`/${id}/materials`}
          // onClick={() => toast.info("Materials section coming soon! 📚", {
          //   description: "We're working on adding file sharing and resource management."
          // })}
          className="relative backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-white/20 dark:border-white/10 rounded-2xl h-56 p-6 flex flex-col justify-center items-center shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:from-green-500/30 hover:to-emerald-600/30 cursor-pointer group"
        >
          <BookOpen className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-semibold text-white mb-2">Materials</h3>
          <p className="text-sm text-white/80 text-center mb-4">
            Notes, slides & shared resources
          </p>
          {/* <div className="absolute bottom-3 right-4 bg-yellow-500/80 text-white text-xs px-2 py-1 rounded-full">
            Coming Soon
          </div> */}
        </Link>

        {/* Members Card */}
        <Link href={`/${id}/members`} className="group">
          <div className="relative backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-white/20 dark:border-white/10 rounded-2xl h-56 p-6 flex flex-col justify-center items-center shadow-xl transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:from-purple-500/30 group-hover:to-pink-600/30">
            <Users className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Members</h3>
            <p className="text-sm text-white/80 text-center mb-4">
              View and manage room members
            </p>
            <div className="bg-purple-500/30 text-white text-sm px-3 py-1 rounded-full">
              {roomDetails.members?.length || 0} members
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
          <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold text-white">{roomDetails.members?.length || 0}</p>
          <p className="text-sm text-gray-400">Members</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
          <MessageCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-white">{hasActiveChat ? '1' : '0'}</p>
          <p className="text-sm text-gray-400">Active Chats</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-400" />
          <p className="text-2xl font-bold text-white">
            {Math.floor((Date.now() - new Date(roomDetails.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
          </p>
          <p className="text-sm text-gray-400">Days Active</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
          <BookOpen className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-sm text-gray-400">Resources</p>
        </div>
      </div>

      <div className="absolute top-20 right-8 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 rounded-full blur-2xl animate-pulse delay-700 pointer-events-none"></div>
      <div className="absolute bottom-40 left-12 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000 pointer-events-none"></div>

    </div>
  )
}

export default RoomPage