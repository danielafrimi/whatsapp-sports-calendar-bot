const { createEvent, createEvents } = require('ics');

function createSportsCalendar() {
    const events = [
        // Tennis US Open Men's Events
        {
            start: [2024, 9, 6, 19, 0], // Sept 6, 2024, 7:00 PM UTC
            end: [2024, 9, 6, 22, 0],
            title: 'US Open Men\'s Semifinal 1 - Alcaraz vs Medvedev',
            description: 'US Open Tennis Championship - Men\'s Singles Semifinal\nArthur Ashe Stadium',
            location: 'Arthur Ashe Stadium, Flushing Meadows, New York',
            categories: ['Tennis', 'US Open'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'US Open Semifinal in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        },
        {
            start: [2024, 9, 7, 19, 0],
            end: [2024, 9, 7, 22, 0],
            title: 'US Open Men\'s Semifinal 2 - Djokovic vs Fritz',
            description: 'US Open Tennis Championship - Men\'s Singles Semifinal\nArthur Ashe Stadium',
            location: 'Arthur Ashe Stadium, Flushing Meadows, New York',
            categories: ['Tennis', 'US Open'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'US Open Semifinal in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        },
        {
            start: [2024, 9, 8, 19, 0],
            end: [2024, 9, 8, 22, 0],
            title: 'US Open Men\'s Final - Championship Match',
            description: 'US Open Tennis Championship - Men\'s Singles Final\nArthur Ashe Stadium\nTop players competing for the Grand Slam title',
            location: 'Arthur Ashe Stadium, Flushing Meadows, New York',
            categories: ['Tennis', 'US Open'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'US Open Final in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        },

        // Spanish La Liga - Real Madrid
        {
            start: [2024, 9, 7, 20, 0],
            end: [2024, 9, 7, 22, 0],
            title: 'Real Madrid vs Athletic Bilbao',
            description: 'La Liga - Spanish Football League\nJornada 4\nSantiago Bernabéu Stadium',
            location: 'Santiago Bernabéu Stadium, Madrid, Spain',
            categories: ['Football', 'La Liga', 'Real Madrid'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'Real Madrid match in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        },
        {
            start: [2024, 9, 28, 20, 0],
            end: [2024, 9, 28, 22, 0],
            title: 'Real Madrid vs Villarreal CF',
            description: 'La Liga - Spanish Football League\nJornada 7\nSantiago Bernabéu Stadium',
            location: 'Santiago Bernabéu Stadium, Madrid, Spain',
            categories: ['Football', 'La Liga', 'Real Madrid'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'Real Madrid match in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        },

        // Spanish La Liga - Barcelona
        {
            start: [2024, 9, 15, 20, 0],
            end: [2024, 9, 15, 22, 0],
            title: 'FC Barcelona vs Girona FC',
            description: 'La Liga - Spanish Football League\nJornada 5\nCamp Nou Stadium',
            location: 'Camp Nou, Barcelona, Spain',
            categories: ['Football', 'La Liga', 'Barcelona'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'Barcelona match in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        },
        {
            start: [2024, 10, 5, 20, 0],
            end: [2024, 10, 5, 22, 0],
            title: 'FC Barcelona vs Sevilla FC',
            description: 'La Liga - Spanish Football League\nJornada 8\nCamp Nou Stadium',
            location: 'Camp Nou, Barcelona, Spain',
            categories: ['Football', 'La Liga', 'Barcelona'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'Barcelona match in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        },

        // Spanish La Liga - Atlético Madrid
        {
            start: [2024, 9, 22, 18, 0],
            end: [2024, 9, 22, 20, 0],
            title: 'Atlético Madrid vs Real Sociedad',
            description: 'La Liga - Spanish Football League\nJornada 6\nMetropolitano Stadium',
            location: 'Wanda Metropolitano, Madrid, Spain',
            categories: ['Football', 'La Liga', 'Atletico Madrid'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'Atlético Madrid match in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        },
        {
            start: [2024, 10, 12, 18, 0],
            end: [2024, 10, 12, 20, 0],
            title: 'Atlético Madrid vs Real Betis',
            description: 'La Liga - Spanish Football League\nJornada 9\nMetropolitano Stadium',
            location: 'Wanda Metropolitano, Madrid, Spain',
            categories: ['Football', 'La Liga', 'Atletico Madrid'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'Atlético Madrid match in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        }
    ];

    const { error, value } = createEvents(events);
    
    if (error) {
        console.error('Error creating sports calendar:', error);
        throw new Error('Failed to create sports calendar');
    }

    return value;
}

function createCalendarFile(eventDetails) {
    const [year, month, day] = eventDetails.date.split('-').map(Number);
    const [hour, minute] = eventDetails.time.split(':').map(Number);

    const start = [year, month, day, hour, minute];
    const end = [year, month, day, hour + 1, minute];

    const { error, value } = createEvent({
        start,
        end,
        title: eventDetails.title,
        description: eventDetails.description,
        location: eventDetails.location,
        status: 'CONFIRMED',
        organizer: { name: 'WhatsApp Bot', email: 'bot@example.com' },
        alarms: [{
            action: 'display',
            description: `${eventDetails.title} reminder`,
            trigger: { hours: 1, before: true }
        }]
    });

    if (error) {
        console.error('Error creating calendar event:', error);
        throw new Error('Failed to create calendar event');
    }

    return value;
}

module.exports = {
    createSportsCalendar,
    createCalendarFile
};