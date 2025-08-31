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
        await sock.sendMessage(chatId, { text: '🏟️ Creating sports calendar...' });

        try {
            const calendarData = createSportsCalendar();
            
            await sock.sendMessage(chatId, {
                document: Buffer.from(calendarData),
                fileName: 'sports_events.ics',
                mimetype: 'text/calendar'
            });

            await sock.sendMessage(chatId, { 
                text: '✅ Sports calendar created!\n\n🎾 Tennis US Open (Men)\n⚽ La Liga (Real Madrid, Barcelona, Atlético)\n\n📱 Import to your calendar app!' 
            });

        } catch (error) {
            await sock.sendMessage(chatId, { 
                text: '❌ Error creating sports calendar. Try again later.' 
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