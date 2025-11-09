# VoxCare Pulse - AI-Powered Automotive After-Sales Platform

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** database (Neon recommended)
- **Google Gemini API** key

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Copy the example file
copy .env.example .env

# Edit .env and add your credentials:
# - DATABASE_URL: Your PostgreSQL connection string
# - GEMINI_API_KEY: Your Google Gemini API key
```

3. **Run database migrations:**
```bash
npm run db:push
```

4. **Seed the database (optional but recommended):**
```bash
npm run db:seed
```

5. **Start the development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

---

## 📁 Project Structure

```
voxcare-pulse/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── customer/        # Customer-facing UI
│   │   │   ├── admin/           # Service center dashboard
│   │   │   ├── shared/          # Reusable components
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── pages/               # Route pages
│   │   ├── hooks/               # Custom React hooks
│   │   └── lib/                 # Utilities
│   └── index.html
│
├── server/                      # Node.js backend
│   ├── services/
│   │   ├── gemini.ts            # AI sentiment analysis
│   │   ├── predictiveMaintenance.ts  # ML predictions
│   │   ├── knowledgeBase.ts     # FAQ retrieval
│   │   └── escalationRouter.ts # Escalation logic
│   ├── db/
│   │   ├── index.ts             # Database connection
│   │   └── seed.ts              # Sample data
│   ├── routes.ts                # API & WebSocket routes
│   ├── storage.ts               # Data access layer
│   └── index.ts                 # Express server
│
├── shared/                      # Shared code
│   ├── schema.ts                # Database schema
│   └── constants.ts             # Shared constants
│
└── migrations/                  # Database migrations
```

---

## 🎯 Core Features

### 1. **Emotion-Aware Chat Interface**
- Real-time sentiment analysis using Google Gemini AI
- Adaptive responses based on customer emotion
- Automatic escalation when frustration detected
- Multi-language support (English/Hindi)

### 2. **Predictive Maintenance**
- Vehicle health monitoring with OBD-II data simulation
- 7-14 day advance warnings for component failures
- Algorithms for:
  - Battery degradation
  - Brake pad wear
  - Oil change intervals
  - Tire pressure monitoring

### 3. **Conversational Booking System**
- Natural language service booking
- Service center selection with distance
- Date and time slot picker
- Cost estimates and confirmations

### 4. **Service Center Dashboard**
- Real-time chat queue monitoring
- Sentiment heatmap visualization
- Fleet health overview
- Revenue insights and analytics

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **UI Framework** | shadcn/ui (Radix + Tailwind CSS) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Neon serverless) |
| **ORM** | Drizzle ORM |
| **Real-time** | WebSocket (ws library) |
| **AI Engine** | Google Gemini AI (2.5-flash & 2.5-pro) |
| **State Management** | TanStack Query (React Query) |
| **Charts** | Recharts |
| **Routing** | wouter |

---

## 📡 API Endpoints

### Chat & Messaging
- `GET /api/messages/:conversationId` - Get conversation messages
- `POST /api/messages` - Send message (fallback for non-WebSocket)
- `WS /ws` - WebSocket connection for real-time chat

### Vehicle Health
- `GET /api/vehicle-health/:vehicleId` - Get latest health log
- `GET /api/alerts/:vehicleId` - Get maintenance alerts
- `PATCH /api/alerts/:alertId` - Update alert status

### Bookings
- `POST /api/bookings` - Create service booking

### Admin Dashboard
- `GET /api/admin/metrics` - Dashboard metrics
- `GET /api/admin/fleet` - Fleet health data
- `GET /api/admin/sentiment` - Sentiment trends
- `GET /api/admin/conversations` - Active conversations

---

## 🔄 Key Workflows

### Sentiment-Based Conversation Flow
```
Customer Message 
    ↓
Gemini AI Analysis (sentiment + emotion)
    ↓
Check Escalation Triggers
    ↓
