#!/usr/bin/env node

const { createSportsCalendar, createCustomEventsCalendar } = require('./src/calendar');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class SportsCLI {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async start() {
        console.log('🏟️  Sports Calendar Generator');
        console.log('===========================\n');
        
        if (process.argv.length > 2) {
            // Command line arguments provided
            await this.handleArguments();
        } else {
            // Interactive mode
            await this.showMainMenu();
        }
        
        this.rl.close();
    }

    async handleArguments() {
        const command = process.argv[2].toLowerCase();
        
        switch (command) {
            case 'all':
            case 'sports':
                await this.generateAllSportsCalendar();
                break;
            case 'tennis':
                await this.generateTennisCalendar();
                break;
            case 'football':
            case 'soccer':
                await this.generateFootballCalendar();
                break;
            case 'custom':
                await this.generateCustomCalendar();
                break;
            case 'help':
            case '--help':
            case '-h':
                this.showHelp();
                break;
            default:
                console.log(`❌ Unknown command: ${command}`);
                this.showHelp();
        }
    }

    async showMainMenu() {
        console.log('📋 Choose what you want:');
        console.log('1. 🏟️  All Sports (Tennis + Football)');
        console.log('2. 🎾 Tennis Only (US Open)');
        console.log('3. ⚽ Football Only (Spanish La Liga)');
        console.log('4. 🛠️  Custom Events');
        console.log('5. ❓ Help');
        console.log('6. 🚪 Exit\n');

        const choice = await this.askQuestion('Enter your choice (1-6): ');
        
        switch (choice.trim()) {
            case '1':
                await this.generateAllSportsCalendar();
                break;
            case '2':
                await this.generateTennisCalendar();
                break;
            case '3':
                await this.generateFootballCalendar();
                break;
            case '4':
                await this.generateCustomCalendar();
                break;
            case '5':
                this.showHelp();
                await this.showMainMenu();
                break;
            case '6':
                console.log('👋 Goodbye!');
                break;
            default:
                console.log('❌ Invalid choice. Please enter 1-6.\n');
                await this.showMainMenu();
        }
    }

    async generateAllSportsCalendar() {
        console.log('\n🏟️  Generating All Sports Calendar...');
        
        try {
            const calendarData = createSportsCalendar();
            const filename = `all_sports_${this.getDateString()}.ics`;
            const filepath = this.saveCalendar(calendarData, filename);
            
            console.log('✅ All Sports Calendar Created!');
            console.log(`📁 File: ${filepath}`);
            console.log('\n📅 Events included:');
            console.log('🎾 Tennis US Open - Men\'s Semifinals & Final');
            console.log('   • Alcaraz vs Medvedev');
            console.log('   • Djokovic vs Fritz');
            console.log('   • Championship Final');
            console.log('⚽ Spanish La Liga Matches');
            console.log('   • Real Madrid (2 matches)');
            console.log('   • Barcelona (2 matches)');
            console.log('   • Atlético Madrid (2 matches)');
            console.log('\n📱 Import this file into your calendar app!');
            
        } catch (error) {
            console.error('❌ Error generating calendar:', error.message);
        }
    }

    async generateTennisCalendar() {
        console.log('\n🎾 Generating Tennis Calendar...');
        
        const showAll = await this.askQuestion('Show all matches or finals only? (all/finals): ');
        
        try {
            const filter = {
                sports: ['tennis'],
                tournaments: ['US Open'],
                keywords: showAll.toLowerCase() === 'finals' ? ['final', 'semifinal'] : [],
                filename: showAll.toLowerCase() === 'finals' ? 'tennis_finals' : 'tennis_all',
                summary: showAll.toLowerCase() === 'finals' ? 
                    '🎾 Tennis US Open (Finals & Semifinals)' : 
                    '🎾 Tennis US Open (All Matches)'
            };
            
            const calendarData = createSportsCalendar(filter);
            const filename = `${filter.filename}_${this.getDateString()}.ics`;
            const filepath = this.saveCalendar(calendarData, filename);
            
            console.log('✅ Tennis Calendar Created!');
            console.log(`📁 File: ${filepath}`);
            console.log('\n📅 Tennis Events:');
            console.log('🎾 US Open Men\'s Singles');
            console.log('   • Sept 6: Semifinal 1 - Alcaraz vs Medvedev');
            console.log('   • Sept 7: Semifinal 2 - Djokovic vs Fritz');
            console.log('   • Sept 8: Final - Championship Match');
            console.log('📍 All matches at Arthur Ashe Stadium, New York');
            
        } catch (error) {
            console.error('❌ Error generating tennis calendar:', error.message);
        }
    }

    async generateFootballCalendar() {
        console.log('\n⚽ Generating Football Calendar...');
        
        console.log('Which teams do you want?');
        console.log('1. All teams (Real Madrid, Barcelona, Atlético)');
        console.log('2. Real Madrid only');
        console.log('3. Barcelona only');
        console.log('4. Atlético Madrid only');
        console.log('5. El Clasico teams (Real Madrid + Barcelona)');
        
        const teamChoice = await this.askQuestion('Enter choice (1-5): ');
        
        let filter = {
            sports: ['football'],
            tournaments: ['La Liga'],
            teams: [],
            filename: 'football',
            summary: '⚽ Spanish La Liga'
        };
        
        switch (teamChoice.trim()) {
            case '1':
                filter.teams = ['Real Madrid', 'Barcelona', 'Atletico Madrid'];
                filter.filename = 'la_liga_all_teams';
                filter.summary = '⚽ La Liga (All Top Teams)';
                break;
            case '2':
                filter.teams = ['Real Madrid'];
                filter.filename = 'real_madrid';
                filter.summary = '⚽ Real Madrid Matches';
                break;
            case '3':
                filter.teams = ['Barcelona'];
                filter.filename = 'barcelona';
                filter.summary = '⚽ Barcelona Matches';
                break;
            case '4':
                filter.teams = ['Atletico Madrid'];
                filter.filename = 'atletico_madrid';
                filter.summary = '⚽ Atlético Madrid Matches';
                break;
            case '5':
                filter.teams = ['Real Madrid', 'Barcelona'];
                filter.filename = 'el_clasico_teams';
                filter.summary = '⚽ El Clasico Teams (Real Madrid + Barcelona)';
                break;
            default:
                console.log('❌ Invalid choice, using all teams');
                filter.teams = ['Real Madrid', 'Barcelona', 'Atletico Madrid'];
        }
        
        try {
            const calendarData = createSportsCalendar(filter);
            const filename = `${filter.filename}_${this.getDateString()}.ics`;
            const filepath = this.saveCalendar(calendarData, filename);
            
            console.log('✅ Football Calendar Created!');
            console.log(`📁 File: ${filepath}`);
            console.log(`\n📅 ${filter.summary}`);
            console.log('⚽ Upcoming Matches:');
            if (filter.teams.includes('Real Madrid')) {
                console.log('   • Real Madrid vs Athletic Bilbao');
                console.log('   • Real Madrid vs Villarreal CF');
            }
            if (filter.teams.includes('Barcelona')) {
                console.log('   • Barcelona vs Girona FC');
                console.log('   • Barcelona vs Sevilla FC');
            }
            if (filter.teams.includes('Atletico Madrid')) {
                console.log('   • Atlético Madrid vs Real Sociedad');
                console.log('   • Atlético Madrid vs Real Betis');
            }
            
        } catch (error) {
            console.error('❌ Error generating football calendar:', error.message);
        }
    }

    async generateCustomCalendar() {
        console.log('\n🛠️  Custom Events Creator');
        console.log('=========================');
        
        const events = [];
        let addMore = true;
        
        while (addMore) {
            console.log(`\n📝 Creating Event ${events.length + 1}:`);
            
            const title = await this.askQuestion('Event title: ');
            const sport = await this.askQuestion('Sport (tennis/football/basketball/other): ');
            const date = await this.askQuestion('Date (YYYY-MM-DD or "tomorrow"): ');
            const time = await this.askQuestion('Time (HH:MM or "7pm"): ');
            const location = await this.askQuestion('Location: ');
            
            // Parse date
            let eventDate;
            if (date.toLowerCase() === 'tomorrow') {
                eventDate = new Date();
                eventDate.setDate(eventDate.getDate() + 1);
                eventDate = eventDate.toISOString().split('T')[0];
            } else if (date.toLowerCase() === 'today') {
                eventDate = new Date().toISOString().split('T')[0];
            } else {
                eventDate = date;
            }
            
            // Parse time
            let eventTime = time;
            if (time.toLowerCase().includes('pm')) {
                const hour = parseInt(time) + (parseInt(time) === 12 ? 0 : 12);
                eventTime = `${hour}:00`;
            } else if (time.toLowerCase().includes('am')) {
                const hour = parseInt(time) === 12 ? 0 : parseInt(time);
                eventTime = `${hour}:00`;
            }
            
            events.push({
                title: title || 'Custom Event',
                sport: sport || 'sports',
                date: eventDate,
                time: eventTime,
                location: location || 'TBD',
                description: `Custom ${sport || 'sports'} event\\nCreated via Sports CLI`
            });
            
            console.log(`✅ Event added: ${title} on ${eventDate} at ${eventTime}`);
            
            const more = await this.askQuestion('\nAdd another event? (y/n): ');
            addMore = more.toLowerCase().startsWith('y');
        }
        
        try {
            const calendarData = createCustomEventsCalendar(events);
            const filename = `custom_events_${this.getDateString()}.ics`;
            const filepath = this.saveCalendar(calendarData, filename);
            
            console.log('\n✅ Custom Calendar Created!');
            console.log(`📁 File: ${filepath}`);
            console.log(`\n📅 Your ${events.length} Custom Events:`);
            events.forEach((event, index) => {
                console.log(`   ${index + 1}. ${event.title}`);
                console.log(`      📅 ${event.date} at ${event.time}`);
                console.log(`      📍 ${event.location}`);
            });
            
        } catch (error) {
            console.error('❌ Error generating custom calendar:', error.message);
        }
    }

    showHelp() {
        console.log('\n📋 Sports Calendar Generator Help');
        console.log('=================================');
        console.log('\n🚀 Usage:');
        console.log('  node sports-cli.js [command]');
        console.log('\n📋 Commands:');
        console.log('  all, sports    - Generate all sports events');
        console.log('  tennis         - Generate tennis events only');
        console.log('  football       - Generate football events only');
        console.log('  custom         - Create custom events');
        console.log('  help           - Show this help');
        console.log('\n💡 Examples:');
        console.log('  node sports-cli.js all        # All sports');
        console.log('  node sports-cli.js tennis     # Tennis only');
        console.log('  node sports-cli.js football   # Football only');
        console.log('  node sports-cli.js            # Interactive mode');
        console.log('\n📁 Files are saved to: ./calendars/');
        console.log('📱 Import .ics files into any calendar app!');
    }

    saveCalendar(calendarData, filename) {
        const calendarsDir = path.join(__dirname, 'calendars');
        if (!fs.existsSync(calendarsDir)) {
            fs.mkdirSync(calendarsDir, { recursive: true });
        }
        
        const filepath = path.join(calendarsDir, filename);
        fs.writeFileSync(filepath, calendarData);
        return filepath;
    }

    getDateString() {
        return new Date().toISOString().split('T')[0];
    }

    askQuestion(question) {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer);
            });
        });
    }
}

// Run the CLI
if (require.main === module) {
    const cli = new SportsCLI();
    cli.start().catch(console.error);
}