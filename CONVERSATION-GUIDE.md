# 🗣️ Conversational Sports Calendar Bot

**Exactly what you asked for!** An LLM that interviews you about your sports preferences and creates filtered calendar files.

## 🚀 Quick Start

### Step 1: Get API Keys

**Telegram Bot Token:**
1. Message @BotFather on Telegram
2. Send `/newbot`
3. Choose name and username
4. Copy token: `1234567890:ABCdefg...`

**OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create account/login
3. Create new key
4. Copy key: `sk-proj-abc123...`

### Step 2: Start Conversational Bot

```bash
# Clone repository
git clone https://github.com/danielafrimi/whatsapp-sports-calendar-bot.git
cd whatsapp-sports-calendar-bot
npm install

# Start conversational bot
node conversational-bot.js TELEGRAM_TOKEN OPENAI_KEY

# Or with environment variables
TELEGRAM_BOT_TOKEN=your_token OPENAI_API_KEY=your_key node conversational-bot.js
```

### Step 3: Chat with Your Bot

1. Find your bot in Telegram
2. Send `/start`
3. **Have a natural conversation!**

## 💬 Example Conversations

### **Conversation 1: Tennis Fan**
```
🤖 Bot: Hello! I'm your Personal Sports Calendar Assistant! 
       What sports events interest you?

😊 You: I love tennis

🤖 Bot: Awesome! Tennis is exciting! Are you interested in any 
       specific players or tournaments? I have US Open data 
       with Djokovic, Alcaraz, Medvedev, and Fritz.

😊 You: I really like Djokovic and finals

🤖 Bot: Perfect! So you want tennis events featuring Djokovic 
       and final matches. Let me create your personalized 
       calendar!

📅 Bot: [Sends tennis_djokovic_finals_2024.ics]
       ✅ Your calendar is ready! Filtered for tennis finals 
       and Djokovic matches!
```

### **Conversation 2: Football Fan**
```
😊 You: I want football events

🤖 Bot: Great choice! Are you interested in any particular 
       teams? I have Spanish La Liga with Real Madrid, 
       Barcelona, and Atlético Madrid.

😊 You: Barcelona and Real Madrid only, especially El Clasico

🤖 Bot: Excellent! Barcelona vs Real Madrid matches are the 
       best! I'll filter for just these two teams.

📅 Bot: [Sends football_barcelona_real_madrid_2024.ics]
       ✅ Your calendar includes all Barcelona and Real Madrid 
       matches!
```

### **Conversation 3: Multiple Preferences**
```
😊 You: I like tennis finals and football semifinals

🤖 Bot: Interesting mix! So you prefer the most important 
       matches. Any specific teams in football?

😊 You: Any top Spanish teams

🤖 Bot: Perfect! I'll create a calendar with tennis finals 
       and football semifinals from top Spanish teams 
       (Barcelona, Real Madrid, Atlético).

📅 Bot: [Sends tennis_football_finals_semifinals_2024.ics]
       ✅ Your premium sports calendar is ready!
```

## 🎯 What Makes This Special

### **🧠 Smart Conversation**
- **Natural language** - just talk normally
- **Follow-up questions** - bot clarifies your preferences  
- **Memory** - remembers what you said earlier
- **Intelligent filtering** - understands your intent

### **🎪 Flexible Filtering**
- **Sports:** tennis, football, basketball, etc.
- **Teams:** Barcelona, Real Madrid, Lakers, etc.
- **Players:** Djokovic, Alcaraz, Medvedev, etc.
- **Event Types:** finals, semifinals, championships
- **Tournaments:** US Open, La Liga, Champions League

### **📅 Perfect Calendar Output**
- **Personalized filename** based on your preferences
- **Custom description** with your specific interests
- **1-hour reminders** included
- **Stadium locations** and details
- **Compatible** with all calendar apps

## 🎨 Conversation Features

### **Bot Understands:**
- "I love tennis" → Asks about players/tournaments
- "Show me Barcelona games" → Asks about other teams
- "Just finals please" → Filters for championship matches
- "Djokovic and Alcaraz only" → Player-specific filtering
- "El Clasico matches" → Team rivalry understanding

### **Bot Asks Smart Questions:**
- "Any specific players interest you?"
- "Do you want all matches or just important ones?"
- "Which teams are your favorites?"
- "Are you interested in any particular tournaments?"

## 🔥 This is Exactly What You Wanted!

✅ **LLM conversation** - natural chat interface  
✅ **Asks about preferences** - sports, teams, players  
✅ **Smart filtering** - creates exactly what you want  
✅ **ICS file output** - ready for your calendar  
✅ **No complex menus** - just talk to it!  

**Ready to try your conversational sports assistant?** 🤖🏟️