#!/usr/bin/env node

console.log('🤖 WhatsApp Sports Calendar Bot Setup');
console.log('=====================================\n');

const fs = require('fs');
const path = require('path');

// Create necessary directories
const dirs = ['auth_info', 'calendars'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
    }
});

// Create .env file if it doesn't exist
if (!fs.existsSync('.env')) {
    const envContent = `# Optional: OpenAI API Key for AI chat
# OPENAI_API_KEY=your_openai_api_key_here

# Bot Configuration
BOT_NAME=Sports Calendar Bot
`;
    fs.writeFileSync('.env', envContent);
    console.log('✅ Created .env file');
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. npm start              - Start the bot');
console.log('2. Scan QR code with WhatsApp');
console.log('3. Send "sports calendar" to get events');
console.log('\nOptional: Add OPENAI_API_KEY to .env for AI chat');