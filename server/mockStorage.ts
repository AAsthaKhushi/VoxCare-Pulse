// Mock in-memory storage for development without database
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

// In-memory data stores
const customers: Customer[] = [];
const vehicles: Vehicle[] = [];
const vehicleHealthLogs: VehicleHealthLog[] = [];
const conversations: Conversation[] = [];
const messages: Message[] = [];
const maintenanceAlerts: MaintenanceAlert[] = [];
const serviceBookings: ServiceBooking[] = [];
const feedbackRecords: Feedback[] = [];

let customerId = 1;
let vehicleId = 1;
let healthLogId = 1;
let conversationId = 1;
let messageId = 1;
let alertId = 1;
let bookingId = 1;
let feedbackId = 1;

// Seed initial data
customers.push({
  id: customerId++,
  name: "Rajesh Kumar",
  email: "rajesh.kumar@example.com",
  phone: "+91-9876543210",
  languagePreference: "en",
  createdAt: new Date(),
});

customers.push({
  id: customerId++,
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  phone: "+91-9876543211",
  languagePreference: "hi",
  createdAt: new Date(),
});

vehicles.push({
  id: vehicleId++,
  customerId: 1,
  vin: "WVWZZZ1KZAW123456",
  model: "Volkswagen Tiguan 2023",
  year: 2023,
  mileage: 45230,
  lastServiceDate: new Date("2024-09-15"),
});

vehicles.push({
  id: vehicleId++,
  customerId: 2,
  vin: "WVWZZZ1KZAW123457",
  model: "Volkswagen Polo 2022",
  year: 2022,
  mileage: 32100,
  lastServiceDate: new Date("2024-10-01"),
});

vehicleHealthLogs.push({
  id: healthLogId++,
  vehicleId: 1,
  batteryHealth: 85,
  engineOil: "Good",
  brakePadThickness: 4.2,
  tirePressureFl: 32,
  tirePressureFr: 31,
  tirePressureRl: 30,
  tirePressureRr: 29,
  engineTemp: 92,
  coolantLevel: "Good",
  recordedAt: new Date(),
});

conversations.push({
  id: conversationId++,
  customerId: 1,
  channel: "web",
  status: "active",
  createdAt: new Date(),
  closedAt: null,
});

messages.push({
  id: messageId++,
  conversationId: 1,
  sender: "customer",
  message: "Hi, I need help with my car",
  sentimentScore: 0.6,
  emotionLabel: "neutral",
  timestamp: new Date(),
});

messages.push({
  id: messageId++,
  conversationId: 1,
  sender: "ai",
  message: "Hello! I'm here to help you. What seems to be the issue with your car?",
  sentimentScore: null,
  emotionLabel: null,
  timestamp: new Date(),
});

maintenanceAlerts.push({
  id: alertId++,
  vehicleId: 1,
  alertType: "wear_warning",
  component: "brake_pads",
  message: "Your brake pads are at 4.2mm thickness. We recommend inspection within 10 days.",
  severity: "medium",
  predictedFailureDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  status: "pending",
  createdAt: new Date(),
});

export class MockStorage {
  async getCustomer(id: number): Promise<Customer | undefined> {
    return customers.find(c => c.id === id);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const newCustomer: Customer = {
      id: customerId++,
      ...customer,
      createdAt: new Date(),
    };
    customers.push(newCustomer);
    return newCustomer;
  }

  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return vehicles.find(v => v.id === id);
  }

  async getVehiclesByCustomer(customerId: number): Promise<Vehicle[]> {
    return vehicles.filter(v => v.customerId === customerId);
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      id: vehicleId++,
      ...vehicle,
    };
    vehicles.push(newVehicle);
    return newVehicle;
  }

  async getLatestHealthLog(vehicleId: number): Promise<VehicleHealthLog | undefined> {
    return vehicleHealthLogs.filter(h => h.vehicleId === vehicleId).sort((a, b) => 
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    )[0];
  }

  async createHealthLog(log: InsertVehicleHealthLog): Promise<VehicleHealthLog> {
    const newLog: VehicleHealthLog = {
      id: healthLogId++,
      ...log,
      recordedAt: new Date(),
    };
    vehicleHealthLogs.push(newLog);
    return newLog;
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return conversations.find(c => c.id === id);
  }

  async getConversationsByCustomer(customerId: number): Promise<Conversation[]> {
    return conversations.filter(c => c.customerId === customerId);
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const newConversation: Conversation = {
      id: conversationId++,
      ...conversation,
      createdAt: new Date(),
      closedAt: null,
    };
    conversations.push(newConversation);
    return newConversation;
  }

  async updateConversationStatus(id: number, status: string): Promise<void> {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      conv.status = status;
    }
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return messages.filter(m => m.conversationId === conversationId).sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = {
      id: messageId++,
      ...message,
      timestamp: new Date(),
    };
    messages.push(newMessage);
    return newMessage;
  }

  async getAlertsByVehicle(vehicleId: number): Promise<MaintenanceAlert[]> {
    return maintenanceAlerts.filter(a => a.vehicleId === vehicleId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createAlert(alert: InsertMaintenanceAlert): Promise<MaintenanceAlert> {
    const newAlert: MaintenanceAlert = {
      id: alertId++,
      ...alert,
      createdAt: new Date(),
    };
    maintenanceAlerts.push(newAlert);
    return newAlert;
  }

  async updateAlertStatus(id: number, status: string): Promise<void> {
    const alert = maintenanceAlerts.find(a => a.id === id);
    if (alert) {
      alert.status = status;
    }
  }

  async getBookingsByCustomer(customerId: number): Promise<ServiceBooking[]> {
    return serviceBookings.filter(b => b.customerId === customerId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createBooking(booking: InsertServiceBooking): Promise<ServiceBooking> {
    const newBooking: ServiceBooking = {
      id: bookingId++,
      ...booking,
      createdAt: new Date(),
    };
    serviceBookings.push(newBooking);
    return newBooking;
  }

  async createFeedback(fb: InsertFeedback): Promise<Feedback> {
    const newFeedback: Feedback = {
      id: feedbackId++,
      ...fb,
      createdAt: new Date(),
    };
    feedbackRecords.push(newFeedback);
    return newFeedback;
  }
}

export const storage = new MockStorage();
