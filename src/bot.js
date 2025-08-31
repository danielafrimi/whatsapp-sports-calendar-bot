const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const OpenAI = require('openai');
const { createCalendarFile, createSportsCalendar } = require('./calendar');

class WhatsAppSportsBot {
    constructor() {
        this.openai = process.env.OPENAI_API_KEY ? new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        }) : null;
        
        console.log('🤖 WhatsApp Sports Calendar Bot');
        console.log(this.openai ? '✅ AI chat enabled' : '⚠️  AI chat disabled (no API key)');
    }

    async start() {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info');
        
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
        });

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log('\n📱 Scan this QR code with WhatsApp:');
            }
            
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    console.log('🔄 Reconnecting...');
                    this.start();
                }
            } else if (connection === 'open') {
                console.log('✅ Bot connected to WhatsApp!');
                console.log('💡 Send messages to interact with the bot');
            }
        });

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('messages.upsert', async (m) => this.handleMessages(sock, m));
    }

    async handleMessages(sock, m) {
        const message = m.messages[0];
        if (!message.message || message.key.fromMe) return;

        const messageText = message.message.conversation || 
                           message.message.extendedTextMessage?.text;
        
        if (!messageText) return;

        const chatId = message.key.remoteJid;
        console.log(`📨 ${messageText}`);

        try {
            // Determine intent
            if (this.isCalendarRequest(messageText)) {
                await this.handleCalendarRequest(sock, chatId, messageText);
            } else if (this.isSportsRequest(messageText)) {
                await this.handleSportsCalendar(sock, chatId, messageText);
            } else {
                await this.handleChat(sock, chatId, messageText);
            }
        } catch (error) {
            console.error('❌ Error:', error);
            await sock.sendMessage(chatId, { 
                text: 'Sorry, something went wrong. Please try again.' 
            });
        }
    }

    isCalendarRequest(text) {
        const keywords = ['calendar', 'event', 'schedule', 'appointment', 'meeting'];
        return keywords.some(keyword => text.toLowerCase().includes(keyword));
    }

    isSportsRequest(text) {
        const keywords = ['tennis', 'football', 'soccer', 'basketball', 'sports', 
                         'match', 'game', 'tournament', 'league', 'us open', 'la liga'];
        return keywords.some(keyword => text.toLowerCase().includes(keyword));
    }

    async handleSportsCalendar(sock, chatId, messageText) {
        await sock.sendMessage(chatId, { text: '🏟️ Analyzing your sports preferences...' });

        try {
            // Use LLM to extract sports filters from message
            const sportsFilter = await this.extractSportsFilter(messageText);
            
            // Generate filtered calendar
            const calendarData = createSportsCalendar(sportsFilter);
            
            await sock.sendMessage(chatId, {
                document: Buffer.from(calendarData),
                fileName: `${sportsFilter.filename || 'sports_events'}.ics`,
                mimetype: 'text/calendar'
            });

            await sock.sendMessage(chatId, { 
                text: `✅ Custom sports calendar created!\n\n${sportsFilter.summary}\n\n📱 Import to your calendar app!` 
            });

        } catch (error) {
            console.error('Sports calendar error:', error);
            await sock.sendMessage(chatId, { 
                text: '❌ Error creating sports calendar. Try: "tennis matches" or "football Barcelona Real Madrid"' 
            });
        }
    }

    async handleCalendarRequest(sock, chatId, messageText) {
        await sock.sendMessage(chatId, { text: '📅 Creating calendar event...' });

        try {
            const eventDetails = await this.extractEventDetails(messageText);
            const calendarData = createCalendarFile(eventDetails);
            
            await sock.sendMessage(chatId, {
                document: Buffer.from(calendarData),
                fileName: `${eventDetails.title.replace(/[^a-z0-9]/gi, '_')}.ics`,
                mimetype: 'text/calendar'
            });

            await sock.sendMessage(chatId, { 
                text: `✅ Event created!\n📋 ${eventDetails.title}\n📅 ${eventDetails.date} at ${eventDetails.time}` 
            });

        } catch (error) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please specify: event name, date, time, location\nExample: "Meeting tomorrow 2pm at office"' 
            });
        }
    }

    async handleChat(sock, chatId, messageText) {
        if (!this.openai) {
            const responses = [
                "Hello! I can help you create sports calendars and events. Try asking about tennis or football!",
                "Hi there! Send me 'sports calendar' to get tennis and football events.",
                "Hey! I specialize in creating calendar files for sports events. What do you need?"
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            await sock.sendMessage(chatId, { text: response });
            return;
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful sports and calendar assistant. Keep responses brief and suggest creating sports calendars when relevant."
                    },
                    { role: "user", content: messageText }
                ],
                max_tokens: 300
            });

            await sock.sendMessage(chatId, { 
                text: response.choices[0].message.content 
            });
        } catch (error) {
            await sock.sendMessage(chatId, { 
                text: "I can help with sports calendars! Try asking about tennis or football events." 
            });
        }
    }

    async extractSportsFilter(messageText) {
        if (!this.openai) {
            // Fallback without LLM
            return this.parseSimpleSportsFilter(messageText);
        }

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system", 
                        content: `Extract sports preferences and return JSON:
{
  "sports": ["tennis", "football", "basketball"],
  "teams": ["Barcelona", "Real Madrid", "Lakers"],
  "tournaments": ["US Open", "La Liga", "NBA"],
  "keywords": ["final", "champions"],
  "filename": "suggested_filename",
  "summary": "Brief description of included events"
}

Available options:
Sports: tennis, football/soccer, basketball, american-football, hockey, baseball
Teams: Barcelona, Real Madrid, Atletico Madrid, Lakers, Warriors, etc.
Tournaments: US Open, La Liga, NBA, NFL, Champions League, etc.`
                    },
                    { role: "user", content: messageText }
                ],
                max_tokens: 300
            });

            const jsonStr = response.choices[0].message.content.trim();
            const filter = JSON.parse(jsonStr);
            
            return this.validateSportsFilter(filter);

        } catch (error) {
            console.error('LLM sports filter error:', error);
            return this.parseSimpleSportsFilter(messageText);
        }
    }

    parseSimpleSportsFilter(messageText) {
        const text = messageText.toLowerCase();
        const filter = {
            sports: [],
            teams: [],
            tournaments: [],
            keywords: [],
            filename: 'sports_events',
            summary: '🏟️ Mixed sports events'
        };

        // Detect sports
        if (text.includes('tennis')) filter.sports.push('tennis');
        if (text.includes('football') || text.includes('soccer')) filter.sports.push('football');
        if (text.includes('basketball')) filter.sports.push('basketball');
        if (text.includes('hockey')) filter.sports.push('hockey');

        // Detect teams
        if (text.includes('barcelona') || text.includes('barca')) filter.teams.push('Barcelona');
        if (text.includes('real madrid') || text.includes('madrid')) filter.teams.push('Real Madrid');
        if (text.includes('atletico') || text.includes('atlético')) filter.teams.push('Atletico Madrid');
        if (text.includes('lakers')) filter.teams.push('Lakers');

        // Detect tournaments
        if (text.includes('us open')) filter.tournaments.push('US Open');
        if (text.includes('la liga')) filter.tournaments.push('La Liga');
        if (text.includes('champions league')) filter.tournaments.push('Champions League');

        // Generate summary
        if (filter.sports.length > 0) {
            filter.summary = `🏟️ ${filter.sports.join(', ')} events`;
            filter.filename = filter.sports.join('_') + '_events';
        }
        if (filter.teams.length > 0) {
            filter.summary += `\n⭐ Teams: ${filter.teams.join(', ')}`;
        }

        return filter;
    }

    validateSportsFilter(filter) {
        return {
            sports: filter.sports || [],
            teams: filter.teams || [],
            tournaments: filter.tournaments || [],
            keywords: filter.keywords || [],
            filename: filter.filename || 'custom_sports_events',
            summary: filter.summary || '🏟️ Custom sports calendar'
        };
    }

    async extractEventDetails(messageText) {
        // Simple parsing (you can enhance with LLM)
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
}

// Start bot
if (require.main === module) {
    const bot = new WhatsAppSportsBot();
    bot.start().catch(console.error);
}

module.exports = WhatsAppSportsBot;