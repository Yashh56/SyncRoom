import ChatRoomCard from "@/components/chat-room-card";

// Sample chat room data
const chatRooms = [
    { id: "1", name: "General", description: "General discussion for all members", memberCount: 124, lastActive: "5m ago" },
    { id: "2", name: "Development", description: "Coding discussions and help", memberCount: 89, lastActive: "2m ago" },
    { id: "3", name: "Design", description: "UI/UX design discussions", memberCount: 56, lastActive: "1h ago" },
    { id: "4", name: "Marketing", description: "Marketing strategies and campaigns", memberCount: 32, lastActive: "3h ago" },
    { id: "5", name: "Gaming", description: "Gaming discussions and team-ups", memberCount: 78, lastActive: "30m ago" },
    { id: "6", name: "Random", description: "Off-topic conversations", memberCount: 94, lastActive: "15m ago" },
];

export default function Home() {
    return (
        <div className="container mx-auto py-8 px-6 md:px-8">
            <h1 className="text-4xl font-semibold text-gray-800 mb-4">Chat Rooms</h1>
            <p className="text-gray-500 mb-8">Join a chat room to start messaging with others</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {chatRooms.map((room) => (
                    <ChatRoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
}
