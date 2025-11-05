import { useEffect, useRef, useState, useCallback } from "react";
import { type Message } from "@shared/schema";

interface WebSocketMessage {
  type: "message" | "escalated" | "error";
  message?: Message;
  reason?: string;
  priority?: string;
}

export function useWebSocket(conversationId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Reset messages when conversation changes
  useEffect(() => {
    setMessages([]);
  }, [conversationId]);

  useEffect(() => {
    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);

        switch (data.type) {
          case "message":
            if (data.message) {
              setMessages((prev) => [...prev, data.message!]);
              setIsTyping(false);
            }
            break;

          case "escalated":
            console.log("Conversation escalated:", data.reason);
            setIsTyping(false);
            break;

          case "error":
            console.error("WebSocket error:", data);
            setIsTyping(false);
            break;
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    (message: string, language: string = "en") => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        setIsTyping(true);
        wsRef.current.send(
          JSON.stringify({
            type: "chat_message",
            conversationId,
            message,
            language,
          })
        );
      } else {
        console.error("WebSocket is not connected");
      }
    },
    [conversationId]
  );

  return {
    messages,
    setMessages,
    sendMessage,
    isConnected,
    isTyping,
  };
}
