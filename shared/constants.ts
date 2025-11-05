// Shared constants between client and server

// Emotion/Sentiment Configuration
export const EMOTIONS = {
  HAPPY: {
    label: 'happy',
    scoreMin: 0.8,
    scoreMax: 1.0,
    color: '#10B981', // Green
    keywords: ['great', 'thanks', 'perfect', 'excellent', 'wonderful', 'amazing', 'love', 'appreciate', 'fantastic'],
  },
  NEUTRAL: {
    label: 'neutral',
    scoreMin: 0.4,
    scoreMax: 0.79,
    color: '#3B82F6', // Blue
    keywords: ['okay', 'fine', 'understood', 'got it', 'sure', 'alright'],
  },
  CONCERNED: {
    label: 'concerned',
    scoreMin: 0.2,
    scoreMax: 0.39,
    color: '#F59E0B', // Yellow/Amber
    keywords: ['worried', 'issue', 'problem', 'concern', 'not sure', 'confused', 'wondering'],
  },
  FRUSTRATED: {
    label: 'frustrated',
    scoreMin: 0.0,
    scoreMax: 0.19,
    color: '#F97316', // Orange
    keywords: ['frustrated', 'angry', 'terrible', 'awful', 'disappointed', 'unacceptable', 'ridiculous', 'waste'],
  },
  URGENT: {
    label: 'urgent',
    scoreMin: -1.0,
    scoreMax: -0.01,
    color: '#EF4444', // Red
    keywords: ['urgent', 'emergency', 'immediately', 'ASAP', 'critical', 'now', 'help', 'stuck', 'broken'],
  },
} as const;

// Escalation triggers
export const ESCALATION_KEYWORDS = [
  'speak to human',
  'manager',
  'not helping',
  'supervisor',
  'real person',
  'transfer',
  'complaint',
  'report',
];

// Service centers
export const SERVICE_CENTERS = [
  {
    id: 'cp',
    name: 'VW Service Connaught Place',
    location: 'Connaught Place, New Delhi',
    distance: 4.2,
    availableSlots: ['10:00 AM', '02:00 PM', '04:00 PM'],
  },
  {
    id: 'np',
    name: 'VW Service Nehru Place',
    location: 'Nehru Place, New Delhi',
    distance: 6.8,
    availableSlots: ['09:00 AM', '11:00 AM', '03:00 PM'],
  },
  {
    id: 'gk',
    name: 'VW Service Greater Kailash',
    location: 'Greater Kailash, New Delhi',
    distance: 8.5,
    availableSlots: ['10:30 AM', '01:00 PM', '05:00 PM'],
  },
];

// Service types
export const SERVICE_TYPES = {
  ROUTINE_MAINTENANCE: {
    name: 'Routine Maintenance',
    estimatedTime: '2 hours',
    costRange: [3000, 5000],
  },
  BRAKE_SERVICE: {
    name: 'Brake Inspection & Service',
    estimatedTime: '1.5 hours',
    costRange: [2500, 4000],
  },
  SUSPENSION: {
    name: 'Suspension Check & Alignment',
    estimatedTime: '1.5 hours',
    costRange: [3500, 5000],
  },
  ENGINE_DIAGNOSTIC: {
    name: 'Engine Diagnostic',
    estimatedTime: '1 hour',
    costRange: [2000, 3500],
  },
  OIL_CHANGE: {
    name: 'Oil Change',
    estimatedTime: '30 minutes',
    costRange: [1500, 2500],
  },
  BATTERY_CHECK: {
    name: 'Battery Check & Replacement',
    estimatedTime: '45 minutes',
    costRange: [4000, 8000],
  },
  TIRE_SERVICE: {
    name: 'Tire Rotation & Balance',
    estimatedTime: '1 hour',
    costRange: [2000, 3000],
  },
};

// Alert severities
export const ALERT_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Alert types
export const ALERT_TYPES = {
  ROUTINE: 'routine',
  WEAR_WARNING: 'wear_warning',
  CRITICAL: 'critical',
} as const;

// Conversation statuses
export const CONVERSATION_STATUS = {
  ACTIVE: 'active',
  RESOLVED: 'resolved',
  ESCALATED: 'escalated',
} as const;

// Message senders
export const MESSAGE_SENDERS = {
  CUSTOMER: 'customer',
  AI: 'ai',
  AGENT: 'agent',
} as const;

// Booking statuses
export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Language codes
export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
} as const;

// Translations
export const TRANSLATIONS = {
  en: {
    greeting: 'Hello! How can I help you today?',
    bookingConfirmed: 'Booking confirmed!',
    serviceCenterNearby: 'Nearby Service Centers',
    chooseTimeSlot: 'Choose a time slot',
    maintenanceAlert: 'Maintenance Alert',
    vehicleHealth: 'Vehicle Health',
    bookService: 'Book Service',
    chatWithUs: 'Chat with us',
  },
  hi: {
    greeting: 'नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूं?',
    bookingConfirmed: 'बुकिंग पुष्टि की गई!',
    serviceCenterNearby: 'नजदीकी सेवा केंद्र',
    chooseTimeSlot: 'समय स्लॉट चुनें',
    maintenanceAlert: 'रखरखाव अलर्ट',
    vehicleHealth: 'वाहन स्वास्थ्य',
    bookService: 'सेवा बुक करें',
    chatWithUs: 'हमसे चैट करें',
  },
};
