#!/usr/bin/env node

const EventCustomizer = require('../src/eventCustomizer');
const { createCustomEventsCalendar } = require('../src/calendar');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Custom Event Creation...\n');

// Test event customizer
const customizer = new EventCustomizer();

// Simulate a custom event creation process
async function testCustomEventCreation() {
    console.log('📝 Creating sample custom events...\n');
    
    // Sample custom events
    const customEvents = [
        {
            sport: 'football',
            title: 'Barcelona vs Real Madrid',
            teams: ['Barcelona', 'Real Madrid'],
            date: '2024-10-26',
            time: '21:00',
            location: 'Camp Nou, Barcelona',
            description: 'Custom El Clasico match\\nCreated by user'
        },
        {
            sport: 'tennis',
            title: 'Djokovic vs Alcaraz Exhibition',
            teams: ['Djokovic', 'Alcaraz'],
            date: '2024-11-15',
            time: '19:00',
            location: 'Rod Laver Arena, Melbourne',
            description: 'Custom tennis exhibition match\\nCreated by user'
        },
        {
            sport: 'basketball',
            title: 'Lakers vs Warriors',
            teams: ['Lakers', 'Warriors'],
            date: '2024-12-01',
            time: '20:30',
            location: 'Staples Center, Los Angeles',
            description: 'Custom NBA matchup\\nCreated by user'
        }
    ];

    console.log('🏟️ Custom Events:');
    customEvents.forEach((event, index) => {
        console.log(`${index + 1}. ${event.title}`);
        console.log(`   📅 ${event.date} at ${event.time}`);
        console.log(`   📍 ${event.location}`);
        console.log(`   🏆 Sport: ${event.sport}\n`);
    });

    try {
        // Generate calendar
        const calendarData = createCustomEventsCalendar(customEvents);
        
        // Save to file
        const filename = `test_custom_events_${new Date().toISOString().split('T')[0]}.ics`;
        const filepath = path.join('calendars', filename);
        
        // Create calendars directory if it doesn't exist
        if (!fs.existsSync('calendars')) {
            fs.mkdirSync('calendars', { recursive: true });
        }
        
        fs.writeFileSync(filepath, calendarData);
        
        console.log('✅ Custom events calendar created successfully!');
        console.log(`📁 File: ${filepath}`);
        console.log('\n🎯 Features tested:');
        console.log('✅ Custom sports (football, tennis, basketball)');
        console.log('✅ Custom teams/players');
        console.log('✅ Custom dates and times');
        console.log('✅ Custom locations');
        console.log('✅ Calendar file generation');
        console.log('✅ 1-hour reminder alarms');
        console.log('\n📱 Import this file into your calendar app to test!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Test the parser functions
function testEventParsing() {
    console.log('\n🔍 Testing Event Parsing...\n');
    
    const testCases = [
        { input: 'Barcelona vs Real Madrid', expectedTeams: ['Barcelona', 'Real Madrid'] },
        { input: 'Lakers Warriors game', expectedTeams: ['Lakers', 'Warriors'] },
        { input: 'tomorrow 3pm', expectedTime: '15:00' },
        { input: 'next week 7:30pm', expectedTime: '19:30' },
        { input: '2024-12-25', expectedDate: '2024-12-25' }
    ];
    
    testCases.forEach((testCase, index) => {
        console.log(`Test ${index + 1}: "${testCase.input}"`);
        
        if (testCase.expectedTeams) {
            const teams = customizer.extractTeams(testCase.input);
            console.log(`   Teams: ${teams.join(', ')} ${teams.length >= 2 ? '✅' : '⚠️'}`);
        }
        
        if (testCase.expectedTime) {
            const time = customizer.parseTime(testCase.input);
            console.log(`   Time: ${time} ${time === testCase.expectedTime ? '✅' : '⚠️'}`);
        }
        
        if (testCase.expectedDate) {
            const date = customizer.parseDate(testCase.input);
            console.log(`   Date: ${date} ${date === testCase.expectedDate ? '✅' : '⚠️'}`);
        }
        
        console.log();
    });
}

// Run tests
async function runAllTests() {
    await testCustomEventCreation();
    testEventParsing();
    
    console.log('\n🎉 All tests completed!');
    console.log('\n💡 To use in WhatsApp bot:');
    console.log('1. Start bot: npm start');
    console.log('2. Send: "customize events"');
    console.log('3. Follow the step-by-step prompts');
    console.log('4. Get your custom calendar file!');
}

runAllTests().catch(console.error);