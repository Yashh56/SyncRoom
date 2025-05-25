/* eslint-disable @next/next/no-img-element */
import { Clock, Copy, Share2, Star, Users, Settings, Crown } from 'lucide-react'
import React, { useState, useMemo } from 'react'
import { Button } from '../ui/button'
import { useFavouriteRoomStore } from '@/store/useFavouriteRoomStore'
import { useAuthStore } from '@/store/useAuthStore'

interface Member {
  id: string
  userId: string
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER'
  user?: {
    name: string
    avatar?: string
  }
}

interface RoomDetails {
  name: string
  id: string
  description: string
  members: Member[]
  createdAt: string
  inviteCode: string
  banner?: string
}

interface RoomHeaderProps {
  roomDetails: RoomDetails
  onSettingsClick?: () => void
  onShareClick?: () => void
}

const RoomHeader = ({ roomDetails, onSettingsClick, onShareClick }: RoomHeaderProps) => {
  const [copied, setCopied] = useState(false)
  const user = useAuthStore((state) => state.user)
  const favouriteRoom = useFavouriteRoomStore((state) => state.favouriteRooms)
  const addFavouriteRoom = useFavouriteRoomStore((state) => state.addFavouriteRoom)
  const removeFavouriteRoom = useFavouriteRoomStore((state) => state.removeFavouriteRoom)

  // Memoized calculations for better performance
  const userMembership = useMemo(() => {
    return roomDetails.members?.find((member) => member.userId === user?.id)
  }, [roomDetails.members, user?.id])

  const isAdmin = useMemo(() => {
    return userMembership?.role === 'ADMIN'
  }, [userMembership])

  const isModerator = useMemo(() => {
    return userMembership?.role === 'MODERATOR'
  }, [userMembership])

  const canManageRoom = useMemo(() => {
    return isAdmin || isModerator
  }, [isAdmin, isModerator])

  const isFavourite = useMemo(() => {
    return favouriteRoom.some((room) => room.id === roomDetails.id)
  }, [favouriteRoom, roomDetails.id])

  const handleToggleFavourite = () => {
    if (!roomDetails) return
    
    if (isFavourite) {
      removeFavouriteRoom(roomDetails.id)
    } else {
      addFavouriteRoom({
        id: roomDetails.id,
        name: roomDetails.name,
        banner: roomDetails.banner || '/api/placeholder/400/400',
      })
    }
  }

  const copyInviteCode = async () => {
    if (!roomDetails?.inviteCode) return
    
    try {
      await navigator.clipboard.writeText(roomDetails.inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy invite code:', error)
    }
  }

  const handleShare = () => {
    if (onShareClick) {
      onShareClick()
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          title: roomDetails.name,
          text: `Join ${roomDetails.name} using invite code: ${roomDetails.inviteCode}`,
          url: window.location.href,
        })
      }
    }
  }

  const formatCreatedDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Unknown'
    }
  }

  const defaultBanner = 'https://images.unsplash.com/photo-1590272456521-1bbe160a18ce?fm=jpg&q=60&w=3000'

  return (
    <div className="mb-12">
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        {/* Banner */}
        <div className="h-48 md:h-64 w-full relative group">
          <img
            src={roomDetails.banner || defaultBanner}
            alt={`${roomDetails.name} banner`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
          
          {/* User Role Badge */}
          {userMembership && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isAdmin && (
                <div className="flex items-center gap-1 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                  <Crown size={12} />
                  <span>Admin</span>
                </div>
              )}
              {isModerator && (
                <div className="flex items-center gap-1 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                  <Settings size={12} />
                  <span>Moderator</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative px-6 -mt-20 z-10">
          <div className="backdrop-blur-md bg-white/5 dark:bg-white/10 rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Room Image */}
              <div className="flex-shrink-0">
                <img
                  src={roomDetails.banner || '/api/placeholder/400/400'}
                  alt={roomDetails.name}
                  className="w-28 h-28 md:w-36 md:h-36 rounded-xl object-cover border-4 border-blue-500 shadow-lg shadow-blue-500/30"
                />
              </div>

              {/* Details */}
              <div className="flex-1 text-white space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{roomDetails.name}</h1>
                    {roomDetails.description && (
                      <p className="text-gray-300 leading-relaxed">{roomDetails.description}</p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      onClick={handleToggleFavourite}
                      variant="ghost"
                      size="sm"
                      className="p-2 rounded-full bg-gray-800/80 hover:bg-yellow-600 text-white transition-all duration-200 backdrop-blur-sm"
                      title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                    >
                      <Star
                        size={18}
                        className={isFavourite ? 'text-yellow-400 fill-current' : 'text-gray-400'}
                      />
                    </Button>
                    
                    <Button
                      onClick={handleShare}
                      variant="ghost"
                      size="sm"
                      className="p-2 rounded-full bg-gray-800/80 hover:bg-blue-600 text-white transition-all duration-200 backdrop-blur-sm"
                      title="Share room"
                    >
                      <Share2 size={18} />
                    </Button>
                    
                    {canManageRoom && onSettingsClick && (
                      <Button
                        onClick={onSettingsClick}
                        variant="ghost"
                        size="sm"
                        className="p-2 rounded-full bg-gray-800/80 hover:bg-green-600 text-white transition-all duration-200 backdrop-blur-sm"
                        title="Room settings"
                      >
                        <Settings size={18} />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>
                      {roomDetails.members?.length || 0} member{roomDetails.members?.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Created {formatCreatedDate(roomDetails.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Invite Code */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white shadow-md space-y-3 min-w-48">
                <span className="text-sm text-gray-300 font-medium">Invite Code</span>
                <div className="px-4 py-2 rounded-lg font-mono bg-black/30 border border-white/20 text-green-400 text-center break-all">
                  {roomDetails.inviteCode}
                </div>
                <Button
                  onClick={copyInviteCode}
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 w-full justify-center"
                  disabled={copied}
                >
                  <Copy size={14} />
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomHeader