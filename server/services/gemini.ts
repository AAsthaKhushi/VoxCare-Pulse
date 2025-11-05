// DON'T DELETE THIS COMMENT
// Following instructions from Gemini integration blueprint
// Using gemini-2.5-flash for fast responses and gemini-2.5-pro for complex analysis

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface SentimentAnalysis {
  score: number; // 0-1 scale
  emotion: string; // happy/neutral/concerned/frustrated/urgent
  confidence: number;
}

export async function analyzeSentimentWithGemini(text: string): Promise<SentimentAnalysis> {
  try {
    const systemPrompt = `You are a sentiment analysis expert for customer service interactions.
Analyze the text and determine:
1. Sentiment score (0-1): 0 is very negative/urgent, 1 is very positive
2. Emotion label: one of [happy, neutral, concerned, frustrated, urgent]
3. Confidence (0-1): how confident you are in this analysis

Consider:
- Keywords indicating emotions
- Punctuation (!!!, ???) 
- ALL CAPS for urgency
- Phrases like "speak to human", "manager", "not helping" indicate frustration
- Words like "urgent", "emergency", "ASAP" indicate urgent emotion

Respond with JSON in this exact format:
{
  "score": <number between 0 and 1>,
  "emotion": "<one of: happy, neutral, concerned, frustrated, urgent>",
  "confidence": <number between 0 and 1>
}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            score: { type: "number" },
            emotion: { type: "string" },
            confidence: { type: "number" },
          },
          required: ["score", "emotion", "confidence"],
        },
      },
      contents: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    const rawJson = result.response.text();
    if (rawJson) {
      const data: SentimentAnalysis = JSON.parse(rawJson);
      return data;
    }
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini sentiment analysis error:", error);
    // Fallback to basic keyword matching
    return fallbackSentimentAnalysis(text);
  }
}

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; message: string }>,
  sentiment: SentimentAnalysis,
  language: string = "en"
): Promise<string> {
  try {
    const conversationContext = conversationHistory
      .slice(-5) // Last 5 messages for context
      .map((msg) => `${msg.role}: ${msg.message}`)
      .join("\n");

    const systemPrompt = `You are a helpful Volkswagen customer service AI assistant named VoxCare Pulse.

Current customer emotion: ${sentiment.emotion} (${sentiment.score.toFixed(2)} sentiment score)

Guidelines:
- Be empathetic and professional
- Adapt your tone based on customer emotion:
  * happy: Be friendly and casual
  * neutral: Be professional and clear
  * concerned: Be empathetic and reassuring
  * frustrated: Be apologetic and solution-focused
  * urgent: Be immediate and action-oriented
- Keep responses concise (2-3 sentences max)
- If customer wants to book service, guide them through the process
- If customer has technical questions, provide helpful information
- If customer is frustrated, offer to escalate to human agent
- Respond in ${language === "hi" ? "Hindi (Devanagari script)" : "English"}
- Be natural and conversational

Conversation history:
${conversationContext}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `Customer message: ${userMessage}` }],
        },
      ],
    });

    return result.response.text() || "I'm here to help! How can I assist you today?";
  } catch (error) {
    console.error("Gemini response generation error:", error);
    return getFallbackResponse(sentiment.emotion, language);
  }
}

export async function extractBookingIntent(message: string): Promise<{
  isBooking: boolean;
  serviceType?: string;
  date?: string;
  time?: string;
  center?: string;
}> {
  try {
    const systemPrompt = `Analyze if this customer message is about booking a service.
Extract any booking details mentioned:
- serviceType: type of service needed
- date: preferred date (extract as readable format)
- time: preferred time slot
- center: service center preference

Respond with JSON:
{
  "isBooking": <boolean>,
  "serviceType": "<string or null>",
  "date": "<string or null>",
  "time": "<string or null>",
  "center": "<string or null>"
}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            isBooking: { type: "boolean" },
            serviceType: { type: "string", nullable: true },
            date: { type: "string", nullable: true },
            time: { type: "string", nullable: true },
            center: { type: "string", nullable: true },
          },
          required: ["isBooking"],
        },
      },
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const rawJson = result.response.text();
    if (rawJson) {
      return JSON.parse(rawJson);
    }
    return { isBooking: false };
  } catch (error) {
    console.error("Booking intent extraction error:", error);
    // Simple fallback
    const lowerMessage = message.toLowerCase();
    return {
      isBooking:
        lowerMessage.includes("book") ||
        lowerMessage.includes("appointment") ||
        lowerMessage.includes("schedule") ||
        lowerMessage.includes("service"),
    };
  }
}

// Fallback sentiment analysis using keyword matching
function fallbackSentimentAnalysis(text: string): SentimentAnalysis {
  const lowerText = text.toLowerCase();
  
  // Urgent keywords
  if (
    lowerText.includes("urgent") ||
    lowerText.includes("emergency") ||
    lowerText.includes("asap") ||
    lowerText.includes("immediately")
  ) {
    return { score: -0.1, emotion: "urgent", confidence: 0.8 };
  }

  // Frustrated keywords
  if (
    lowerText.includes("frustrated") ||
    lowerText.includes("angry") ||
    lowerText.includes("terrible") ||
    lowerText.includes("manager") ||
    lowerText.includes("speak to human")
  ) {
    return { score: 0.15, emotion: "frustrated", confidence: 0.75 };
  }

  // Concerned keywords
  if (
    lowerText.includes("worried") ||
    lowerText.includes("issue") ||
    lowerText.includes("problem") ||
    lowerText.includes("concern")
  ) {
    return { score: 0.35, emotion: "concerned", confidence: 0.7 };
  }

  // Happy keywords
  if (
    lowerText.includes("great") ||
    lowerText.includes("thanks") ||
    lowerText.includes("perfect") ||
    lowerText.includes("excellent")
  ) {
    return { score: 0.9, emotion: "happy", confidence: 0.8 };
  }

  // Default neutral
  return { score: 0.6, emotion: "neutral", confidence: 0.6 };
}

function getFallbackResponse(emotion: string, language: string): string {
  const responses: Record<string, Record<string, string>> = {
    en: {
      happy: "I'm glad I could help! Is there anything else you need?",
      neutral: "I'm here to assist you. What would you like to know?",
      concerned: "I understand your concern. Let me help you with that.",
      frustrated: "I apologize for the inconvenience. Let me connect you with a specialist.",
      urgent: "I understand this is urgent. Let me help you right away.",
    },
    hi: {
      happy: "मुझे खुशी है कि मैं मदद कर सका! क्या आपको कुछ और चाहिए?",
      neutral: "मैं आपकी मदद के लिए यहाँ हूँ। आप क्या जानना चाहेंगे?",
      concerned: "मैं आपकी चिंता समझता हूँ। मैं इसमें आपकी मदद करता हूँ।",
      frustrated: "असुविधा के लिए मैं क्षमा चाहता हूँ। मैं आपको एक विशेषज्ञ से जोड़ता हूँ।",
      urgent: "मैं समझता हूँ कि यह जरूरी है। मैं तुरंत आपकी मदद करता हूँ।",
    },
  };

  return responses[language]?.[emotion] || responses.en.neutral;
}
