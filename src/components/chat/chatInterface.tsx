import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import ChatSideBar from "./chatSidebar";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useMessageStore } from "@/store/useMessageStore";
import { Menu } from "lucide-react"; // You can use any icon library

export default function ChatInterface({ roomId }: { roomId: string }) {
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const token = useAuthStore((state) => state.token);
  const { sendMessage, socket } = useChatWebSocket(roomId, token || "");
  const messages = useMessageStore((state) => state.messages);
  console.log(messages)
  useEffect(() => {
    if (!socket) {
      console.log("Socket is not initialized yet.");
      return;
    }
    if (audioRef.current) {
      audioRef.current.play().catch(() => { });
    }
  }, [socket, messages]);

  const handleSend = () => {
    if (sendMessage && input.length > 0) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-0 m-0 overflow-hidden relative">
      <div className="absolute inset-0 z-0 animate-pulse bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,255,0.05),transparent_70%)]" />
      <div className="relative z-10 w-full h-screen flex flex-col md:flex-row">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden flex justify-between items-center p-4 ">
          <h2 className="text-white text-lg font-semibold">Chat Room</h2>
          <Button variant="ghost" onClick={() => setShowSidebar(!showSidebar)}>
            <Menu className="text-white" />
          </Button>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="md:hidden border-b border-zinc-800">
            <ChatSideBar roomId={roomId} />
          </div>
        )}
        <div className="flex flex-1 flex-col md:flex-row w-full">
          {/* Chat Area */}
          <Card className="flex flex-col flex-1 rounded-none md:rounded-xl border-none shadow-xl transition-all overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 dark:bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>
            <CardContent className="p-4 md:p-6 flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-2 md:pr-4">
                <div className="flex flex-col gap-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 mt-1 md:w-10 md:h-10">
                          <AvatarImage src={msg.senderAvatar} alt="avatar" />
                          <AvatarFallback>{msg.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-white">{msg.senderName}</span>
                            <span className="text-xs text-zinc-500">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-200 leading-relaxed break-words">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="p-4 md:p-6 border-t border-zinc-800 flex items-center gap-2 md:gap-4">
              <Input
                placeholder="Type your message..."
                className="flex-1  border-zinc-700 text-zinc-100"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                variant="secondary"
                disabled={input.length === 0}
                onClick={handleSend}
                className="bg-purple-600 hover:bg-blue-700 text-white rounded-full px-4 py-2"
              >
                Send
              </Button>
            </div>
            <audio ref={audioRef} src="/notification.mp3" preload="auto" />
          </Card>
          <div className="absolute top-20 right-8 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 rounded-full blur-2xl animate-pulse delay-700 pointer-events-none"></div>
          <div className="absolute bottom-40 left-12 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000 pointer-events-none"></div>

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 border-l border-zinc-800  overflow-y-auto">
            <ChatSideBar roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
}
