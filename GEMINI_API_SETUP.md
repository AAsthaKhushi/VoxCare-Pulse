# Getting a Gemini API Key

The VoxCare Pulse application uses Google's Gemini AI for intelligent sentiment analysis and conversational responses.

## Current Status

⚠️ **The API key in your `.env` file is currently invalid or expired.**

The application is working with **fallback mode** using:
- ✅ Keyword-based sentiment detection
- ✅ Pre-programmed responses based on emotion
- ✅ All chat functionality still works

## Getting a FREE Gemini API Key

### Step 1: Visit Google AI Studio
Go to: **https://aistudio.google.com/app/apikey**

### Step 2: Sign in with Google Account
Use any Google account (Gmail, Google Workspace, etc.)

### Step 3: Create API Key
1. Click **"Create API Key"**
2. Select **"Create API key in new project"** (or use existing project)
3. Copy the generated API key (starts with `AIza...`)

### Step 4: Update Your .env File
1. Open `.env` file in the project root
2. Replace the current `GEMINI_API_KEY` value with your new key:
   ```
   GEMINI_API_KEY=YOUR_NEW_KEY_HERE
   ```
3. Save the file

### Step 5: Restart the Server
```powershell
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## API Key Features

With a valid Gemini API key, you get:
- 🤖 **Advanced AI sentiment analysis** - More accurate emotion detection
- 💬 **Intelligent conversational responses** - Context-aware AI replies
- 🎯 **Booking intent extraction** - Smart detection of service booking requests
- 🌍 **Multi-language support** - Better responses in Hindi and English
- 📊 **Higher confidence scores** - More reliable sentiment metrics

## Free Tier Limits

Google Gemini API free tier includes:
- ✅ 15 requests per minute (RPM)
- ✅ 1 million tokens per minute (TPM)
- ✅ 1,500 requests per day (RPD)

**This is more than enough for testing and demonstrations!**

## Without API Key (Current Fallback Mode)

The application still works without Gemini:
- Sentiment detection using keyword matching
- Pre-defined responses for different emotions
- Basic booking intent detection
- All UI features fully functional

## Troubleshooting

### "PERMISSION_DENIED" Error
- API key is invalid, expired, or not activated
- Get a new key from https://aistudio.google.com/app/apikey
- Make sure to enable the Gemini API in your Google Cloud project

### Key Not Working After Update
1. Check for extra spaces or quotes in `.env` file
2. Restart the development server completely
3. Verify the key starts with `AIza`

### Rate Limit Errors
- Free tier: 15 requests/minute
- Wait 1 minute and try again
- Consider spacing out chat messages

## Links

- 🔑 **Get API Key**: https://aistudio.google.com/app/apikey
- 📚 **Gemini Docs**: https://ai.google.dev/docs
- 💰 **Pricing**: https://ai.google.dev/pricing (Free tier available!)

---

**Note**: The fallback mode is intentionally built-in so the application works perfectly even without an API key. For demonstrations and testing, you can use the app as-is!
