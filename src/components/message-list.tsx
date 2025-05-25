interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
}

export default function MessageList({ messages }: { messages: Message[] }) {
    return (
        <div className="space-y-4">
            {messages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                        <div className="font-medium">{message.sender}</div>
                        <div className="text-xs text-gray-500">{message.timestamp}</div>
                    </div>
                    <p>{message.content}</p>
                </div>
            ))}
        </div>
    );
}