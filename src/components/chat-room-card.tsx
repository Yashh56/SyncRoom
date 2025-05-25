import { ChevronRight } from "lucide-react";

// ChatRoomCard Component
const ChatRoomCard = ({ room }: { room: any }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{room.name}</h2>
                <div className="text-sm text-gray-500">{room.lastActive}</div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{room.description}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{room.memberCount} Members</span>
                <ChevronRight className="text-primary-500" />
            </div>
        </div>
    );
};

export default ChatRoomCard;
