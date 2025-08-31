# 📱 Telegram Bot Setup Guide

## Step 1: Create Your Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start chat** with @BotFather
3. **Send** `/newbot` command
4. **Choose a name** for your bot (e.g., "My Sports Calendar Bot")
5. **Choose a username** ending in 'bot' (e.g., "mysportscalendarbot")
6. **Copy the token** you receive (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Start Your Bot

### Option A: Direct Command
```bash
node telegram-bot.js YOUR_TOKEN_HERE
```

### Option B: Environment Variable  
```bash
TELEGRAM_BOT_TOKEN=YOUR_TOKEN node telegram-bot.js
```

### Option C: Add to .env File
```bash
echo "TELEGRAM_BOT_TOKEN=YOUR_TOKEN" >> .env
node telegram-bot.js
```

## Step 3: Test Your Bot

1. **Find your bot** in Telegram (search for the username you chose)
2. **Start chat** with your bot
3. **Send** `/start` to begin
4. **Try commands:**
   - `/help` - Show all commands
   - `/sports` - Get sports calendar
   - `/tennis` - Tennis events only
   - `/football` - Football events only
   - `/customize` - Create custom events

## 📋 Available Commands

- **`/start`** - Welcome message and introduction
- **`/help`** - Show all available commands
- **`/sports`** - Get all sports events (tennis + football)
- **`/tennis`** - Tennis US Open events only  
- **`/football`** - Spanish La Liga events only
- **`/customize`** - Interactive custom event creation
- **`/test`** - Generate sample custom events

## 💬 Natural Language

You can also send regular messages:
- **"tennis finals"** → Tennis championship events only
- **"Barcelona Real Madrid"** → These teams only
- **"customize events"** → Start custom event creation
- **"sports calendar"** → All events

## 📅 What You'll Get

- **`.ics calendar files** sent directly to Telegram
- **Import into any calendar app** (Google, Apple, Outlook)
- **1-hour reminder alarms** included
- **Stadium locations** and event details
- **Custom events** with your own teams, dates, times

## 🔧 Troubleshooting

**Bot not responding?**
- Check your token is correct
- Make sure bot is running (check terminal)
- Try stopping and restarting: `Ctrl+C` then start again

**Invalid token error?**
- Get a new token from @BotFather
- Make sure you copied the full token
- No spaces or extra characters

**Can't find your bot?**
- Search for the exact username you chose
- Make sure username ends with 'bot'
- Try @yourbotusername in Telegram search

## ✨ Advantages Over WhatsApp

- ✅ **No QR code scanning** 
- ✅ **Instant setup** with token
- ✅ **File sharing** works perfectly
- ✅ **Commands menu** in chat
- ✅ **Always accessible** via @username
- ✅ **No phone required** - works on any device

Ready to use! 🚀