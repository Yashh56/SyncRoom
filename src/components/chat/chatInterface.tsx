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
import { Menu, Send, ArrowDown } from "lucide-react";

export default function ChatInterface({ roomId }: { roomId: string }) {
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);
  const lastSentByUserRef = useRef(false);

  const token = useAuthStore((state) => state.token);
  const { sendMessage, socket } = useChatWebSocket(roomId, token || "");
  const messages = useMessageStore((state) => state.messages);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'end'
    });
  };

  // Handle scroll events to detect user scrolling
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScroll = (e: any) => {
    const element = e.target;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

    setShowScrollButton(!isAtBottom);

    // Detect if user is actively scrolling up
    if (!isAtBottom) {
      setIsUserScrolling(true);
      // Reset user scrolling flag after a delay
      setTimeout(() => setIsUserScrolling(false), 1000);
    } else {
      setIsUserScrolling(false);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Play sound if new incoming message
    if (audioRef.current && messages.length > lastMessageCountRef.current) {
      audioRef.current.play().catch(() => { });
    }

    const isNewMessage = messages.length > lastMessageCountRef.current;

    if (isNewMessage) {
      if (lastSentByUserRef.current || !isUserScrolling || lastMessageCountRef.current === 0) {
        setTimeout(() => scrollToBottom(true), 100);
      }
    }

    lastMessageCountRef.current = messages.length;
    lastSentByUserRef.current = false;
  }, [socket, messages, isUserScrolling]);

  const handleSend = () => {
    if (sendMessage && input.trim().length > 0) {
      lastSentByUserRef.current = true;
      sendMessage(input.trim());
      setInput("");

      // Scroll immediately after sending
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-0 m-0 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.1),transparent_50%)] animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(0,255,255,0.05),transparent_50%)] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full h-screen flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-slate-800 dark:text-slate-200 text-lg font-semibold">Chat Room</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="text-slate-600 dark:text-slate-400" size={20} />
          </Button>
        </div>

        {/* Mobile Sidebar */}
        {showSidebar && (
          <motion.div
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatSideBar roomId={roomId} />
          </motion.div>
        )}

        <div className="flex flex-1 flex-col md:flex-row w-full">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col relative">
            <Card className="flex flex-col flex-1 rounded-none md:rounded-xl border-none shadow-2xl transition-all overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              {/* Floating decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/10 to-purple-600/10 dark:from-violet-400/20 dark:to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-600/10 dark:from-blue-400/20 dark:to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/5 to-rose-600/5 dark:from-pink-400/15 dark:to-rose-600/15 rounded-full blur-3xl animate-pulse delay-500"></div>
              </div>

              {/* Messages Area */}
              <CardContent className="p-0 flex-1 overflow-hidden relative">
                <ScrollArea
                  className="h-full px-4 md:px-6"
                  ref={scrollAreaRef}
                  onScrollCapture={handleScroll}
                >
                  <div className="py-4 md:py-6">
                    <div className="flex flex-col gap-4 md:gap-6">
                      {messages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: index === messages.length - 1 ? 0.1 : 0,
                            ease: "easeOut"
                          }}
                        >
                          <div className="flex items-start gap-3 max-w-full">
                            <Avatar className="w-8 h-8 mt-1 md:w-10 md:h-10 ring-2 ring-slate-200 dark:ring-slate-700 flex-shrink-0">
                              <AvatarImage src={msg.senderAvatar} alt="avatar" />
                              <AvatarFallback className="bg-gradient-to-br from-violet-400 to-purple-600 text-white text-xs font-semibold">
                                {msg.senderName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {msg.senderName}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
                                  {msg.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </ScrollArea>

                {/* Scroll to bottom button */}
                {showScrollButton && (
                  <motion.div
                    className="absolute bottom-4 right-4 z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      size="sm"
                      onClick={() => scrollToBottom()}
                      className="rounded-full shadow-lg bg-violet-600 hover:bg-violet-700 text-white border-0 h-10 w-10 p-0"
                    >
                      <ArrowDown size={16} />
                    </Button>
                  </motion.div>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-end gap-3 md:gap-4">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message..."
                      className="min-h-[44px] pr-12 resize-none border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 rounded-xl shadow-sm"
                      value={input}
                      onFocus={() => setTimeout(() => scrollToBottom(), 100)}

                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  <Button
                    disabled={input.trim().length === 0}
                    onClick={handleSend}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl px-6 py-3 shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[44px]"
                  >
                    <Send size={18} className="mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>

            {/* Additional floating elements */}
            <div className="absolute top-20 right-8 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-rose-600/10 dark:from-pink-400/20 dark:to-rose-600/20 rounded-full blur-2xl animate-pulse delay-700 pointer-events-none"></div>
            <div className="absolute bottom-40 left-12 w-24 h-24 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 dark:from-cyan-400/20 dark:to-blue-600/20 rounded-full blur-2xl animate-pulse delay-1000 pointer-events-none"></div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 border-l border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm overflow-y-auto">
            <ChatSideBar roomId={roomId} />
          </div>
        </div>
      </div>

      {/* Audio notification */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
    </div>
  );
}