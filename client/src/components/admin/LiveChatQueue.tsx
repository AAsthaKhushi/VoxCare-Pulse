import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SentimentIndicator } from "../shared/SentimentIndicator";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { User, Clock, MessageSquare, Send, UserCheck } from "lucide-react";
import { type Conversation, type Message } from "@shared/schema";

interface ConversationWithDetails extends Conversation {
  customerName: string;
  lastMessage: string;
  lastMessageTime: Date;
  messageCount: number;
  avgSentiment: number;
  waitTime: number; // minutes
}

interface LiveChatQueueProps {
  conversations: ConversationWithDetails[];
  onTakeOver: (conversationId: number) => void;
}

export function LiveChatQueue({ conversations, onTakeOver }: LiveChatQueueProps) {
  const { toast } = useToast();
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [agentMessage, setAgentMessage] = useState("");
  
  // Sort by priority: escalated first, then by wait time
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.status === "escalated" && b.status !== "escalated") return -1;
    if (a.status !== "escalated" && b.status === "escalated") return 1;
    return b.waitTime - a.waitTime;
  });

  const activeCount = conversations.filter(c => c.status === "active").length;
  const escalatedCount = conversations.filter(c => c.status === "escalated").length;

  const getPriorityColor = (sentiment: number, status: string) => {
    if (status === "escalated") return "border-sentiment-urgent/50 bg-sentiment-urgent/5";
    if (sentiment < 0.3) return "border-sentiment-frustrated/50 bg-sentiment-frustrated/5";
    if (sentiment < 0.5) return "border-sentiment-concerned/50";
    return "border-border";
  };

  return (
    <div className="space-y-4" data-testid="live-chat-queue">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Chat Queue</h2>
          <p className="text-muted-foreground">{activeCount} active • {escalatedCount} escalated</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">{conversations.length} Total</Badge>
        </div>
      </div>

      {/* Queue List */}
      <ScrollArea className="h-[600px]" data-testid="scroll-queue">
        <div className="space-y-3 pr-4">
          {sortedConversations.map((conv) => (
            <Card
              key={conv.id}
              className={`p-4 hover-elevate transition-all ${getPriorityColor(conv.avgSentiment, conv.status)}`}
              data-testid={`conversation-${conv.id}`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-muted rounded-lg">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{conv.customerName}</h3>
                        {conv.status === "escalated" && (
                          <Badge variant="destructive">Escalated</Badge>
                        )}
                        <SentimentIndicator score={conv.avgSentiment} size="sm" />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        {conv.messageCount} messages
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        Waiting {conv.waitTime} min
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last Message */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm line-clamp-2">{conv.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(conv.lastMessageTime).toLocaleTimeString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedConversation(conv);
                      setShowChatDialog(true);
                      onTakeOver(conv.id);
                    }}
                    variant={conv.status === "escalated" ? "destructive" : "default"}
                    className="flex-1"
                    data-testid={`button-takeover-${conv.id}`}
                  >
                    Take Over
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedConversation(conv);
                      setShowHistoryDialog(true);
                    }}
                    data-testid={`button-view-${conv.id}`}
                  >
                    View History
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {conversations.length === 0 && (
        <Card className="p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No active conversations</p>
        </Card>
      )}

      {/* Live Chat Dialog */}
      <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
        <DialogContent className="max-w-3xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-primary" />
              Live Chat - {selectedConversation?.customerName}
            </DialogTitle>
            <DialogDescription>
              You are now handling this conversation • Wait time: {selectedConversation?.waitTime} min
            </DialogDescription>
          </DialogHeader>

          {selectedConversation && (
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              {/* Customer Info Bar */}
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedConversation.customerName}</p>
                    <p className="text-xs text-muted-foreground">{selectedConversation.messageCount} messages</p>
                  </div>
                </div>
                <SentimentIndicator score={selectedConversation.avgSentiment} size="sm" />
                {selectedConversation.status === "escalated" && (
                  <Badge variant="destructive">Escalated</Badge>
                )}
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4 bg-muted/20 rounded-lg">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="p-2 bg-primary/10 rounded-full h-fit">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-card border rounded-lg p-3">
                        <p className="text-sm">{selectedConversation.lastMessage}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(selectedConversation.lastMessageTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="p-2 bg-primary/10 rounded-full h-fit">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-card border rounded-lg p-3">
                        <p className="text-sm">Hi, I need help with my car service</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(Date.now() - 300000).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-row-reverse">
                    <div className="p-2 bg-accent rounded-full h-fit">
                      <UserCheck className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <div className="flex-1 flex flex-col items-end">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Hello! I'm here to help. What kind of service do you need?</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(Date.now() - 240000).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message to the customer..."
                  value={agentMessage}
                  onChange={(e) => setAgentMessage(e.target.value)}
                  className="min-h-[80px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (agentMessage.trim()) {
                        toast({
                          title: "Message Sent",
                          description: "Your message has been sent to the customer",
                        });
                        setAgentMessage("");
                      }
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (agentMessage.trim()) {
                      toast({
                        title: "Message Sent",
                        description: "Your message has been sent to the customer",
                      });
                      setAgentMessage("");
                    }
                  }}
                  disabled={!agentMessage.trim()}
                  className="h-auto"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAgentMessage("I'll schedule a service appointment for you. What date works best?")}
                >
                  Schedule Service
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAgentMessage("Let me check the diagnostic report for your vehicle.")}
                >
                  Check Diagnostics
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Chat Resolved",
                      description: "Conversation marked as resolved",
                    });
                    setShowChatDialog(false);
                  }}
                >
                  Resolve Chat
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Conversation History</DialogTitle>
            <DialogDescription>
              Full message history for {selectedConversation?.customerName}
            </DialogDescription>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg text-sm">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-semibold">{selectedConversation.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Channel</p>
                  <p className="font-semibold capitalize">{selectedConversation.channel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Started</p>
                  <p className="font-semibold">{selectedConversation.createdAt ? new Date(selectedConversation.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Messages</p>
                  <p className="font-semibold">{selectedConversation.messageCount}</p>
                </div>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-4 pr-4">
                  {[...Array(selectedConversation.messageCount)].map((_, i) => (
                    <div key={i} className={`flex gap-3 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                      <div className={`p-2 rounded-full h-fit ${i % 2 === 0 ? 'bg-primary/10' : 'bg-accent'}`}>
                        {i % 2 === 0 ? (
                          <User className="h-4 w-4 text-primary" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-accent-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`rounded-lg p-3 ${i % 2 === 0 ? 'bg-card border' : 'bg-primary text-primary-foreground'}`}>
                          <p className="text-sm">
                            {i % 2 === 0
                              ? `Customer message ${Math.floor(i/2) + 1}`
                              : `AI response ${Math.floor(i/2) + 1}`
                            }
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(Date.now() - (selectedConversation.messageCount - i) * 60000).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Button className="w-full" onClick={() => setShowHistoryDialog(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
