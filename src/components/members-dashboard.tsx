/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample member data
const sampleMembers = [
    { id: "1", name: "John Doe", avatar: "", status: "online", lastSeen: "now" },
    { id: "2", name: "Sarah Smith", avatar: "", status: "online", lastSeen: "now" },
    { id: "3", name: "Mike Johnson", avatar: "", status: "offline", lastSeen: "5m ago" },
    { id: "4", name: "Emily Davis", avatar: "", status: "online", lastSeen: "now" },
    { id: "5", name: "Alex Wilson", avatar: "", status: "online", lastSeen: "now" },
    { id: "6", name: "Lisa Brown", avatar: "", status: "offline", lastSeen: "30m ago" },
    { id: "7", name: "Robert Miller", avatar: "", status: "online", lastSeen: "now" },
    { id: "8", name: "Amanda Lee", avatar: "", status: "offline", lastSeen: "1h ago" },
    { id: "9", name: "Daniel Taylor", avatar: "", status: "online", lastSeen: "now" },
    { id: "10", name: "Olivia Moore", avatar: "", status: "offline", lastSeen: "2h ago" },
    { id: "11", name: "Ryan Clark", avatar: "", status: "online", lastSeen: "now" },
    { id: "12", name: "Emma White", avatar: "", status: "online", lastSeen: "now" },
];

export default function MemberDashboard({ roomId }: { roomId: string }) {
    const [filter, setFilter] = useState("all"); // "all", "online", "offline"

    // Filter members based on current filter
    const filteredMembers = sampleMembers.filter(member => {
        if (filter === "all") return true;
        return member.status === filter;
    });

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Members</h2>
                <div className="flex gap-2">
                    <Badge
                        className={`cursor-pointer ${filter === "all" ? "bg-blue-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                        onClick={() => setFilter("all")}
                    >
                        All ({sampleMembers.length})
                    </Badge>
                    <Badge
                        className={`cursor-pointer ${filter === "online" ? "bg-green-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                        onClick={() => setFilter("online")}
                    >
                        Online ({sampleMembers.filter(m => m.status === "online").length})
                    </Badge>
                    <Badge
                        className={`cursor-pointer ${filter === "offline" ? "bg-gray-500" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                        onClick={() => setFilter("offline")}
                    >
                        Offline ({sampleMembers.filter(m => m.status === "offline").length})
                    </Badge>
                </div>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="flex space-x-3">
                    {filteredMembers.map(member => (
                        <div key={member.id} className="flex flex-col items-center min-w-20">
                            <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-white">
                                    <AvatarImage src={member.avatar || ""} alt={member.name} />
                                    <AvatarFallback className="bg-blue-500 text-white">
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${member.status === "online" ? "bg-green-500" : "bg-gray-400"
                                    }`}></span>
                            </div>
                            <p className="text-xs mt-1 font-medium truncate w-full text-center">{member.name.split(' ')[0]}</p>
                            <p className="text-xs text-gray-500 truncate w-full text-center">
                                {member.status === "online" ? "Online" : member.lastSeen}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}