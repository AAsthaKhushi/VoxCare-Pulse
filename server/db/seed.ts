import { db } from "./index";
import { 
  customers, 
  vehicles, 
  vehicleHealthLogs,
  conversations,
  messages,
  maintenanceAlerts,
  serviceBookings,
  knowledgeBase
} from "@shared/schema";
import { generateOBDData } from "../services/predictiveMaintenance";

export async function seedDatabase() {
  console.log("Seeding database...");

  // Seed customers
  const [customer1] = await db.insert(customers).values({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91-9876543210",
    languagePreference: "en",
  }).returning();

  const [customer2] = await db.insert(customers).values({
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91-9876543211",
    languagePreference: "hi",
  }).returning();

  // Seed vehicles
  const [vehicle1] = await db.insert(vehicles).values({
    customerId: customer1.id,
    vin: "WVWZZZ1KZAW123456",
    model: "Volkswagen Tiguan 2023",
    year: 2023,
    mileage: 45230,
    lastServiceDate: new Date("2024-09-15"),
  }).returning();

  const [vehicle2] = await db.insert(vehicles).values({
    customerId: customer2.id,
    vin: "WVWZZZ1KZAW123457",
    model: "Volkswagen Polo 2022",
    year: 2022,
    mileage: 32100,
    lastServiceDate: new Date("2024-10-01"),
  }).returning();

  // Seed vehicle health logs
  await db.insert(vehicleHealthLogs).values({
    vehicleId: vehicle1.id,
    ...generateOBDData(),
  });

  await db.insert(vehicleHealthLogs).values({
    vehicleId: vehicle2.id,
    ...generateOBDData(),
  });

  // Seed conversation
  const [conv1] = await db.insert(conversations).values({
    customerId: customer1.id,
    channel: "web",
    status: "active",
  }).returning();

  // Seed messages
  await db.insert(messages).values([
    {
      conversationId: conv1.id,
      sender: "customer",
      message: "Hi, I need help with my car",
      sentimentScore: 0.6,
      emotionLabel: "neutral",
    },
    {
      conversationId: conv1.id,
      sender: "ai",
      message: "Hello! I'm here to help you. What seems to be the issue with your car?",
      sentimentScore: null,
      emotionLabel: null,
    },
  ]);

  // Seed maintenance alerts
  await db.insert(maintenanceAlerts).values([
    {
      vehicleId: vehicle1.id,
      alertType: "wear_warning",
      component: "brake_pads",
      message: "Your brake pads are at 4.2mm thickness. We recommend inspection within 10 days.",
      severity: "medium",
      predictedFailureDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: "pending",
    },
    {
      vehicleId: vehicle1.id,
      alertType: "routine",
      component: "oil",
      message: "Your next oil change is due in 7 days based on mileage and time since last service.",
      severity: "low",
      predictedFailureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "pending",
    },
  ]);

  // Seed knowledge base
  await db.insert(knowledgeBase).values([
    {
      category: "vehicle_issues",
      question: "Why won't my engine start?",
      answer: "Common causes include: dead battery, faulty starter motor, fuel system issues, or ignition problems. Try checking if your battery is charged.",
      keywords: "engine,start,battery,dead",
      source: "Owner's Manual p.145",
    },
    {
      category: "maintenance",
      question: "How often should I change my engine oil?",
      answer: "Volkswagen recommends oil changes every 10,000 km or 12 months, whichever comes first.",
      keywords: "oil,change,service,maintenance",
      source: "Maintenance Schedule",
    },
  ]);

  console.log("Database seeded successfully!");
}
