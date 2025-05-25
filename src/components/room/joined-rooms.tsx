/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import axios from 'axios'
import Link from 'next/link'
import { useRoomStore } from '@/store/useRoomStore'

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

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-2xl bg-muted animate-pulse shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <div className="flex flex-col gap-2 w-full">
              <div className="w-1/2 h-4 bg-gray-300 rounded" />
              <div className="w-3/4 h-3 bg-gray-300 rounded" />
            </div>
          </div>
        ))
      ) : (
        joinedRooms.map((room) => (
          <Link
            href={`/room/${room.id}`}
            key={room.id}
            className="flex items-center gap-4 p-4 rounded-2xl bg-muted hover:bg-muted/80 transition-colors shadow-sm"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={room.banner} alt={room.name} />
              <AvatarFallback className="bg-primary text-white">
                {room.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium text-foreground">
                  {room.name}
                </h3>
                <div className="text-xs text-muted-foreground">
                  🟢 {room.onlineMembers} / {room.totalMembers}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {room.description || 'No description available'}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}

export default JoinedRooms
