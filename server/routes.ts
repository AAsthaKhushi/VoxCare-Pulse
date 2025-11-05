import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { analyzeSentimentWithGemini, generateAIResponse, extractBookingIntent } from "./services/gemini";
import { checkEscalationTriggers, generateEscalationMessage } from "./services/escalationRouter";
import { predictMaintenanceNeeds, generateOBDData } from "./services/predictiveMaintenance";
import { getAnswerForQuery } from "./services/knowledgeBase";
import { SERVICE_CENTERS } from "@shared/constants";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // WebSocket connection handling
  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection");

    ws.on("message", async (data: string) => {
      try {
        const payload = JSON.parse(data.toString());
        
        if (payload.type === "chat_message") {
          const { conversationId, message, language } = payload;
          
          // Get conversation history
          const messages = await storage.getMessagesByConversation(conversationId);
          const conversationHistory = messages.map(msg => ({
            role: msg.sender,
            message: msg.message,
          }));

          // Analyze sentiment with Gemini
          const sentiment = await analyzeSentimentWithGemini(message);

          // Save customer message
          const customerMsg = await storage.createMessage({
            conversationId,
            sender: "customer",
            message,
            sentimentScore: sentiment.score,
            emotionLabel: sentiment.emotion,
          });

          // Broadcast customer message
          ws.send(JSON.stringify({
            type: "message",
            message: customerMsg,
          }));

          // Check for escalation
          const avgSentiment = messages.length > 0
            ? messages.reduce((sum, m) => sum + (m.sentimentScore || 0), 0) / messages.length
            : sentiment.score;
          
          const escalation = checkEscalationTriggers(
            sentiment,
            message,
            messages.filter(m => m.sender === "customer").length,
            avgSentiment
          );

          if (escalation.shouldEscalate) {
            // Update conversation status
            await storage.updateConversationStatus(conversationId, "escalated");

            // Send escalation message
            const escalationMsg = generateEscalationMessage(escalation, language);
            const aiMsg = await storage.createMessage({
              conversationId,
              sender: "ai",
              message: escalationMsg,
              sentimentScore: null,
              emotionLabel: null,
            });

            ws.send(JSON.stringify({
              type: "message",
              message: aiMsg,
            }));

            ws.send(JSON.stringify({
              type: "escalated",
              reason: escalation.reason,
              priority: escalation.priority,
            }));

            return;
          }

          // Try knowledge base first
          const kbAnswer = getAnswerForQuery(message);
          if (kbAnswer && sentiment.score > 0.5) {
            const aiMsg = await storage.createMessage({
              conversationId,
              sender: "ai",
              message: kbAnswer,
              sentimentScore: null,
              emotionLabel: null,
            });

            ws.send(JSON.stringify({
              type: "message",
              message: aiMsg,
            }));
            return;
          }

          // Generate AI response with Gemini
          const aiResponse = await generateAIResponse(message, conversationHistory, sentiment, language);
          
          const aiMsg = await storage.createMessage({
            conversationId,
            sender: "ai",
            message: aiResponse,
            sentimentScore: null,
            emotionLabel: null,
          });

          ws.send(JSON.stringify({
            type: "message",
            message: aiMsg,
          }));
        }
      } catch (error) {
        console.error("WebSocket error:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "An error occurred. Please try again.",
        }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  // REST API Routes

  // Get messages for a conversation
  app.get("/api/messages/:conversationId", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const messages = await storage.getMessagesByConversation(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send message (fallback for non-WebSocket)
  app.post("/api/messages", async (req, res) => {
    try {
      const { conversationId, message, language = "en" } = req.body;

      // Analyze sentiment
      const sentiment = await analyzeSentimentWithGemini(message);

      // Save customer message
      const customerMsg = await storage.createMessage({
        conversationId,
        sender: "customer",
        message,
        sentimentScore: sentiment.score,
        emotionLabel: sentiment.emotion,
      });

      // Get conversation history
      const messages = await storage.getMessagesByConversation(conversationId);
      const conversationHistory = messages.map(msg => ({
        role: msg.sender,
        message: msg.message,
      }));

      // Generate AI response
      const aiResponse = await generateAIResponse(message, conversationHistory, sentiment, language);
      
      const aiMsg = await storage.createMessage({
        conversationId,
        sender: "ai",
        message: aiResponse,
        sentimentScore: null,
        emotionLabel: null,
      });

      res.json({ customerMessage: customerMsg, aiMessage: aiMsg });
    } catch (error) {
      console.error("Message error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Get vehicle health
  app.get("/api/vehicle-health/:vehicleId", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const healthLog = await storage.getLatestHealthLog(vehicleId);
      res.json(healthLog || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle health" });
    }
  });

  // Get maintenance alerts
  app.get("/api/alerts/:vehicleId", async (req, res) => {
    try {
      const vehicleId = parseInt(req.params.vehicleId);
      const alerts = await storage.getAlertsByVehicle(vehicleId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Update alert status
  app.patch("/api/alerts/:alertId", async (req, res) => {
    try {
      const alertId = parseInt(req.params.alertId);
      const { status } = req.body;
      await storage.updateAlertStatus(alertId, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update alert" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const { customerId, vehicleId, serviceType, serviceCenter, date, timeSlot } = req.body;
      
      // Generate booking ID
      const bookingId = `VW-${new Date().getFullYear().toString().slice(2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      // Get service type details for cost estimate
      const serviceTypeKey = serviceType.toUpperCase().replace(/\s+/g, '_');
      const costRange = { min: 2000, max: 5000 }; // Default
      
      const booking = await storage.createBooking({
        customerId,
        vehicleId,
        bookingId,
        serviceType,
        serviceCenter,
        scheduledDate: new Date(date),
        scheduledTime: timeSlot,
        status: "confirmed",
        estimatedCostMin: costRange.min,
        estimatedCostMax: costRange.max,
      });

      res.json(booking);
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // Admin: Get metrics
  app.get("/api/admin/metrics", async (req, res) => {
    try {
      // Mock data for prototype
      res.json({
        incomingChats: 18,
        autoResolveRate: 75,
        escalations: 3,
        avgResponseTime: 2.1,
        customerSatisfaction: 4.6,
        activeConversations: 12,
        servicesBooked: 8,
        revenue: 125000,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Admin: Get fleet data
  app.get("/api/admin/fleet", async (req, res) => {
    try {
      // Mock data for prototype
      res.json([
        { id: 1, vin: "WVWZZZ1KZAW123456", model: "VW Tiguan 2023", owner: "Rajesh Kumar", status: "critical", alerts: 2, lastChecked: "2 hours ago" },
        { id: 2, vin: "WVWZZZ1KZAW123457", model: "VW Polo 2022", owner: "Priya Sharma", status: "warning", alerts: 1, lastChecked: "5 hours ago" },
        { id: 3, vin: "WVWZZZ1KZAW123458", model: "VW Vento 2023", owner: "Amit Patel", status: "healthy", alerts: 0, lastChecked: "1 day ago" },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch fleet data" });
    }
  });

  // Admin: Get sentiment data
  app.get("/api/admin/sentiment", async (req, res) => {
    try {
      // Mock sentiment trend data
      res.json([
        { time: "9 AM", happy: 0.45, neutral: 0.35, concerned: 0.12, frustrated: 0.06, urgent: 0.02, average: 0.65 },
        { time: "10 AM", happy: 0.52, neutral: 0.30, concerned: 0.10, frustrated: 0.06, urgent: 0.02, average: 0.70 },
        { time: "11 AM", happy: 0.48, neutral: 0.32, concerned: 0.12, frustrated: 0.06, urgent: 0.02, average: 0.68 },
        { time: "12 PM", happy: 0.55, neutral: 0.28, concerned: 0.10, frustrated: 0.05, urgent: 0.02, average: 0.72 },
        { time: "1 PM", happy: 0.50, neutral: 0.30, concerned: 0.12, frustrated: 0.06, urgent: 0.02, average: 0.69 },
        { time: "2 PM", happy: 0.58, neutral: 0.25, concerned: 0.10, frustrated: 0.05, urgent: 0.02, average: 0.74 },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sentiment data" });
    }
  });

  // Admin: Get active conversations
  app.get("/api/admin/conversations", async (req, res) => {
    try {
      // Mock conversation data
      res.json([
        {
          id: 1,
          customerId: 1,
          channel: "web",
          status: "escalated",
          createdAt: new Date(),
          closedAt: null,
          customerName: "Rajesh Kumar",
          lastMessage: "This is not acceptable, I want to speak to a manager!",
          lastMessageTime: new Date(),
          messageCount: 8,
          avgSentiment: 0.15,
          waitTime: 12,
        },
        {
          id: 2,
          customerId: 2,
          channel: "web",
          status: "active",
          createdAt: new Date(),
          closedAt: null,
          customerName: "Priya Sharma",
          lastMessage: "When can I bring my car for the brake service?",
          lastMessageTime: new Date(),
          messageCount: 4,
          avgSentiment: 0.65,
          waitTime: 5,
        },
      ]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  return httpServer;
}
