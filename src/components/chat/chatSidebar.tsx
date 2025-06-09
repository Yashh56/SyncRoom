import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import ChatSideBar from "./chatSidebar";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useMessageStore } from "@/store/useMessageStore";
import { Menu, Send, ArrowDown, Sparkles, MessageCircle, Users, Zap } from "lucide-react";

export default function ChatInterface({ roomId }: { roomId: string }) {
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);
  const lastSentByUserRef = useRef(false);

  const token = useAuthStore((state) => state.token);
  const { sendMessage, socket } = useChatWebSocket(roomId, token || "");
  const messages = useMessageStore((state) => state.messages);

  // Simulate typing indicator
  useEffect(() => {
    if (input.length > 0) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [input]);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 p-0 m-0 overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(120,119,198,0.4), transparent 70%)",
              "radial-gradient(circle at 80% 20%, rgba(255,119,198,0.4), transparent 70%)",
              "radial-gradient(circle at 40% 40%, rgba(0,255,255,0.3), transparent 70%)",
              "radial-gradient(circle at 20% 80%, rgba(120,119,198,0.4), transparent 70%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-r from-violet-400/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-400/15 to-rose-600/15 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          style={{ bottom: "10%", right: "10%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: "50%", right: "20%" }}
        />
      </div>

      <div className="relative z-10 w-full h-screen flex flex-col md:flex-row">
        {/* Enhanced Mobile Header */}
        <motion.div 
          className="md:hidden flex justify-between items-center p-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={16} className="text-white" />
            </motion.div>
            <h2 className="text-slate-800 dark:text-slate-200 text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Chat Room
            </h2>
            <motion.div
              className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Live</span>
            </motion.div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-xl border border-violet-200/50 dark:border-violet-800/50"
            >
              <Menu className="text-violet-600 dark:text-violet-400" size={20} />
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Mobile Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              className="md:hidden border-b border-white/20 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-lg"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ChatSideBar roomId={roomId} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-1 flex-col md:flex-row w-full">
          {/* Enhanced Main Chat Area */}
          <div className="flex-1 flex flex-col relative">
            <Card className="flex flex-col flex-1 rounded-none md:rounded-3xl border-none shadow-2xl transition-all overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/30">
              
              {/* Enhanced Messages Area */}
              <CardContent className="p-0 flex-1 overflow-hidden relative">
                <ScrollArea
                  className="h-full px-4 md:px-8"
                  ref={scrollAreaRef}
                  onScrollCapture={handleScroll}
                >
                  <div className="py-6 md:py-8">
                    <div className="flex flex-col gap-6 md:gap-8">
                      <AnimatePresence>
                        {messages.map((msg, index) => {
                          // Check if we need to show a date separator
                          const currentDate = new Date(msg.createdAt).toDateString();
                          const previousDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
                          const showDateSeparator = !previousDate || currentDate !== previousDate;

                          // Format date for display
                          const formatDate = (date: Date) => {
                            const today = new Date();
                            const yesterday = new Date(today);
                            yesterday.setDate(yesterday.getDate() - 1);
                            
                            const messageDate = new Date(date);
                            
                            if (messageDate.toDateString() === today.toDateString()) {
                              return "Today";
                            } else if (messageDate.toDateString() === yesterday.toDateString()) {
                              return "Yesterday";
                            } else {
                              return messageDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              });
                            }
                          };

                          return (
                            <div key={msg.id}>
                              {/* Date Separator */}
                              {showDateSeparator && (
                                <motion.div
                                  className="flex items-center justify-center my-4"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                  <div className="relative flex items-center justify-center w-full">
                                    <div className="absolute inset-0 flex items-center">
                                      <div className="w-full border-t border-slate-300/50 dark:border-slate-600/50"></div>
                                    </div>
                                    <motion.div 
                                      className="relative bg-gradient-to-r from-violet-100 via-purple-50 to-pink-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 px-4 py-2 rounded-full shadow-sm border border-white/60 dark:border-slate-600/50 backdrop-blur-sm"
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                    >
                                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                        {formatDate(new Date(msg.createdAt))}
                                      </span>
                                    </motion.div>
                                  </div>
                                </motion.div>
                              )}

                              {/* Message */}
                              <motion.div
                                className="flex justify-start"
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                                transition={{
                                  duration: 0.5,
                                  delay: index === messages.length - 1 ? 0.1 : 0,
                                  ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                whileHover={{ y: -2 }}
                              >
                            <div className="flex items-start gap-4 max-w-full group">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Avatar className="w-10 h-10 mt-1 md:w-12 md:h-12 ring-3 ring-gradient-to-r from-violet-400 to-purple-600 flex-shrink-0 shadow-lg">
                                  <AvatarImage src={msg.senderAvatar} alt="avatar" />
                                  <AvatarFallback className="bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 text-white text-sm font-bold shadow-inner">
                                    {msg.senderName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                              <div className="flex flex-col min-w-0 flex-1">
                                <motion.div 
                                  className="flex items-baseline gap-3 mb-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.1 }}
                                >
                                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                    {msg.senderName}
                                  </span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </motion.div>
                                <motion.div 
                                  className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-700 rounded-3xl rounded-tl-lg px-5 py-4 shadow-lg border border-white/60 dark:border-slate-700/60 backdrop-blur-sm relative overflow-hidden group-hover:shadow-xl transition-all duration-300"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  {/* Message glow effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  
                                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap relative z-10">
                                    {msg.content}
                                  </p>
                                  
                                  {/* Sparkle effect on hover */}
                                  <motion.div
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                                    initial={{ scale: 0, rotate: 0 }}
                                    whileHover={{ scale: 1, rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Sparkles size={12} className="text-violet-400" />
                                  </motion.div>
                                </motion.div>
                              </div>
                            </div>
                              </motion.div>
                            </div>
                          );
                        })}
                      </AnimatePresence>
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </ScrollArea>

                {/* Enhanced Scroll to bottom button */}
                <AnimatePresence>
                  {showScrollButton && (
                    <motion.div
                      className="absolute bottom-6 right-6 z-10"
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0, y: 20 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          size="sm"
                          onClick={() => scrollToBottom()}
                          className="rounded-full shadow-xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 h-12 w-12 p-0 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <ArrowDown size={18} className="relative z-10" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>

              {/* Enhanced Input Area */}
              <motion.div 
                className="p-4 md:p-8 border-t border-white/20 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl relative overflow-hidden"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5" />
                
                <div className="flex items-end gap-4 md:gap-6 relative z-10">
                  <div className="flex-1 relative">
                    <motion.div
                      className="relative"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input
                        placeholder="Type your message..."
                        className="min-h-[48px] pr-16 resize-none border-2 border-gradient-to-r from-violet-300/50 to-purple-300/50 dark:border-slate-600/50 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300"
                        value={input}
                        onFocus={() => setTimeout(() => scrollToBottom(), 100)}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                      />
                      
                      {/* Typing indicator */}
                      <AnimatePresence>
                        {isTyping && (
                          <motion.div
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            <Zap size={16} className="text-violet-500 animate-pulse" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button
                      disabled={input.trim().length === 0}
                      onClick={handleSend}
                      className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl px-8 py-3 shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Send size={18} className="mr-2 relative z-10" />
                      <span className="relative z-10 font-semibold">Send</span>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </Card>
          </div>

          {/* Enhanced Desktop Sidebar */}
          <motion.div 
            className="hidden md:block w-80 border-l border-white/20 dark:border-slate-800/50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl overflow-y-auto shadow-2xl"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="p-6 border-b border-white/20 dark:border-slate-800/50">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users size={20} className="text-white" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Room Info</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Active participants</p>
                </div>
              </div>
            </div>
            <ChatSideBar roomId={roomId} />
          </motion.div>
        </div>
      </div>

      {/* Audio notification */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />
    </div>
  );
}