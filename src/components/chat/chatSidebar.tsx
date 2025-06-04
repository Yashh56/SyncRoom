import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ArrowLeft } from 'lucide-react'
import axios from 'axios'
import { Member, useRoomStore } from '@/store/useRoomStore'
import { localURL } from '@/lib/url'

interface ChatSideBarProps {
    roomId: string
    onBack?: () => void // Optional callback for custom back behavior
}

const ChatSideBar = ({ roomId, onBack }: ChatSideBarProps) => {
    const members: Member[] = useRoomStore((state) => state.members)

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await axios.get(`${localURL}/room/members/${roomId}`, { withCredentials: true })
                console.log(res.data)
                useRoomStore.setState({ members: res.data.data })
            } catch (error) {
                console.log(error)
            }
        }
        fetchMembers()
    }, [roomId])

    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            // Default behavior - go back in browser history
            window.history.back()
        }
    }

    return (
        <div className="w-full md:border-l border-zinc-800 p-4 overflow-y-auto overflow-x-hidden">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="flex items-center gap-2 mb-4 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
                <ArrowLeft size={16} />
                <span className="text-sm">Back</span>
            </button>

            <h3 className="text-black text-lg font-semibold mb-4 dark:text-white">Room Members</h3>
            <div className="flex flex-col gap-4">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage referrerPolicy="no-referrer"
                                src={member.user.image || ""} />
                            <AvatarFallback className='text-sm text-black break-words'>{member.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm text-black dark:text-white">{member.user.name}</div>
                            <div className="text-xs text-zinc-400">{member.role}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatSideBar