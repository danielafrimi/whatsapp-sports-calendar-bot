const TelegramBot = require('node-telegram-bot-api');
const OpenAI = require('openai');
const { createSportsCalendar, createCustomEventsCalendar } = require('./calendar');
const fs = require('fs');
const path = require('path');

class ConversationalSportsBot {
    constructor(token, openaiKey) {
        if (!token) {
            throw new Error('Telegram bot token required!');
        }
        if (!openaiKey) {
            throw new Error('OpenAI API key required for conversational features!');
        }
        
        this.bot = new TelegramBot(token, { polling: true });
        this.openai = new OpenAI({ apiKey: openaiKey });
        
        // Store user conversation states
        this.userSessions = new Map();
        
        this.setupMessageHandlers();
        
        console.log('🤖 Conversational Sports Bot Started!');
        console.log('✅ AI conversation enabled');
        console.log('🎯 Smart filtering enabled');
        console.log('📱 Ready for natural conversations!');
    }

    setupMessageHandlers() {
        // Start command
        this.bot.onText(/\/start/, (msg) => this.handleStart(msg));
        
        // All other messages go through conversational flow
        this.bot.on('message', (msg) => {
            if (msg.text && !msg.text.startsWith('/start')) {
                this.handleConversation(msg);
            }
        });

        this.bot.on('polling_error', (error) => {
            console.error('❌ Telegram polling error:', error);
        });
    }

    async handleStart(msg) {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        // Reset user session
        this.userSessions.set(userId, {
            stage: 'greeting',
            preferences: {},
            conversationHistory: []
        });

        const welcomeText = `🏟️ **Hello! I'm your Personal Sports Calendar Assistant!**

I'll have a conversation with you to understand exactly what sports events you want, then create a perfect calendar file for you.

**I can help you filter by:**
🎾 **Sports:** Tennis, Football, Basketball, etc.
⭐ **Teams/Players:** Barcelona, Djokovic, Lakers, etc.  
🏆 **Tournaments:** US Open, La Liga, Champions League, etc.
🎯 **Event Types:** Finals, semifinals, regular matches, etc.
📅 **Dates:** This week, next month, specific dates, etc.

**Just tell me what sports events interest you!** 

For example:
• "I want tennis events"
• "Show me Barcelona and Real Madrid matches"  
• "I like basketball, especially Lakers games"
• "Give me tennis finals and football semifinals"

What sports are you interested in? 🤔`;

        await this.bot.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown' });
    }

    async handleConversation(msg) {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const messageText = msg.text;

        console.log(`💬 ${userId}: ${messageText}`);

        try {
            // Get or create user session
            let session = this.userSessions.get(userId);
            if (!session) {
                session = {
                    stage: 'collecting_preferences',
                    preferences: {},
                    conversationHistory: []
                };
                this.userSessions.set(userId, session);
            }

            // Add message to conversation history
            session.conversationHistory.push({
                role: 'user',
                content: messageText,
                timestamp: new Date()
            });

            // Send typing indicator
            await this.bot.sendChatAction(chatId, 'typing');

            // Process conversation with AI
            const response = await this.processConversationWithAI(session, messageText);
            
            // Send AI response
            await this.bot.sendMessage(chatId, response.message, { parse_mode: 'Markdown' });

            // Add AI response to history
            session.conversationHistory.push({
                role: 'assistant', 
                content: response.message,
                timestamp: new Date()
            });

            // Check if ready to generate calendar
            if (response.readyToGenerate) {
                await this.generateFilteredCalendar(chatId, session.preferences);
                
                // Ask if they want another calendar
                await this.bot.sendMessage(chatId, 
                    "🎯 Would you like to create another calendar with different preferences? Just tell me what else interests you!"
                );
            }

        } catch (error) {
            console.error('❌ Conversation error:', error);
            await this.bot.sendMessage(chatId, 
                "Sorry, I had trouble understanding that. Could you rephrase what sports events you're interested in?"
            );
        }
    }

    async processConversationWithAI(session, messageText) {
        const systemPrompt = `You are a helpful sports calendar assistant. Your job is to have a natural conversation with users to understand their sports preferences, then help them create personalized calendar files.

CURRENT USER PREFERENCES: ${JSON.stringify(session.preferences)}

CONVERSATION GOALS:
1. Understand what sports they like (tennis, football, basketball, etc.)
2. Which specific teams/players interest them
3. What types of events (finals, all matches, specific tournaments)
4. Any date preferences
5. When you have enough info, offer to create their calendar

AVAILABLE SPORTS DATA:
- Tennis: US Open (Alcaraz, Medvedev, Djokovic, Fritz - semifinals and finals)
- Football: Spanish La Liga (Real Madrid, Barcelona, Atlético Madrid matches)

RESPONSE STYLE:
- Be conversational and friendly
- Ask follow-up questions to clarify preferences  
- Show enthusiasm about their interests
- When you have enough info, summarize and offer to create calendar
- Keep responses concise (2-3 sentences max)

DETERMINE IF READY:
If user has specified enough preferences (sport + teams/tournaments OR specific interests), set readyToGenerate: true in your response.

Respond in JSON format:
{
  "message": "Your conversational response in Markdown",
  "preferences": {
    "sports": ["tennis", "football"],
    "teams": ["Barcelona", "Real Madrid"],
    "tournaments": ["US Open", "La Liga"],
    "eventTypes": ["finals", "semifinals"],
    "keywords": ["championship"]
  },
  "readyToGenerate": false/true
}`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...session.conversationHistory.slice(-10), // Last 10 messages for context
            { role: 'user', content: messageText }
        ];