IF frustrated → Escalate to Human
ELIF booking intent → Start Booking Flow
ELIF query → Search Knowledge Base
ELSE → Generate AI Response
```

### Predictive Maintenance Flow
```
Vehicle Health Data (OBD-II simulation)
    ↓
Predictive Algorithms
    ↓
Calculate Days Until Failure
    ↓
IF < 14 days AND probability > 70%
    ↓
Create Maintenance Alert
    ↓
Notify Customer (In-app + Chat)
```

---

## 🎨 Emotion-Based Color System

| Emotion | Score Range | Color | Usage |
|---------|------------|-------|-------|
| Happy | 0.8 - 1.0 | Green (#10B981) | Positive feedback |
| Neutral | 0.4 - 0.79 | Blue (#3B82F6) | Standard interactions |
| Concerned | 0.2 - 0.39 | Yellow (#F59E0B) | Worried customers |
| Frustrated | 0.0 - 0.19 | Orange (#F97316) | Unhappy customers |
| Urgent | -1.0 - -0.01 | Red (#EF4444) | Emergency situations |

---

## 🗄️ Database Schema

### Core Tables
- `customers` - Customer profiles
- `vehicles` - Vehicle information
- `vehicle_health_logs` - Time-series health data
- `conversations` - Chat sessions
- `messages` - Individual messages with sentiment
- `maintenance_alerts` - Predictive alerts
- `service_bookings` - Service appointments
- `knowledge_base` - FAQ database

---

## 🧪 Testing the System

### 1. Test Sentiment Analysis
Send messages with different emotions:
- "Hi, I need help" → Neutral
- "This is the THIRD time!!!" → Frustrated (triggers escalation)
- "Thanks, this is perfect!" → Happy

### 2. Test Predictive Alerts
Check the Vehicle Health Dashboard to see:
- Battery health percentage
- Brake pad thickness warnings
- Oil change reminders
- Tire pressure alerts

### 3. Test Booking Flow
1. Click "Book Service" or say "I want to book a service"
2. Select service type
3. Choose service center
4. Pick date and time
5. Confirm booking

### 4. Test Admin Dashboard
Navigate to Service Center Dashboard to view:
- Active chat queue
- Sentiment trends (hourly heatmap)
- Fleet health overview
- Revenue insights

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

---

## 🔐 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes |
| `npm run db:seed` | Seed database with sample data |

---

## 🎓 Key Concepts

### Sentiment Analysis Engine
- Uses Google Gemini AI for natural language understanding
- Fallback to keyword-based analysis if API unavailable
- Returns score (0-1), emotion label, and confidence

### Predictive Maintenance
- Linear wear rate calculations for brake pads
- Age-based battery degradation models
- Mileage + time-based oil change prediction
- Real-time tire pressure monitoring

### Escalation Logic
- Sentiment < 0.2 → Automatic escalation
- Keywords: "manager", "speak to human", "not helping"
- Multiple unresolved messages → Escalation
- Priority levels: urgent, high, medium, low

### Knowledge Base (RAG)
- Keyword-based search with relevance scoring
- Categories: vehicle_issues, maintenance, warranty, parts
- Returns top 3 matches with source attribution

---

## 🤝 Contributing

This is a prototype built for demonstration purposes. Key areas for enhancement:
- Real OBD-II hardware integration
- Production-grade agent assignment system
- Advanced ML models for predictions
- Multi-channel support (WhatsApp, SMS)
- Mobile app development

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Verify DATABASE_URL is set correctly
echo %DATABASE_URL%

# Test database connection
npm run db:push
```

### Gemini API Errors
- Ensure `GEMINI_API_KEY` is valid
- Check API quota limits
- Fallback keyword analysis will activate automatically

### Port Already in Use
```bash
# Change PORT in .env file or:
set PORT=3000 && npm run dev
```

---

## 📞 Support

For questions or issues, please refer to the project documentation or create an issue in the repository.

---

**Built with ❤️ for Volkswagen customers**
