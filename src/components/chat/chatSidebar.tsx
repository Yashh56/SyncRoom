import React, { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import axios from 'axios'
import { useRoomStore } from '@/store/useRoomStore'



interface ChatSideBarProps {
    roomId: string
}

interface Member {
    id: string;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
    role: string;
}


const ChatSideBar = ({ roomId }: ChatSideBarProps) => {

    const members: Member[] = useRoomStore((state) => state.members);
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/room/members/${roomId}`, { withCredentials: true })
                console.log(res.data)
                useRoomStore.setState({ members: res.data.data })
            } catch (error) {
                console.log(error)
            }
        }
        fetchMembers()
    }, [roomId])


    return (
        <div className="w-full md:border-l border-zinc-800  p-4 overflow-y-auto overflow-x-hidden">
            <h3 className="text-zinc-200 text-lg font-semibold mb-4">Room Members</h3>
            <div className="flex flex-col gap-4">
                {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={member.user.image || ""} />
                            <AvatarFallback className='text-sm text-white break-words'>{member.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm text-white">{member.user.name}</div>
                            <div className="text-xs text-zinc-400">{member.role}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChatSideBar