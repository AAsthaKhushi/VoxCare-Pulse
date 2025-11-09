# VoxCare Pulse - Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Your API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create a new project (if needed)
4. Copy your API key

#### Database (Neon PostgreSQL)
1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project (free tier available)
3. Copy the connection string (starts with `postgresql://`)

### Step 3: Configure Environment
```bash
# On Windows PowerShell
copy .env.example .env

# Edit .env file and add:
DATABASE_URL=postgresql://your-connection-string-here
GEMINI_API_KEY=your-gemini-key-here
PORT=5000
NODE_ENV=development
```

### Step 4: Initialize Database
```bash
# Push schema to database
npm run db:push

# Seed with sample data (optional but recommended)
npm run db:seed
```

### Step 5: Start the Application
```bash
npm run dev
```

The application will start at: **http://localhost:5000**

---

## 📱 Testing the Application

### 1. Customer Interface
Navigate to: **http://localhost:5000/customer**

**Test Scenarios:**

#### A. Normal Conversation
1. Send: "Hi, I need help"
   - Expected: AI responds with a greeting
   - Sentiment: Neutral (blue dot)

2. Send: "What's included in routine maintenance?"
   - Expected: Knowledge base answer about maintenance
   - Sentiment: Neutral

#### B. Booking Flow
1. Send: "I want to book a service"
   - Expected: AI asks for service type
   
2. Click "Book Service" button or continue conversation
   - Select service type (e.g., Brake Inspection)
   - Choose service center
   - Pick date and time
   - Confirm booking
   
3. Expected: Booking confirmation with ID

#### C. Frustrated Customer (Escalation Test)
1. Send: "This is the THIRD time I'm telling you!!!"
   - Expected: Sentiment = Frustrated (orange dot)
   - Expected: AI offers to connect to human agent
   - Expected: Conversation marked as "escalated"

2. Send: "I want to speak to a manager"
   - Expected: Immediate escalation
   - Expected: Admin dashboard shows escalation

#### D. Urgent Situation
1. Send: "URGENT! My car broke down on the highway"
   - Expected: Sentiment = Urgent (red dot)
   - Expected: Immediate escalation
   - Expected: Priority marked as "urgent"

### 2. Vehicle Health Dashboard
In the Customer App, click the **"Vehicle Health"** tab

**What to Check:**
- Overall health percentage (calculated from all components)
- Battery health (0-100%)
- Engine oil status (Good/Low/Critical)
- Brake pad thickness (mm)
- Engine temperature (°C)
- Recent alerts section

### 3. Maintenance Alerts
Click the **"Alerts"** tab

**Test Actions:**
- Click "Book Service Now" → Opens booking flow
- Click "Remind in 3 Days" → Snoozes alert
- Click "X" → Dismisses alert

### 4. Service Center Dashboard
Navigate to: **http://localhost:5000/admin**

**Available Views:**

#### Dashboard
- Incoming chats count
- Auto-resolve rate
- Active escalations
- Average response time
- Customer satisfaction score

#### Fleet Health
- List of all vehicles
- Health status indicators (critical/warning/healthy)
- Alert counts per vehicle

#### Sentiment Trends
- Hour-by-hour sentiment graph
- Emotion distribution (happy, neutral, concerned, frustrated, urgent)
- Average sentiment line

#### Live Chat Queue
- Active conversations
- Customer names
- Last message preview
- Wait time
- Average sentiment per conversation
- "Take Over" button for escalations

#### Revenue Insights
- Services booked today/week/month
- Revenue trends
- Popular service types

---

## 🎨 UI Features to Notice

### Sentiment Indicators
Every customer message shows a colored dot:
- 🟢 Green = Happy (0.8-1.0)
- 🔵 Blue = Neutral (0.4-0.79)
- 🟡 Yellow = Concerned (0.2-0.39)
- 🟠 Orange = Frustrated (0.0-0.19)
- 🔴 Red = Urgent (<0.0)

### Real-Time Updates
- Typing indicators (3 animated dots)
- WebSocket connection status
- Live message delivery
- Auto-scroll to latest message

