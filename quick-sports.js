#!/usr/bin/env node

// Quick command-line sports calendar generator
const { createSportsCalendar, createCustomEventsCalendar } = require('./src/calendar');
const fs = require('fs');
const path = require('path');

function saveCalendar(calendarData, filename) {
    const calendarsDir = path.join(__dirname, 'calendars');
    if (!fs.existsSync(calendarsDir)) {
        fs.mkdirSync(calendarsDir, { recursive: true });
    }
    
    const filepath = path.join(calendarsDir, filename);
    fs.writeFileSync(filepath, calendarData);
    return filepath;
}

function getDateString() {
    return new Date().toISOString().split('T')[0];
}

const command = process.argv[2];

console.log('🏟️  Quick Sports Calendar Generator');
console.log('===================================\\n');

switch (command) {
    case 'all':
        console.log('📅 Generating ALL sports events...');
        try {
            const calendar = createSportsCalendar();
            const filename = `all_sports_${getDateString()}.ics`;
            const filepath = saveCalendar(calendar, filename);
            console.log('✅ SUCCESS!');
            console.log(`📁 File: ${filepath}`);
            console.log('🎾 Tennis: US Open semifinals & final');
            console.log('⚽ Football: Spanish La Liga (Real Madrid, Barcelona, Atlético)');
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
        break;

    case 'tennis':
        console.log('🎾 Generating TENNIS events...');
        try {
            const filter = { sports: ['tennis'], tournaments: ['US Open'] };
            const calendar = createSportsCalendar(filter);
            const filename = `tennis_${getDateString()}.ics`;
            const filepath = saveCalendar(calendar, filename);
            console.log('✅ SUCCESS!');
            console.log(`📁 File: ${filepath}`);
            console.log('🎾 US Open Men\'s: Semifinals (Alcaraz/Medvedev, Djokovic/Fritz) + Final');
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
        break;

    case 'football':
        console.log('⚽ Generating FOOTBALL events...');
        try {
            const filter = { sports: ['football'], tournaments: ['La Liga'] };
            const calendar = createSportsCalendar(filter);
            const filename = `football_${getDateString()}.ics`;
            const filepath = saveCalendar(calendar, filename);
            console.log('✅ SUCCESS!');
            console.log(`📁 File: ${filepath}`);
            console.log('⚽ Spanish La Liga: Real Madrid, Barcelona, Atlético Madrid matches');
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
        break;

    case 'barcelona':
        console.log('⚽ Generating BARCELONA events...');
        try {
            const filter = { sports: ['football'], teams: ['Barcelona'] };
            const calendar = createSportsCalendar(filter);
            const filename = `barcelona_${getDateString()}.ics`;
            const filepath = saveCalendar(calendar, filename);
            console.log('✅ SUCCESS!');
            console.log(`📁 File: ${filepath}`);
            console.log('⚽ FC Barcelona matches only');
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
        break;

    case 'realmadrid':
        console.log('⚽ Generating REAL MADRID events...');
        try {
            const filter = { sports: ['football'], teams: ['Real Madrid'] };
            const calendar = createSportsCalendar(filter);
            const filename = `real_madrid_${getDateString()}.ics`;
            const filepath = saveCalendar(calendar, filename);
            console.log('✅ SUCCESS!');
            console.log(`📁 File: ${filepath}`);
            console.log('⚽ Real Madrid matches only');
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
        break;

    case 'finals':
        console.log('🏆 Generating FINALS only...');
        try {
            const filter = { keywords: ['final', 'championship'] };
            const calendar = createSportsCalendar(filter);
            const filename = `finals_${getDateString()}.ics`;
            const filepath = saveCalendar(calendar, filename);
            console.log('✅ SUCCESS!');
            console.log(`📁 File: ${filepath}`);
            console.log('🏆 Championship matches and finals only');
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
        break;

    case 'sample':
        console.log('🧪 Generating SAMPLE custom events...');
        try {
            const sampleEvents = [
                {
                    title: 'El Clasico - Barcelona vs Real Madrid',
                    sport: 'football',
                    date: '2024-10-26',
                    time: '21:00',
                    location: 'Camp Nou, Barcelona',
                    description: 'Classic rivalry match\\nGenerated by Quick Sports CLI'
                },
                {
                    title: 'Tennis Exhibition - Djokovic vs Alcaraz',
                    sport: 'tennis',
                    date: '2024-11-15',
                    time: '19:00',
                    location: 'Rod Laver Arena, Melbourne',
                    description: 'Exhibition match\\nGenerated by Quick Sports CLI'
                }
            ];
            const calendar = createCustomEventsCalendar(sampleEvents);
            const filename = `sample_events_${getDateString()}.ics`;
            const filepath = saveCalendar(calendar, filename);
            console.log('✅ SUCCESS!');
            console.log(`📁 File: ${filepath}`);
            console.log('🏟️ Sample custom events created');
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
        break;

    default:
        console.log('📋 Usage: node quick-sports.js [command]\\n');
        console.log('📋 Available commands:');
        console.log('  all        - All sports events (tennis + football)');
        console.log('  tennis     - Tennis US Open events only');
        console.log('  football   - Spanish La Liga events only');
        console.log('  barcelona  - Barcelona matches only');
        console.log('  realmadrid - Real Madrid matches only');
        console.log('  finals     - Championship/final matches only');
        console.log('  sample     - Sample custom events\\n');
        console.log('💡 Examples:');
        console.log('  node quick-sports.js all');
        console.log('  node quick-sports.js tennis');
        console.log('  node quick-sports.js barcelona\\n');
        console.log('📁 Files are saved to ./calendars/');
        console.log('📱 Import .ics files into your calendar app!');
}

console.log('');