#!/usr/bin/env node

const { createSportsCalendar } = require('../src/calendar');
const fs = require('fs');
const path = require('path');

console.log('📅 Creating sports calendar file...');

try {
    const calendarData = createSportsCalendar();
    const filename = `sports_calendar_${new Date().toISOString().split('T')[0]}.ics`;
    const filepath = path.join('calendars', filename);
    
    // Create calendars directory if it doesn't exist
    if (!fs.existsSync('calendars')) {
        fs.mkdirSync('calendars', { recursive: true });
    }
    
    fs.writeFileSync(filepath, calendarData);
    
    console.log('✅ Calendar created successfully!');
    console.log(`📁 File: ${filepath}`);
    console.log('\n🎾 Tennis US Open (Men\'s events)');
    console.log('⚽ Spanish La Liga (Real Madrid, Barcelona, Atlético Madrid)');
    console.log('\n📱 Import this file into your calendar app!');
    
} catch (error) {
    console.error('❌ Error creating calendar:', error.message);
    process.exit(1);
}