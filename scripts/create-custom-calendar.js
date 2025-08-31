#!/usr/bin/env node

const { createSportsCalendar } = require('../src/calendar');
const fs = require('fs');
const path = require('path');

console.log('📅 Creating custom filtered sports calendar...');

// Define custom filter for tennis US Open and top Spanish teams
const customFilter = {
    sports: ['tennis', 'football'],
    teams: ['Real Madrid', 'Barcelona', 'Atletico Madrid'],
    tournaments: ['US Open', 'La Liga'],
    keywords: ['final', 'semifinal'],
    filename: 'tennis_us_open_top_spanish_teams',
    summary: '🎾 Tennis US Open (best players) + ⚽ Top Spanish La Liga teams'
};

try {
    const calendarData = createSportsCalendar(customFilter);
    const filename = `${customFilter.filename}_${new Date().toISOString().split('T')[0]}.ics`;
    const filepath = path.join('calendars', filename);
    
    // Create calendars directory if it doesn't exist
    if (!fs.existsSync('calendars')) {
        fs.mkdirSync('calendars', { recursive: true });
    }
    
    fs.writeFileSync(filepath, calendarData);
    
    console.log('✅ Custom calendar created successfully!');
    console.log(`📁 File: ${filepath}`);
    console.log(`\n${customFilter.summary}`);
    console.log('\nEvents included:');
    console.log('🎾 Tennis US Open - Men\'s Semifinals & Final (Alcaraz, Medvedev, Djokovic, Fritz)');
    console.log('⚽ Real Madrid vs Athletic Bilbao & vs Villarreal CF');
    console.log('⚽ Barcelona vs Girona FC & vs Sevilla FC'); 
    console.log('⚽ Atlético Madrid vs Real Sociedad & vs Real Betis');
    console.log('\n📱 Import this file into Google Calendar, Apple Calendar, or any calendar app!');
    
} catch (error) {
    console.error('❌ Error creating custom calendar:', error.message);
    process.exit(1);
}