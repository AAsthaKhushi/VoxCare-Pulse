import { 
  type Customer,
  type Vehicle,
  type VehicleHealthLog,
  type Conversation,
  type Message,
  type MaintenanceAlert,
  type ServiceBooking,
  type Feedback,
  type InsertCustomer,
  type InsertVehicle,
  type InsertVehicleHealthLog,
  type InsertConversation,
  type InsertMessage,
  type InsertMaintenanceAlert,
  type InsertServiceBooking,
  type InsertFeedback,
} from "@shared/schema";
import { db } from "./db";
import { 
  customers, 
  vehicles, 
  vehicleHealthLogs,
  conversations,
  messages,
  maintenanceAlerts,
  serviceBookings,
  feedback 
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Customers
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;

  // Vehicles
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehiclesByCustomer(customerId: number): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;

  // Vehicle Health
  getLatestHealthLog(vehicleId: number): Promise<VehicleHealthLog | undefined>;
  createHealthLog(log: InsertVehicleHealthLog): Promise<VehicleHealthLog>;

  // Conversations
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationsByCustomer(customerId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversationStatus(id: number, status: string): Promise<void>;

  // Messages
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Alerts
  getAlertsByVehicle(vehicleId: number): Promise<MaintenanceAlert[]>;
  createAlert(alert: InsertMaintenanceAlert): Promise<MaintenanceAlert>;
  updateAlertStatus(id: number, status: string): Promise<void>;

  // Bookings
  getBookingsByCustomer(customerId: number): Promise<ServiceBooking[]>;
  createBooking(booking: InsertServiceBooking): Promise<ServiceBooking>;

  // Feedback
  createFeedback(fb: InsertFeedback): Promise<Feedback>;
}

export class DatabaseStorage implements IStorage {
  async getCustomer(id: number): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    return result[0];
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values(customer).returning();
    return result[0];
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
    return result[0];
  }

  async getVehiclesByCustomer(customerId: number): Promise<Vehicle[]> {
    return db.select().from(vehicles).where(eq(vehicles.customerId, customerId));
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const result = await db.insert(vehicles).values(vehicle).returning();
    return result[0];
  }

  async getLatestHealthLog(vehicleId: number): Promise<VehicleHealthLog | undefined> {
    const result = await db
      .select()
      .from(vehicleHealthLogs)
      .where(eq(vehicleHealthLogs.vehicleId, vehicleId))
      .orderBy(desc(vehicleHealthLogs.recordedAt))
      .limit(1);
    return result[0];
  }

  async createHealthLog(log: InsertVehicleHealthLog): Promise<VehicleHealthLog> {
    const result = await db.insert(vehicleHealthLogs).values(log).returning();
    return result[0];
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    return result[0];
  }

  async getConversationsByCustomer(customerId: number): Promise<Conversation[]> {
    return db.select().from(conversations).where(eq(conversations.customerId, customerId));
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const result = await db.insert(conversations).values(conversation).returning();
    return result[0];
  }

  async updateConversationStatus(id: number, status: string): Promise<void> {
    await db.update(conversations).set({ status }).where(eq(conversations.id, id));
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async getAlertsByVehicle(vehicleId: number): Promise<MaintenanceAlert[]> {
    return db
      .select()
      .from(maintenanceAlerts)
      .where(eq(maintenanceAlerts.vehicleId, vehicleId))
      .orderBy(desc(maintenanceAlerts.createdAt));
  }

  async createAlert(alert: InsertMaintenanceAlert): Promise<MaintenanceAlert> {
    const result = await db.insert(maintenanceAlerts).values(alert).returning();
    return result[0];
  }

  async updateAlertStatus(id: number, status: string): Promise<void> {
    await db.update(maintenanceAlerts).set({ status }).where(eq(maintenanceAlerts.id, id));
  }

  async getBookingsByCustomer(customerId: number): Promise<ServiceBooking[]> {
    return db
      .select()
      .from(serviceBookings)
      .where(eq(serviceBookings.customerId, customerId))
      .orderBy(desc(serviceBookings.createdAt));
  }

  async createBooking(booking: InsertServiceBooking): Promise<ServiceBooking> {
    const result = await db.insert(serviceBookings).values(booking).returning();
    return result[0];
  }

  async createFeedback(fb: InsertFeedback): Promise<Feedback> {
    const result = await db.insert(feedback).values(fb).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
