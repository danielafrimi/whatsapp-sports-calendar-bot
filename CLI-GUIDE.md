# 💻 Command Line Sports Calendar Generator

**Super Simple!** No bots, no tokens, no setup - just run commands and get calendar files!

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/danielafrimi/whatsapp-sports-calendar-bot.git
cd whatsapp-sports-calendar-bot
npm install

# Generate calendars instantly!
node quick-sports.js all        # All sports events
node quick-sports.js tennis     # Tennis only  
node quick-sports.js barcelona  # Barcelona only
```

## ⚡ Quick Commands

### **One-Line Calendar Generation:**

```bash
# All sports (tennis + football)
node quick-sports.js all

# Tennis US Open only
node quick-sports.js tennis

# Spanish football only  
node quick-sports.js football

# Specific teams
node quick-sports.js barcelona
node quick-sports.js realmadrid

# Finals/championships only
node quick-sports.js finals

# Sample custom events
node quick-sports.js sample
```

### **Interactive Menu System:**

```bash
# Run interactive CLI with menus
node sports-cli.js

# Or use npm shortcut
npm run cli
```

**Interactive Menu Options:**
1. 🏟️ All Sports (Tennis + Football)
2. 🎾 Tennis Only (US Open)
3. ⚽ Football Only (Spanish La Liga)  
4. 🛠️ Custom Events (step-by-step creator)
5. ❓ Help
6. 🚪 Exit

## 📁 Output

**All files saved to:** `./calendars/`

**Example files generated:**
- `all_sports_2025-09-01.ics` - All events
- `tennis_2025-09-01.ics` - Tennis events only
- `barcelona_2025-09-01.ics` - Barcelona matches
- `finals_2025-09-01.ics` - Championship matches only

## 📅 What's Included

### **🎾 Tennis US Open (Men's)**
- **Semifinals:**
  - Alcaraz vs Medvedev
  - Djokovic vs Fritz
- **Final:** Championship Match
- **Location:** Arthur Ashe Stadium, New York

### **⚽ Spanish La Liga**
- **Real Madrid** matches (vs Athletic Bilbao, Villarreal)
- **Barcelona** matches (vs Girona, Sevilla)
- **Atlético Madrid** matches (vs Real Sociedad, Real Betis)
- **Locations:** Home stadiums (Bernabéu, Camp Nou, Metropolitano)

## 🛠️ Custom Events

**Interactive custom event creation:**
```bash
node sports-cli.js

# Choose option 4: Custom Events
# Follow prompts:
# - Event title: "Lakers vs Warriors"
# - Sport: "basketball"  
# - Date: "2024-12-01" or "tomorrow"
# - Time: "8pm" or "20:00"
# - Location: "Staples Center"
```

## 💡 Examples

```bash
# Get all sports events
node quick-sports.js all
# Output: calendars/all_sports_2025-09-01.ics

# Just tennis 
node quick-sports.js tennis  
# Output: calendars/tennis_2025-09-01.ics

# Only Barcelona matches
node quick-sports.js barcelona
# Output: calendars/barcelona_2025-09-01.ics

# Interactive mode with custom events
node sports-cli.js
# Follow menu prompts
```

## 📱 Using Calendar Files

1. **Double-click** any `.ics` file
2. **Opens in your default calendar app**
3. **Or manually import:**
   - **Google Calendar:** Settings → Import & Export → Import
   - **Apple Calendar:** File → Import → Select file  
   - **Outlook:** File → Import/Export → Select file

## ✨ Features

- ✅ **No setup required** - works immediately
- ✅ **No API keys needed** - everything runs locally
- ✅ **Multiple output options** - quick commands or interactive
- ✅ **Smart filtering** - by sport, team, event type
- ✅ **Custom events** - create your own
- ✅ **1-hour reminders** - included in all events
- ✅ **Stadium locations** - real venues included
- ✅ **Compatible** - works with all calendar apps

## 🎯 Perfect For

- ✅ **Quick calendar generation** - one command, get file
- ✅ **Specific team following** - just your favorite teams
- ✅ **Event filtering** - finals only, specific sports
- ✅ **Custom scheduling** - add your own events
- ✅ **No internet required** - works offline

**This is the simplest way to get sports calendars!** 🚀