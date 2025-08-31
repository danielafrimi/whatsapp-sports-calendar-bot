#!/usr/bin/env node

const TelegramSportsBot = require('./src/telegramBot');

// Get Telegram bot token from environment or command line
const token = process.env.TELEGRAM_BOT_TOKEN || process.argv[2];

if (!token) {
    console.log('❌ Telegram bot token required!');
    console.log('');
    console.log('📱 How to get a Telegram bot token:');
    console.log('1. Open Telegram and search for @BotFather');
    console.log('2. Send /newbot to create a new bot');
    console.log('3. Choose a name and username for your bot');
    console.log('4. Copy the token you receive');
    console.log('');
    console.log('🚀 How to start the bot:');
    console.log('Option 1: node telegram-bot.js YOUR_TOKEN_HERE');
    console.log('Option 2: TELEGRAM_BOT_TOKEN=YOUR_TOKEN node telegram-bot.js');
    console.log('Option 3: Add TELEGRAM_BOT_TOKEN=YOUR_TOKEN to .env file');
    console.log('');
    console.log('Example:');
    console.log('node telegram-bot.js 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz');
    process.exit(1);
}

try {
    console.log('🤖 Starting Telegram Sports Calendar Bot...');
    const bot = new TelegramSportsBot(token);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\\n🛑 Shutting down bot...');
        process.exit(0);
    });
    
} catch (error) {
    console.error('❌ Error starting Telegram bot:', error.message);
    console.log('');
    console.log('💡 Common issues:');
    console.log('• Invalid token - check your bot token from @BotFather');
    console.log('• Network issues - check your internet connection');
    console.log('• Bot already running - stop other instances first');
    process.exit(1);
}