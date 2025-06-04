
/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Badge } from "../ui/badge";
import { Users, Globe, Lock, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { localURL } from '@/lib/url';

const SuggestedRooms = () => {
    interface Room {
        id: string;
        name: string;
        banner?: string;
        description?: string;
        isPrivate: boolean;
        memberCount: number;
        inviteCode: string;
    }

    const [rooms, setRooms] = React.useState<Room[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`${localURL}/room/public`, { withCredentials: true });
                console.log(res.data.data);
                setRooms(res.data.data);
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
                toast.error('Error fetching rooms');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const handleJoinRoom = async (inviteCode: string) => {
        try {
            setLoading(true);
            const res = await axios.post(`${localURL}/room/join`, {
                inviteCode,
            }, { withCredentials: true });

            if (res.data.status === 'success') {
                toast.success('Room joined successfully');
            } else {
                toast.error('Error joining room');
            }
        } catch (error) {
            toast.error('Error joining room');
            console.error(error);
        } finally {
            setLoading(false);
        }

        toast.success('Room joined successfully');
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-center w-full py-12">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <span className="ml-2 text-muted-foreground">Loading suggested rooms...</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/30 mb-6 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-12 text-center">
                <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium">Something went wrong</h3>
                <p className="text-muted-foreground mt-2">{error}</p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </Button>
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-12 text-center">
                <div className="text-muted-foreground mb-4">
                    <Globe className="h-10 w-10 mx-auto" />
                </div>
                <h3 className="text-lg font-medium">No rooms available</h3>
                <p className="text-muted-foreground mt-2">There are currently no public rooms to join</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="group relative flex flex-col bg-zinc-900/50 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all duration-300"
                    >
                        <div className="relative h-40 w-full overflow-hidden">
                            {room.banner ? (
                                <img
                                    src={room.banner}
                                    alt={room.name}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-purple-900/50 to-zinc-900/50 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-purple-300/30">{room.name.charAt(0)}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80"></div>
                        </div>

                        <div className="relative flex-1 p-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-lg line-clamp-1 text-white group-hover:text-purple-300 transition-colors">
                                    {room.name}
                                </h3>
                                <Badge variant={room.isPrivate ? "outline" : "default"} className="ml-2 bg-purple-600/20 text-purple-300 border-purple-500/50">
                                    {room.isPrivate ? <Lock className="h-3 w-3 mr-1" /> : <Globe className="h-3 w-3 mr-1" />}
                                    {room.isPrivate ? "Private" : "Public"}
                                </Badge>
                            </div>

                            <p className="text-zinc-400 text-sm line-clamp-2 mb-3 min-h-[40px]">
                                {room.description || "No description available for this room."}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center text-zinc-400 text-xs">
                                    <Users className="h-3 w-3 mr-1" />
                                    <span>{room.memberCount || 0} members</span>
                                </div>

                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-xs hover:bg-purple-700/20 hover:text-purple-300"
                                            onClick={() => handleJoinRoom(room.inviteCode)}
                                        >
                                            Join Room
                                            <ChevronRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent side="top" className="w-fit text-xs p-2 bg-zinc-800 border border-zinc-700">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-zinc-400">Invite Code:</span>
                                            <code className="bg-zinc-900 px-2 py-1 rounded text-purple-400 font-mono">{room.inviteCode}</code>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {rooms.length > 0 && (
                <div className="flex justify-center mt-6">
                    <Button variant="outline" className="text-sm border-dashed">
                        View All Rooms
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SuggestedRooms;
