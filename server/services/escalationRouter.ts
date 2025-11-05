import { ESCALATION_KEYWORDS } from "@shared/constants";
import { type SentimentAnalysis } from "./gemini";

interface EscalationDecision {
  shouldEscalate: boolean;
  reason: string;
  priority: "low" | "medium" | "high" | "urgent";
}

export function checkEscalationTriggers(
  sentiment: SentimentAnalysis,
  messageText: string,
  consecutiveUnresolvedCount: number,
  avgConversationSentiment: number
): EscalationDecision {
  const lowerMessage = messageText.toLowerCase();

  // Critical: Urgent sentiment
  if (sentiment.emotion === "urgent" || sentiment.score < 0) {
    return {
      shouldEscalate: true,
      reason: "Customer expressed urgent need or emergency",
      priority: "urgent",
    };
  }

  // High Priority: Explicit request for human
  for (const keyword of ESCALATION_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      return {
        shouldEscalate: true,
        reason: `Customer requested: "${keyword}"`,
        priority: "high",
      };
    }
  }

  // High Priority: Frustrated customer
  if (sentiment.emotion === "frustrated" || sentiment.score < 0.2) {
    return {
      shouldEscalate: true,
      reason: "Customer is frustrated with current interaction",
      priority: "high",
    };
  }

  // Medium Priority: Declining sentiment over conversation
  if (avgConversationSentiment < 0.3 && consecutiveUnresolvedCount > 2) {
    return {
      shouldEscalate: true,
      reason: "Sentiment declining and multiple unresolved messages",
      priority: "medium",
    };
  }

  // Medium Priority: Too many back-and-forth messages without resolution
  if (consecutiveUnresolvedCount > 5) {
    return {
      shouldEscalate: true,
      reason: "Conversation not progressing toward resolution",
      priority: "medium",
    };
  }

  // No escalation needed
  return {
    shouldEscalate: false,
    reason: "Conversation proceeding normally",
    priority: "low",
  };
}

export function generateEscalationMessage(decision: EscalationDecision, language: string = "en"): string {
  if (!decision.shouldEscalate) {
    return "";
  }

  const messages: Record<string, Record<string, string>> = {
    en: {
      urgent: "I understand this is urgent and important to you. I'm connecting you to a specialist right away who can provide immediate assistance.",
      high: "I understand this is important. Let me connect you to one of our service specialists who can provide personalized assistance.",
      medium: "I'd like to ensure you get the best help possible. Let me connect you to a specialist who can assist you further.",
    },
    hi: {
      urgent: "मैं समझता हूं कि यह जरूरी है और आपके लिए महत्वपूर्ण है। मैं आपको तुरंत एक विशेषज्ञ से जोड़ रहा हूं जो तत्काल सहायता प्रदान कर सकता है।",
      high: "मैं समझता हूं कि यह महत्वपूर्ण है। मैं आपको हमारे सेवा विशेषज्ञों में से एक से जोड़ता हूं जो व्यक्तिगत सहायता प्रदान कर सकते हैं।",
      medium: "मैं यह सुनिश्चित करना चाहता हूं कि आपको सबसे अच्छी मदद मिले। मैं आपको एक विशेषज्ञ से जोड़ता हूं जो आपकी और मदद कर सकता है।",
    },
  };

  return messages[language]?.[decision.priority] || messages.en.medium;
}

export interface AgentAssignment {
  agentId: string | null;
  agentName: string;
  estimatedWaitTime: number; // minutes
}

export function assignAgent(priority: string): AgentAssignment {
  // Simplified agent assignment logic
  // In production, this would check actual agent availability
  
  const agents = [
    { id: "agent-1", name: "Rahul Verma", specialty: "technical" },
    { id: "agent-2", name: "Priya Singh", specialty: "customer-service" },
    { id: "agent-3", name: "Amit Kumar", specialty: "bookings" },
  ];

  // For now, round-robin assignment
  const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

  const waitTimes: Record<string, number> = {
    urgent: 0, // Immediate
    high: 2,   // 2 minutes
    medium: 5, // 5 minutes
    low: 10,   // 10 minutes
  };

  return {
    agentId: assignedAgent.id,
    agentName: assignedAgent.name,
    estimatedWaitTime: waitTimes[priority] || 5,
  };
}
