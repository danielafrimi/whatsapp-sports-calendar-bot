#!/usr/bin/env node

const ConversationalSportsBot = require('./src/conversationalBot');

// Get tokens from environment or command line
const telegramToken = process.env.TELEGRAM_BOT_TOKEN || process.argv[2];
const openaiKey = process.env.OPENAI_API_KEY || process.argv[3];

if (!telegramToken) {
    console.log('❌ Telegram bot token required!');
    console.log('');
    console.log('📱 How to get a Telegram bot token:');
    console.log('1. Open Telegram and search for @BotFather');
    console.log('2. Send /newbot to create a new bot');
    console.log('3. Choose a name and username for your bot');
    console.log('4. Copy the token you receive');
    console.log('');
    console.log('🚀 How to start:');
    console.log('node conversational-bot.js TELEGRAM_TOKEN OPENAI_KEY');
    console.log('');
    console.log('Or set environment variables:');
    console.log('TELEGRAM_BOT_TOKEN=your_token OPENAI_API_KEY=your_key node conversational-bot.js');
    process.exit(1);
}

if (!openaiKey) {
    console.log('❌ OpenAI API key required for conversational features!');
    console.log('');
    console.log('🤖 How to get an OpenAI API key:');
    console.log('1. Go to https://platform.openai.com/api-keys');
    console.log('2. Create an account or log in');
    console.log('3. Create a new API key');
    console.log('4. Copy the key (starts with sk-)');
    console.log('');
    console.log('🚀 How to start:');
    console.log('node conversational-bot.js TELEGRAM_TOKEN OPENAI_KEY');
    console.log('');
    console.log('Example:');
    console.log('node conversational-bot.js 1234:ABC sk-proj-abc123');
    process.exit(1);
}

try {
    console.log('🤖 Starting Conversational Sports Calendar Bot...');
    console.log('💬 This bot will interview you about your sports preferences');
    console.log('🎯 Then create a perfectly filtered calendar just for you!');
    console.log('');
    
    const bot = new ConversationalSportsBot(telegramToken, openaiKey);
    
    console.log('✅ Bot is ready! Find your bot in Telegram and send /start');
    console.log('');
    console.log('💡 Example conversation:');
    console.log('You: "I like tennis"');
    console.log('Bot: "Great! Any specific players or tournaments?"');
    console.log('You: "I love watching Djokovic and finals"'); 
    console.log('Bot: "Perfect! I\'ll create a calendar with tennis finals and Djokovic matches!"');
    console.log('Bot: [Sends filtered .ics calendar file]');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\\n🛑 Shutting down conversational bot...');
        process.exit(0);
    });
    
} catch (error) {
    console.error('❌ Error starting conversational bot:', error.message);
    console.log('');
    console.log('💡 Common issues:');
    console.log('• Invalid Telegram token - check @BotFather');
    console.log('• Invalid OpenAI key - check https://platform.openai.com');
    console.log('• Network issues - check internet connection');
    console.log('• Keys have spaces or wrong format');
    process.exit(1);
}