import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Customers table
export const customers = pgTable("customers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  languagePreference: text("language_preference").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  customerId: integer("customer_id").references(() => customers.id),
  vin: text("vin").unique().notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage").notNull(),
  lastServiceDate: timestamp("last_service_date"),
});

// Vehicle Health Logs table
export const vehicleHealthLogs = pgTable("vehicle_health_logs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  batteryHealth: integer("battery_health"), // 0-100%
  engineOil: text("engine_oil"), // Good/Low/Critical
  brakePadThickness: real("brake_pad_thickness"), // mm
  tirePressureFl: real("tire_pressure_fl"), // PSI
  tirePressureFr: real("tire_pressure_fr"),
  tirePressureRl: real("tire_pressure_rl"),
  tirePressureRr: real("tire_pressure_rr"),
  engineTemp: real("engine_temp"), // Celsius
  coolantLevel: text("coolant_level"),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Conversations table
export const conversations = pgTable("conversations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  customerId: integer("customer_id").references(() => customers.id),
  channel: text("channel").notNull(), // whatsapp/web/app
  status: text("status").notNull().default("active"), // active/resolved/escalated
  createdAt: timestamp("created_at").defaultNow(),
  closedAt: timestamp("closed_at"),
});

// Messages table
export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  conversationId: integer("conversation_id").references(() => conversations.id),
  sender: text("sender").notNull(), // customer/ai/agent
  message: text("message").notNull(),
  sentimentScore: real("sentiment_score"), // 0-1
  emotionLabel: text("emotion_label"), // happy/neutral/concerned/frustrated/urgent
  timestamp: timestamp("timestamp").defaultNow(),
});

// Maintenance Alerts table
export const maintenanceAlerts = pgTable("maintenance_alerts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  alertType: text("alert_type").notNull(), // routine/wear_warning/critical
  component: text("component").notNull(), // brake_pads/oil/battery
  message: text("message").notNull(),
  severity: text("severity").notNull(), // low/medium/high
  predictedFailureDate: timestamp("predicted_failure_date"),
  status: text("status").notNull().default("pending"), // pending/acknowledged/booked/dismissed
  createdAt: timestamp("created_at").defaultNow(),
});

// Service Bookings table
export const serviceBookings = pgTable("service_bookings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  customerId: integer("customer_id").references(() => customers.id),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  bookingId: text("booking_id").unique().notNull(),
  serviceType: text("service_type").notNull(),
  serviceCenter: text("service_center").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  status: text("status").notNull().default("confirmed"), // confirmed/completed/cancelled
  estimatedCostMin: integer("estimated_cost_min"),
  estimatedCostMax: integer("estimated_cost_max"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Feedback table
export const feedback = pgTable("feedback", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  conversationId: integer("conversation_id").references(() => conversations.id),
  rating: integer("rating").notNull(), // 1-5 stars
  wasHelpful: boolean("was_helpful"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Knowledge Base table
export const knowledgeBase = pgTable("knowledge_base", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  keywords: text("keywords"), // comma-separated for search
  source: text("source"), // manual page reference
});

// Insert schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
});

export const insertVehicleHealthLogSchema = createInsertSchema(vehicleHealthLogs).omit({
  id: true,
  recordedAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  closedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertMaintenanceAlertSchema = createInsertSchema(maintenanceAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertServiceBookingSchema = createInsertSchema(serviceBookings).omit({
  id: true,
  createdAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});

export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({
  id: true,
});

// Types
export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type VehicleHealthLog = typeof vehicleHealthLogs.$inferSelect;
export type InsertVehicleHealthLog = z.infer<typeof insertVehicleHealthLogSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type MaintenanceAlert = typeof maintenanceAlerts.$inferSelect;
export type InsertMaintenanceAlert = z.infer<typeof insertMaintenanceAlertSchema>;

export type ServiceBooking = typeof serviceBookings.$inferSelect;
export type InsertServiceBooking = z.infer<typeof insertServiceBookingSchema>;

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;
