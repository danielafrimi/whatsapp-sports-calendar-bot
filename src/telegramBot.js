const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');
const { createCalendarFile, createSportsCalendar, createCustomEventsCalendar } = require('./calendar');
const EventCustomizer = require('./eventCustomizer');
const fs = require('fs');
const path = require('path');

class TelegramSportsBot {
    constructor(token) {
        if (!token) {
            throw new Error('Telegram bot token is required! Get one from @BotFather on Telegram');
        }
        
        this.bot = new TelegramBot(token, { polling: true });
        this.eventCustomizer = new EventCustomizer();
        
        // Initialize OpenAI if available
        this.openai = process.env.OPENAI_API_KEY ? new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        }) : null;
        
        this.setupCommands();
        this.setupMessageHandlers();
        
        console.log('🤖 Telegram Sports Calendar Bot Started!');
        console.log(this.openai ? '✅ AI chat enabled' : '⚠️  AI chat disabled (no API key)');
        console.log('🛠️ Event customization enabled');
        console.log('📱 Bot is ready to receive messages!');
    }

    setupCommands() {
        // Set bot commands menu
        this.bot.setMyCommands([
            { command: 'start', description: 'Start the bot and see welcome message' },
            { command: 'help', description: 'Show help and available commands' },
            { command: 'sports', description: 'Get sports calendar (tennis + football)' },
            { command: 'tennis', description: 'Get tennis events only' },
            { command: 'football', description: 'Get football events only' },
            { command: 'customize', description: 'Create custom events step by step' },
            { command: 'test', description: 'Test custom events functionality' }
        ]);
    }

    setupMessageHandlers() {
        // Command handlers
        this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
        this.bot.onText(/\/help/, (msg) => this.handleHelp(msg));
        this.bot.onText(/\/sports/, (msg) => this.handleSportsCalendar(msg));
        this.bot.onText(/\/tennis/, (msg) => this.handleTennisFilter(msg));
        this.bot.onText(/\/football/, (msg) => this.handleFootballFilter(msg));
        this.bot.onText(/\/customize/, (msg) => this.handleCustomizeStart(msg));
        this.bot.onText(/\/test/, (msg) => this.handleTestCustomEvents(msg));

        // General message handler
        this.bot.on('message', (msg) => this.handleMessage(msg));

        // Error handler
        this.bot.on('polling_error', (error) => {
            console.error('❌ Telegram polling error:', error);
        });
    }

    async handleStart(msg) {
        const chatId = msg.chat.id;
        const welcomeText = `🏟️ **Welcome to Sports Calendar Bot!**

I can help you create sports calendars and custom events!

**Quick Commands:**
🎾 /tennis - Tennis US Open events
⚽ /football - Spanish La Liga events  
🏟️ /sports - All sports events
🛠️ /customize - Create your own events
❓ /help - Show all commands

**Examples:**
• Send "tennis finals" → Tennis championships only
• Send "Barcelona Real Madrid" → These teams only
• Send "customize events" → Step-by-step event creation

Try sending me a message or use the commands! 📱`;

        await this.bot.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown' });
    }

    async handleHelp(msg) {
        const chatId = msg.chat.id;
        const helpText = `🤖 **Sports Calendar Bot Help**

**📅 Pre-made Calendars:**
• /sports - All events (tennis + football)
• /tennis - Tennis US Open men's events only
• /football - Spanish La Liga (Real Madrid, Barcelona, Atlético)

**🛠️ Custom Event Creation:**
• /customize - Interactive event creator
• Send "customize events" or "create event"

**🎯 Smart Filtering:**
• "tennis finals" → Championship matches only
• "Barcelona Real Madrid" → These teams only  
• "basketball Lakers" → Basketball events

**📱 How it works:**
1. Send a command or message
2. Get a .ics calendar file
3. Import to Google Calendar, Apple Calendar, etc.

**🔧 Testing:**
• /test - Generate sample custom events

All calendar files include:
✅ 1-hour reminder alarms
✅ Stadium locations  
✅ Event details
✅ Compatible with all calendar apps

Just send me what sports you want! 🏟️`;

        await this.bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
    }

    async handleSportsCalendar(msg) {
        const chatId = msg.chat.id;
        
        try {
            await this.bot.sendMessage(chatId, '🏟️ Creating sports calendar...');
            
            const calendarData = createSportsCalendar();
            const filename = `sports_calendar_${new Date().toISOString().split('T')[0]}.ics`;
            const filepath = this.saveCalendarFile(calendarData, filename);
            
            await this.bot.sendDocument(chatId, filepath, {
                caption: `✅ **Sports Calendar Created!**

🎾 **Tennis US Open (Men's):**
• Semifinals (Alcaraz vs Medvedev, Djokovic vs Fritz)
• Final Championship Match

⚽ **Spanish La Liga:**
• Real Madrid vs Athletic Bilbao, Villarreal  
• Barcelona vs Girona, Sevilla
• Atlético Madrid vs Real Sociedad, Real Betis

📱 Import this file into your calendar app!`,
                parse_mode: 'Markdown'
            });
            
            // Clean up file
            this.cleanupFile(filepath);
            
        } catch (error) {
            console.error('Sports calendar error:', error);
            await this.bot.sendMessage(chatId, '❌ Error creating sports calendar. Please try again.');
        }
    }

    async handleTennisFilter(msg) {
        const chatId = msg.chat.id;
        
        try {
            await this.bot.sendMessage(chatId, '🎾 Creating tennis calendar...');
            
            const filter = {
                sports: ['tennis'],
                tournaments: ['US Open'],
                filename: 'tennis_us_open_events',
                summary: '🎾 Tennis US Open (Men\'s events)'
            };
            
            const calendarData = createSportsCalendar(filter);
            const filename = `tennis_events_${new Date().toISOString().split('T')[0]}.ics`;
            const filepath = this.saveCalendarFile(calendarData, filename);
            
            await this.bot.sendDocument(chatId, filepath, {
                caption: `✅ **Tennis Calendar Created!**

🎾 **US Open Men's Events:**
• Semifinal 1: Alcaraz vs Medvedev
• Semifinal 2: Djokovic vs Fritz
• Final Championship Match

📅 All events at Arthur Ashe Stadium
🔔 1-hour reminder alarms included

📱 Import to your calendar app!`,
                parse_mode: 'Markdown'
            });
            
            this.cleanupFile(filepath);
            
        } catch (error) {
            console.error('Tennis calendar error:', error);
            await this.bot.sendMessage(chatId, '❌ Error creating tennis calendar. Please try again.');
        }
    }

    async handleFootballFilter(msg) {
        const chatId = msg.chat.id;
        
        try {
            await this.bot.sendMessage(chatId, '⚽ Creating football calendar...');
            
            const filter = {
                sports: ['football'],
                tournaments: ['La Liga'],
                teams: ['Real Madrid', 'Barcelona', 'Atletico Madrid'],
                filename: 'la_liga_top_teams',
                summary: '⚽ Spanish La Liga (Top 3 teams)'
            };
            
            const calendarData = createSportsCalendar(filter);
            const filename = `football_events_${new Date().toISOString().split('T')[0]}.ics`;
            const filepath = this.saveCalendarFile(calendarData, filename);
            
            await this.bot.sendDocument(chatId, filepath, {
                caption: `✅ **Football Calendar Created!**

⚽ **Spanish La Liga:**
• **Real Madrid** vs Athletic Bilbao, Villarreal
• **Barcelona** vs Girona, Sevilla  
• **Atlético Madrid** vs Real Sociedad, Real Betis

🏟️ Matches at home stadiums
🔔 1-hour reminder alarms included

📱 Import to your calendar app!`,
                parse_mode: 'Markdown'
            });
            
            this.cleanupFile(filepath);
            
        } catch (error) {
            console.error('Football calendar error:', error);
            await this.bot.sendMessage(chatId, '❌ Error creating football calendar. Please try again.');
        }
    }

    async handleCustomizeStart(msg) {
        const chatId = msg.chat.id;
        
        const customizationResult = this.eventCustomizer.startCustomizationSession(chatId.toString(), msg.text);
        await this.bot.sendMessage(chatId, customizationResult.message, { parse_mode: 'Markdown' });
    }

    async handleTestCustomEvents(msg) {
        const chatId = msg.chat.id;
        
        try {
            await this.bot.sendMessage(chatId, '🧪 Generating test custom events...');
            
            // Sample custom events
            const customEvents = [
                {
                    sport: 'football',
                    title: 'El Clasico - Barcelona vs Real Madrid',
                    date: '2024-10-26',
                    time: '21:00',
                    location: 'Camp Nou, Barcelona',
                    description: 'Custom El Clasico match\\nCreated by Telegram bot'
                },
                {
                    sport: 'tennis',
                    title: 'Djokovic vs Alcaraz Exhibition',
                    date: '2024-11-15',
                    time: '19:00',
                    location: 'Rod Laver Arena, Melbourne',
                    description: 'Custom tennis exhibition\\nCreated by Telegram bot'
                }
            ];
            
            const calendarData = createCustomEventsCalendar(customEvents);
            const filename = `test_custom_events_${new Date().toISOString().split('T')[0]}.ics`;
            const filepath = this.saveCalendarFile(calendarData, filename);
            
            await this.bot.sendDocument(chatId, filepath, {
                caption: `✅ **Test Custom Events Created!**

🏟️ **Sample Events:**
1. **El Clasico** - Oct 26, 9:00 PM
   📍 Camp Nou, Barcelona
   
2. **Tennis Exhibition** - Nov 15, 7:00 PM  
   📍 Rod Laver Arena, Melbourne

🛠️ Want to create your own? Use /customize

📱 Import this file to test calendar integration!`,
                parse_mode: 'Markdown'
            });
            
            this.cleanupFile(filepath);
            
        } catch (error) {
            console.error('Test custom events error:', error);
            await this.bot.sendMessage(chatId, '❌ Error creating test events. Please try again.');
        }
    }

    async handleMessage(msg) {
        // Skip if it's a command (already handled)
        if (msg.text && msg.text.startsWith('/')) return;
        
        const chatId = msg.chat.id;
        const messageText = msg.text;
        
        if (!messageText) return;
        
        console.log(`📨 Message from ${chatId}: ${messageText}`);
        
        try {
            // Check for custom event creation
            const customizationResult = await this.eventCustomizer.parseCustomEvent(messageText, chatId.toString());
            if (customizationResult) {
                await this.handleCustomization(chatId, customizationResult);
                return;
            }

            // Check for sports requests
            if (this.isSportsRequest(messageText)) {
                await this.handleSportsMessage(chatId, messageText);
                return;
            }

            // Check for calendar requests
            if (this.isCalendarRequest(messageText)) {
                await this.handleCalendarMessage(chatId, messageText);
                return;
            }

            // Regular chat
            await this.handleChat(chatId, messageText);
            
        } catch (error) {
            console.error('❌ Message handling error:', error);
            await this.bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again or use /help for commands.');
        }
    }

    async handleCustomization(chatId, customizationResult) {
        const { type, message, events } = customizationResult;

        if (type === 'customization_complete' && events) {
            try {
                const calendarData = createCustomEventsCalendar(events);
                const filename = `custom_events_${new Date().toISOString().split('T')[0]}.ics`;
                const filepath = this.saveCalendarFile(calendarData, filename);
                
                await this.bot.sendDocument(chatId, filepath, {
                    caption: `${message}

📱 Import this custom calendar file into your calendar app!`,
                    parse_mode: 'Markdown'
                });
                
                this.cleanupFile(filepath);
                
            } catch (error) {
                console.error('Custom calendar error:', error);
                await this.bot.sendMessage(chatId, '❌ Error creating custom calendar. Please try again.');
            }
        } else {
            await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        }
    }

    async handleSportsMessage(chatId, messageText) {
        await this.bot.sendMessage(chatId, '🏟️ Analyzing your sports preferences...');

        try {
            const sportsFilter = await this.extractSportsFilter(messageText);
            const calendarData = createSportsCalendar(sportsFilter);
            const filename = `${sportsFilter.filename || 'sports_events'}_${new Date().toISOString().split('T')[0]}.ics`;
            const filepath = this.saveCalendarFile(calendarData, filename);
            
            await this.bot.sendDocument(chatId, filepath, {
                caption: `✅ **Custom Sports Calendar Created!**

${sportsFilter.summary}

📱 Import to your calendar app!`,
                parse_mode: 'Markdown'
            });
            
            this.cleanupFile(filepath);
            
        } catch (error) {
            console.error('Sports message error:', error);
            await this.bot.sendMessage(chatId, '❌ Error creating sports calendar. Try: "tennis matches" or "football Barcelona"');
        }
    }

    async handleCalendarMessage(chatId, messageText) {
        await this.bot.sendMessage(chatId, '📅 Creating calendar event...');

        try {
            const eventDetails = await this.extractEventDetails(messageText);
            const calendarData = createCalendarFile(eventDetails);
            const filename = `${eventDetails.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
            const filepath = this.saveCalendarFile(calendarData, filename);
            
            await this.bot.sendDocument(chatId, filepath, {
                caption: `✅ **Event Created!**

📋 **${eventDetails.title}**
📅 ${eventDetails.date} at ${eventDetails.time}
📍 ${eventDetails.location}

📱 Import to your calendar app!`,
                parse_mode: 'Markdown'
            });
            
            this.cleanupFile(filepath);
            
        } catch (error) {
            console.error('Calendar message error:', error);
            await this.bot.sendMessage(chatId, '❌ Please specify: event name, date, time, location\\nExample: "Meeting tomorrow 2pm at office"');
        }
    }

    async handleChat(chatId, messageText) {
        if (!this.openai) {
            const responses = [
                "Hello! I can create sports calendars and custom events. Try:\\n• /sports → Get all events\\n• /customize → Create custom events\\n• \"tennis finals\" → Tennis events only",
                "Hi! I specialize in sports calendars. Use:\\n• /tennis → Tennis events\\n• /football → Football events\\n• \"Barcelona Real Madrid\" → These teams only",
                "Hey! Send me sports requests like:\\n• \"tennis US Open\"\\n• \"football La Liga\"\\n• /customize to create custom events"
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            await this.bot.sendMessage(chatId, response);
            return;
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful sports and calendar assistant on Telegram. Keep responses brief and suggest creating sports calendars when relevant. Mention available commands like /sports, /tennis, /football, /customize."
                    },
                    { role: "user", content: messageText }
                ],
                max_tokens: 200
            });

            await this.bot.sendMessage(chatId, response.choices[0].message.content);
        } catch (error) {
            await this.bot.sendMessage(chatId, "I can help with sports calendars! Try /sports for events or /customize to create your own.");
        }
    }

    // Helper methods (simplified versions of WhatsApp bot methods)
    isSportsRequest(text) {
        const keywords = ['tennis', 'football', 'soccer', 'basketball', 'sports', 
                         'match', 'game', 'tournament', 'league', 'us open', 'la liga'];
        return keywords.some(keyword => text.toLowerCase().includes(keyword));
    }

    isCalendarRequest(text) {
        const keywords = ['calendar', 'event', 'schedule', 'appointment', 'meeting'];
        return keywords.some(keyword => text.toLowerCase().includes(keyword)) && 
               !this.isSportsRequest(text);
    }

    async extractSportsFilter(messageText) {
        // Simplified version - can be enhanced with LLM
        const text = messageText.toLowerCase();
        const filter = {
            sports: [],
            teams: [],
            tournaments: [],
            keywords: [],
            filename: 'sports_events',
            summary: '🏟️ Mixed sports events'
        };

        if (text.includes('tennis')) filter.sports.push('tennis');
        if (text.includes('football') || text.includes('soccer')) filter.sports.push('football');
        if (text.includes('basketball')) filter.sports.push('basketball');

        if (text.includes('barcelona')) filter.teams.push('Barcelona');
        if (text.includes('real madrid') || text.includes('madrid')) filter.teams.push('Real Madrid');
        if (text.includes('atletico')) filter.teams.push('Atletico Madrid');

        if (text.includes('final')) filter.keywords.push('final');
        if (text.includes('semifinal')) filter.keywords.push('semifinal');

        if (filter.sports.length > 0) {
            filter.summary = `🏟️ ${filter.sports.join(', ')} events`;
            filter.filename = filter.sports.join('_') + '_events';
        }
        if (filter.teams.length > 0) {
            filter.summary += `\\n⭐ Teams: ${filter.teams.join(', ')}`;
        }

        return filter;
    }

    async extractEventDetails(messageText) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return {
            title: messageText.includes('meeting') ? 'Meeting' : 'Event',
            date: tomorrow.toISOString().split('T')[0],
            time: '10:00',
            location: 'TBD',
            description: messageText
        };
    }

    saveCalendarFile(calendarData, filename) {
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const filepath = path.join(tempDir, filename);
        fs.writeFileSync(filepath, calendarData);
        return filepath;
    }

    cleanupFile(filepath) {
        setTimeout(() => {
            try {
                fs.unlinkSync(filepath);
            } catch (error) {
                // Ignore cleanup errors
            }
        }, 30000); // Clean up after 30 seconds
    }
}

module.exports = TelegramSportsBot;