        const completion = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages,
            max_tokens: 300,
            temperature: 0.7
        });

        const responseText = completion.choices[0].message.content.trim();
        
        try {
            const response = JSON.parse(responseText);
            
            // Update session preferences
            if (response.preferences) {
                session.preferences = { ...session.preferences, ...response.preferences };
            }
            
            return response;
        } catch (parseError) {
            // Fallback if JSON parsing fails
            return {
                message: responseText,
                preferences: session.preferences,
                readyToGenerate: false
            };
        }
    }

    async generateFilteredCalendar(chatId, preferences) {
        try {
            await this.bot.sendMessage(chatId, '📅 **Creating your personalized calendar...**');

            console.log('🎯 User preferences:', preferences);

            // Create filter object for calendar generation
            const filter = {
                sports: preferences.sports || [],
                teams: preferences.teams || [],
                tournaments: preferences.tournaments || [],
                keywords: preferences.eventTypes || preferences.keywords || [],
                filename: this.generateFilename(preferences),
                summary: this.generateSummary(preferences)
            };

            // Generate calendar
            const calendarData = createSportsCalendar(filter);
            const filename = `${filter.filename}_${new Date().toISOString().split('T')[0]}.ics`;
            const filepath = this.saveCalendarFile(calendarData, filename);

            // Send calendar file
            await this.bot.sendDocument(chatId, filepath, {
                caption: `✅ **Your Personalized Sports Calendar!**

${filter.summary}

🎯 **Filtered by your preferences:**
${this.formatPreferences(preferences)}

📱 **Import this file into:**
• Google Calendar
• Apple Calendar  
• Outlook
• Any calendar app

🔔 All events include 1-hour reminders!`,
                parse_mode: 'Markdown'
            });

            // Clean up file
            this.cleanupFile(filepath);

            // Success message
            await this.bot.sendMessage(chatId, 
                "🎉 **Perfect!** Your calendar is ready. The events are now filtered exactly how you wanted!"
            );

        } catch (error) {
            console.error('❌ Calendar generation error:', error);
            await this.bot.sendMessage(chatId, 
                "❌ Sorry, there was an error creating your calendar. Let me try a different approach - could you tell me your preferences again?"
            );
        }
    }

    generateFilename(preferences) {
        const parts = [];
        
        if (preferences.sports && preferences.sports.length > 0) {
            parts.push(preferences.sports.join('_'));
        }
        
        if (preferences.teams && preferences.teams.length > 0) {
            parts.push(preferences.teams.slice(0, 2).join('_').replace(/\s+/g, '_'));
        }
        
        if (preferences.eventTypes && preferences.eventTypes.length > 0) {
            parts.push(preferences.eventTypes.join('_'));
        }
        
        return parts.length > 0 ? parts.join('_').toLowerCase() : 'custom_sports_calendar';
    }

    generateSummary(preferences) {
        const parts = [];
        
        if (preferences.sports && preferences.sports.length > 0) {
            const sportEmojis = {
                tennis: '🎾',
                football: '⚽', 
                soccer: '⚽',
                basketball: '🏀'
            };
            const sportsText = preferences.sports.map(sport => 
                `${sportEmojis[sport] || '🏟️'} ${sport.charAt(0).toUpperCase() + sport.slice(1)}`
            ).join(', ');
            parts.push(sportsText);
        }
        
        if (preferences.teams && preferences.teams.length > 0) {
            parts.push(`\n⭐ **Teams:** ${preferences.teams.join(', ')}`);
        }
        
        if (preferences.tournaments && preferences.tournaments.length > 0) {
            parts.push(`\n🏆 **Tournaments:** ${preferences.tournaments.join(', ')}`);
        }
        
        if (preferences.eventTypes && preferences.eventTypes.length > 0) {
            parts.push(`\n🎯 **Event Types:** ${preferences.eventTypes.join(', ')}`);
        }
        
        return parts.length > 0 ? parts.join('') : '🏟️ **Custom Sports Events**';
    }

    formatPreferences(preferences) {
        const formatted = [];
        
        if (preferences.sports?.length) {
            formatted.push(`**Sports:** ${preferences.sports.join(', ')}`);
        }
        if (preferences.teams?.length) {
            formatted.push(`**Teams:** ${preferences.teams.join(', ')}`);
        }
        if (preferences.tournaments?.length) {
            formatted.push(`**Tournaments:** ${preferences.tournaments.join(', ')}`);
        }
        if (preferences.eventTypes?.length) {
            formatted.push(`**Event Types:** ${preferences.eventTypes.join(', ')}`);
        }
        
        return formatted.join('\n') || 'General sports events';
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
        }, 30000);
    }
}

module.exports = ConversationalSportsBot;