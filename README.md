# WhatsApp Sports Calendar Bot 🏟️📅

WhatsApp bot that creates sports calendar files for Tennis US Open and Spanish La Liga matches with LLM chat integration.

## Quick Start 🚀

```bash
# Clone repository
git clone https://github.com/danielafrimi/whatsapp-sports-calendar-bot.git
cd whatsapp-sports-calendar-bot

# Install dependencies
npm install

# Setup bot
npm run setup

# Start bot
npm start
```

**Scan QR code with WhatsApp** → Send "sports calendar" → Get .ics file!

## Features ✨

- 🤖 **WhatsApp Integration** - Connect via QR code
- 🏟️ **Sports Calendar** - Tennis US Open + Spanish La Liga
- 💬 **LLM Chat** - AI-powered conversations (optional)
- 📅 **Calendar Files** - Generate .ics files for any calendar app
- ⚡ **Easy Setup** - One command installation

## Usage 📱

### Get Sports Calendar
Send any message containing:
- `sports` / `tennis` / `football` / `la liga` / `us open`

### Create Custom Events  
Send messages with:
- `calendar` / `event` / `meeting` / `appointment`

### Regular Chat
- Any other message triggers AI chat (if API key provided)

## Sports Events Included 🎾⚽

**Tennis US Open (Men's)**
- Semifinals (Alcaraz vs Medvedev, Djokovic vs Fritz)
- Final Championship Match

**Spanish La Liga**
- **Real Madrid** vs Athletic Bilbao, Villarreal
- **Barcelona** vs Girona, Sevilla  
- **Atlético Madrid** vs Real Sociedad, Real Betis

All events include:
- ⏰ 1-hour reminder alarms
- 📍 Stadium locations
- 📋 Match details

## File Locations 📁

```
whatsapp-sports-calendar-bot/
├── src/
│   ├── bot.js          # Main bot logic
│   └── calendar.js     # Calendar generation
├── scripts/
│   ├── setup.js        # Initial setup
│   └── create-calendar.js  # Generate calendar file
├── calendars/          # Generated .ics files
└── auth_info/          # WhatsApp session data
```

## Commands 🛠️

```bash
npm start              # Start WhatsApp bot
npm run setup         # Initial setup
npm run calendar      # Create calendar file directly
npm run dev           # Development mode (auto-restart)
```

## Setup Options ⚙️

### Basic Setup (Free)
- Works without API keys
- Sports calendars ✅
- Simple chat responses ✅

### Full Setup (AI Chat)
```bash
# Add to .env file
OPENAI_API_KEY=your_openai_api_key_here
```

## How to Find Files 📂

**Calendar files are saved to:**
- `./calendars/sports_calendar_YYYY-MM-DD.ics`
- Or use: `npm run calendar` to generate directly

**Original calendar location:**
- `/Users/dafrimi/sports_calendar.ics`

## GitHub Repository 🐙

```bash
# Initialize git repository
cd whatsapp-sports-calendar-bot
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/danielafrimi/whatsapp-sports-calendar-bot.git
git push -u origin main
```

## Import Calendar 📥

**Works with:**
- ✅ Google Calendar
- ✅ Apple Calendar  
- ✅ Microsoft Outlook
- ✅ Any calendar app supporting .ics

**How to import:**
1. Download .ics file from WhatsApp
2. Double-click file OR
3. Import manually in calendar app

## Dependencies 📦

- `@whiskeysockets/baileys` - WhatsApp Web API
- `ics` - Calendar file generation  
- `openai` - LLM chat (optional)
- `qrcode-terminal` - QR code display

## Troubleshooting 🔧

**Bot won't connect?**
- Delete `auth_info` folder
- Run `npm start` again
- Scan new QR code

**No calendar file?**
- Check `calendars/` directory
- Run `npm run calendar` directly

**Chat not working?**
- Add `OPENAI_API_KEY` to `.env` file
- Basic responses work without API key

## License 📄

MIT License - Feel free to use and modify!