// src/hooks/useChatWebsocket.ts
import { WSS_URL } from "@/lib/url";
import { useAuthStore } from "@/store/useAuthStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useEffect, useState } from "react";

export function useChatWebSocket(roomId: string, token: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const user = useAuthStore((state) => state.user);
  // console.log(token, roomId, user?.id);
  useEffect(() => {
    if (user?.id && roomId && token) {
      const ws = new WebSocket(`${WSS_URL}/ws?token=${token}&roomId=${roomId}`);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      // ws.onmessage = (event) => {
      //   const data = JSON.parse(event.data);

      //   if (data.event === "message:received") {
      //     useMessageStore.getState().addMessage(data.message);
      //     // console.log("Message received:", data.message);
      //   }
      // };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.event) {
          case "chat-history":
            useMessageStore.getState().setMessages(data.messages); // ⬅️ Add all messages
            break;

          case "message:received":
            useMessageStore.getState().addMessage(data.message); // ⬅️ Add new message
            break;

          default:
            // console.log("Unknown event type:", data.event);
        }
      };

      ws.onerror = (error) => {
        console.log("WebSocket error:", error);
      };

      ws.onclose = () => {
        // console.log("WebSocket connection closed");
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [user?.id, roomId, token]);

  const sendMessage = (text: string, messageType = "TEXT") => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          text,
          messageType,
          senderName: user?.name,
          senderAvatar: user?.image,
        })
      );
    }
  };

  return { sendMessage, socket };
}
