# VoxCare Pulse - AI-Powered After-Sales Support Platform

## Overview

VoxCare Pulse is an emotion-aware predictive after-sales support platform for Volkswagen. It combines AI-powered sentiment analysis, real-time vehicle health monitoring, and intelligent chatbot interactions to provide proactive customer service. The platform features a customer-facing application for chat support and vehicle diagnostics, alongside an administrative dashboard for service center management with sentiment tracking, fleet health monitoring, and revenue analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, built using Vite for development and production builds.

**UI Component System**: Utilizes shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling. The design follows a hybrid approach combining Material Design 3 foundation with Linear-inspired dashboard aesthetics for admin interfaces and WhatsApp-style conversational UI for customer chat.

**Routing**: Implements wouter for client-side routing with three main routes:
- Landing page (`/`) - Marketing/introduction page
- Customer app (`/customer`) - Customer-facing chat and vehicle health interface
- Admin dashboard (`/admin`) - Service center management interface

**State Management**: 
- TanStack Query (React Query) for server state management and API data caching
- Local component state with React hooks for UI state
- WebSocket connections for real-time chat functionality

**Design System**:
- Typography: Inter (primary), JetBrains Mono (monospace for technical data)
- 12-column grid system for admin dashboard, single-column focus for customer app
- Tailwind spacing scale (2, 3, 4, 6, 8, 12, 16) for consistent rhythm
- Custom color system with emotion-based sentiment colors (happy, neutral, concerned, frustrated, urgent)

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API endpoints under `/api` prefix with JSON request/response format. Includes request logging middleware that captures method, path, status code, duration, and response body for API routes.

**Real-time Communication**: WebSocket server using `ws` library on `/ws` path for bidirectional real-time chat messaging, typing indicators, and escalation notifications.

**Business Logic Services**:
- **Gemini AI Service**: Sentiment analysis and AI response generation using Google's Gemini 2.5-flash (fast responses) and 2.5-pro (complex analysis)
- **Predictive Maintenance**: Vehicle health prediction algorithms calculating days until component failure based on sensor data
- **Escalation Router**: Rule-based system determining when to escalate customer conversations to human agents
- **Knowledge Base**: RAG-style knowledge retrieval system for common vehicle issues and FAQs

**Data Access Layer**: Storage abstraction interface providing CRUD operations for all entities (customers, vehicles, conversations, messages, maintenance alerts, service bookings, feedback).

### Data Storage

**Database**: PostgreSQL via Neon serverless driver with connection pooling.

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Schema Structure**:
- `customers` - Customer profiles with contact info and language preferences
- `vehicles` - Vehicle registry linked to customers (VIN, model, year, mileage)
- `vehicle_health_logs` - Time-series diagnostic data (battery, oil, brakes, tire pressure, temperature)
- `conversations` - Chat sessions with channel tracking (WhatsApp/web/app) and status (active/resolved/escalated)
- `messages` - Individual chat messages with sentiment scores and emotion labels
- `maintenance_alerts` - Predictive maintenance notifications with severity and cost estimates
- `service_bookings` - Appointment scheduling records
- `feedback` - Customer satisfaction surveys
- `knowledge_base` - FAQ and troubleshooting articles

**Migration Strategy**: Drizzle Kit handles schema migrations with version control in `/migrations` directory.

### Authentication & Authorization

Currently uses mock customer IDs (hardcoded to customer ID 1) for prototype demonstration. Production implementation would require JWT-based authentication integrated with session management.

## External Dependencies

### AI/ML Services

**Google Gemini AI** (`@google/genai`): 
- Sentiment analysis of customer messages (score, emotion label, confidence)
- Context-aware AI response generation based on conversation history
- Booking intent extraction from natural language
- Multi-language support (English/Hindi)

**API Key Configuration**: Requires `GEMINI_API_KEY` environment variable.

### Database & Infrastructure

**Neon Serverless PostgreSQL** (`@neondatabase/serverless`):
- Fully managed PostgreSQL database with WebSocket support
- Connection pooling for scalability
- Requires `DATABASE_URL` environment variable

### UI Component Libraries

**Radix UI**: Headless component primitives for accessible UI elements (dialogs, dropdowns, tooltips, etc.)

**shadcn/ui**: Pre-built components combining Radix UI with Tailwind CSS styling following the "new-york" style variant.

**Recharts**: Data visualization library for dashboard charts (sentiment heatmaps, revenue trends, fleet health metrics).

**Lucide React**: Icon library providing consistent iconography across the application.

### Development & Build Tools

**Vite**: Build tool and development server with HMR (Hot Module Replacement).

**TypeScript**: Type safety across frontend and backend with shared types in `/shared` directory.

**TailwindCSS**: Utility-first CSS framework with custom configuration for design system tokens.

**PostCSS & Autoprefixer**: CSS processing pipeline.

### Real-time Communication

**WebSocket (ws)**: Server-side WebSocket implementation for bidirectional real-time messaging.

**Custom WebSocket Hook** (`useWebSocket`): Client-side hook managing connection state, message handling, and typing indicators.

### Shared Constants & Configuration

Application constants defined in `/shared/constants.ts` including:
- Emotion definitions with score ranges, colors, and keywords
- Escalation trigger keywords
- Service center locations
- Multi-language translations (EN/HI)
- Service type definitions

### Notable Integrations (Simulated in Prototype)

- **WhatsApp Business API**: UI simulation for WhatsApp-style chat interface (not actual WhatsApp integration)
- **OBD-II Vehicle Diagnostics**: Mock data generator simulating real-time vehicle sensor readings
- **SMS/Email Notifications**: Visual notification system instead of actual message delivery