### Responsive Design
- Works on mobile (360px+)
- Tablet optimized
- Desktop layouts

---

## 🔧 Troubleshooting

### "WebSocket connection failed"
**Solution:**
- Ensure server is running on correct port
- Check if PORT environment variable is set
- Try restarting the dev server

### "Database connection error"
**Solution:**
```bash
# Verify DATABASE_URL is correct
echo $env:DATABASE_URL

# Re-run migrations
npm run db:push
```

### "Gemini API error"
**Solution:**
- Check if GEMINI_API_KEY is set correctly
- Verify API key is active
- Check API quota limits
- Fallback keyword analysis will activate automatically

### "Port 5000 already in use"
**Solution:**
```bash
# Change port in .env
PORT=3000

# Or kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### TypeScript Errors
**Solution:**
```bash
# Run type checking
npm run check

# Most type errors won't prevent runtime
```

---

## 📊 Sample Data Overview

After running `npm run db:seed`, you'll have:

### Customers
- Rajesh Kumar (English)
- Priya Sharma (Hindi)

### Vehicles
- Volkswagen Tiguan 2023 (45,230 km)
  - Battery: 70-100% (randomized)
  - Brake pads: 3-7mm (randomized)
  - Status: May have alerts
  
- Volkswagen Polo 2022 (32,100 km)
  - Similar random health data

### Alerts
- Brake pad wear warning
- Oil change due
- (Alerts generated based on health data)

### Conversations
- 1 active conversation with sample messages

---

## 🎯 Key Testing Points

### 1. Sentiment Analysis
Test with different phrases:
- Positive: "Thanks!", "This is perfect!", "Great service"
- Neutral: "Okay", "I understand", "Got it"
- Concerned: "I'm worried", "Not sure", "Is this normal?"
- Frustrated: "This is ridiculous", "Not acceptable", "Waste of time"
- Urgent: "URGENT", "EMERGENCY", "HELP NOW"

### 2. Knowledge Base
Ask questions like:
- "Why won't my engine start?"
- "How often should I change oil?"
- "When should I replace brake pads?"
- "What's covered under warranty?"

### 3. Booking Intent Detection
Try variations:
- "I want to book a service"
- "Schedule an appointment"
- "Can I book for tomorrow?"
- "I need to bring my car in"

### 4. Predictive Alerts
Check vehicle health dashboard for:
- Components near failure threshold
- Predicted failure dates
- Cost estimates
- Nearby service centers

---

## 📈 Performance Expectations

### Response Times
- WebSocket message delivery: <100ms
- Gemini API sentiment analysis: 200-500ms
- Knowledge base search: <50ms
- Database queries: <100ms

### Fallback Mechanisms
- If Gemini API fails → Keyword-based sentiment
- If WebSocket fails → REST API fallback
- If database query fails → Cached data

---

## 🔐 Security Notes

### For Development
- `.env` file is gitignored
- Never commit API keys
- Use environment variables

### For Production
- Enable HTTPS/WSS
- Add authentication (JWT/OAuth)
- Implement rate limiting
- Use connection pooling
- Enable CORS properly
- Add input validation

---

## 📞 Need Help?

### Common Questions

**Q: Can I use a different database?**
A: Yes, but you'll need to update Drizzle config for your database dialect.

**Q: Can I use a different AI model?**
A: Yes, replace the Gemini service with your preferred LLM API.

**Q: How do I add more service centers?**
A: Edit `shared/constants.ts` → `SERVICE_CENTERS` array.

**Q: How do I customize sentiment colors?**
A: Edit `shared/constants.ts` → `EMOTIONS` object.

**Q: Can I add more languages?**
A: Yes, extend `LANGUAGES` and `TRANSLATIONS` in `shared/constants.ts`.

---

## 🎉 You're All Set!

The application should now be running with:
- ✅ Real-time chat with sentiment analysis
- ✅ Predictive maintenance alerts
- ✅ Booking system
- ✅ Admin dashboard
- ✅ WebSocket communication

**Next Steps:**
1. Explore the customer interface
2. Test different conversation flows
3. Check the admin dashboard
4. Review the code structure
5. Customize for your needs

Happy coding! 🚀
