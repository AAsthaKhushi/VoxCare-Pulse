import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SentimentIndicator } from "../shared/SentimentIndicator";
import { User, Clock, MessageSquare } from "lucide-react";
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
                    onClick={() => onTakeOver(conv.id)}
                    variant={conv.status === "escalated" ? "destructive" : "default"}
                    className="flex-1"
                    data-testid={`button-takeover-${conv.id}`}
                  >
                    Take Over
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
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
    </div>
  );
}
