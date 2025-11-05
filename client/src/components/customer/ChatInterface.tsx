import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Languages, MessageSquare } from "lucide-react";
import { SentimentIndicator } from "../shared/SentimentIndicator";
import { type Message } from "@shared/schema";
import { LANGUAGES, TRANSLATIONS } from "@shared/constants";

interface ChatInterfaceProps {
  conversationId: number;
  onSendMessage: (message: string) => void;
  messages: Message[];
  isTyping: boolean;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function ChatInterface({ 
  conversationId,
  onSendMessage, 
  messages, 
  isTyping,
  currentLanguage,
  onLanguageChange 
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const translations = currentLanguage === LANGUAGES.HI ? TRANSLATIONS.hi : TRANSLATIONS.en;

  const quickActions = [
    { id: "booking", label: translations.bookService },
    { id: "track", label: "Track Service" },
    { id: "query", label: "General Query" },
  ];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      booking: currentLanguage === LANGUAGES.HI ? "मुझे सर्विस बुक करनी है" : "I want to book a service",
      track: "Track my service",
      query: currentLanguage === LANGUAGES.HI ? "मेरे पास एक सवाल है" : "I have a question",
    };
    onSendMessage(actionMessages[action] || action);
  };

  return (
    <div className="flex flex-col h-full bg-background" data-testid="chat-interface">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-primary text-primary-foreground p-4 border-b border-primary-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">VoxCare Pulse</h2>
              <p className="text-xs opacity-90">Online • Ready to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLanguageChange(currentLanguage === LANGUAGES.EN ? LANGUAGES.HI : LANGUAGES.EN)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
            data-testid="button-language-toggle"
          >
            <Languages className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
            data-testid={`message-${msg.id}`}
          >
            <div className={`flex flex-col max-w-md ${msg.sender === "customer" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 rounded-2xl ${
                  msg.sender === "customer"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : msg.sender === "agent"
                    ? "bg-sentiment-happy/10 text-foreground border-2 border-sentiment-happy rounded-tl-sm"
                    : "bg-muted text-foreground rounded-tl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 px-1">
                {msg.sentimentScore !== null && msg.sentimentScore !== undefined && (
                  <SentimentIndicator score={msg.sentimentScore} size="sm" />
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start" data-testid="typing-indicator">
            <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length < 2 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2" data-testid="quick-actions">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.id)}
                className="rounded-full"
                data-testid={`button-quick-action-${action.id}`}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={translations.chatWithUs}
            className="resize-none min-h-[44px] max-h-32"
            rows={1}
            data-testid="input-message"
          />
          <Button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isTyping}
            size="icon"
            className="h-11 w-11 rounded-full flex-shrink-0"
            data-testid="button-send"
          >
            {isTyping ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
