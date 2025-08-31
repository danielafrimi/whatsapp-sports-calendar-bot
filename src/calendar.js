const { createEvent, createEvents } = require('ics');

function createSportsCalendar(filter = null) {
    const allEvents = [
        // Tennis US Open Men's Events
        {
            start: [2024, 9, 6, 19, 0], // Sept 6, 2024, 7:00 PM UTC
            end: [2024, 9, 6, 22, 0],
            title: 'US Open Men\'s Semifinal 1 - Alcaraz vs Medvedev',
            description: 'US Open Tennis Championship - Men\'s Singles Semifinal\nArthur Ashe Stadium',
            location: 'Arthur Ashe Stadium, Flushing Meadows, New York',
            categories: ['Tennis', 'US Open'],
            sport: 'tennis',
            tournament: 'US Open',
            teams: ['Alcaraz', 'Medvedev'],
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
            sport: 'tennis',
            tournament: 'US Open',
            teams: ['Djokovic', 'Fritz'],
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
            sport: 'tennis',
            tournament: 'US Open',
            teams: ['Final'],
            keywords: ['final', 'championship'],
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
            sport: 'football',
            tournament: 'La Liga',
            teams: ['Real Madrid', 'Athletic Bilbao'],
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
            sport: 'football',
            tournament: 'La Liga',
            teams: ['Real Madrid', 'Villarreal CF'],
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
            sport: 'football',
            tournament: 'La Liga',
            teams: ['Barcelona', 'Girona FC'],
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
            sport: 'football',
            tournament: 'La Liga',
            teams: ['Barcelona', 'Sevilla FC'],
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
            sport: 'football',
            tournament: 'La Liga',
            teams: ['Atletico Madrid', 'Real Sociedad'],
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
            sport: 'football',
            tournament: 'La Liga',
            teams: ['Atletico Madrid', 'Real Betis'],
            status: 'CONFIRMED',
            alarms: [{
                action: 'display',
                description: 'Atlético Madrid match in 1 hour',
                trigger: { hours: 1, before: true }
            }]
        }
    ];

    // Apply filters if provided
    let filteredEvents = allEvents;
    if (filter) {
        filteredEvents = applyEventFilters(allEvents, filter);
    }

    // Remove filtering metadata before creating calendar
    const cleanEvents = filteredEvents.map(event => {
        const { sport, tournament, teams, keywords, ...cleanEvent } = event;
        return cleanEvent;
    });

    const { error, value } = createEvents(cleanEvents);
    
    if (error) {
        console.error('Error creating sports calendar:', error);
        throw new Error('Failed to create sports calendar');
    }

    return value;
}

function applyEventFilters(events, filter) {
    return events.filter(event => {
        // Include all if no specific filters
        if (!filter || (!filter.sports?.length && !filter.teams?.length && !filter.tournaments?.length && !filter.keywords?.length)) {
            return true;
        }

        let matches = false;

        // Check sports filter
        if (filter.sports?.length > 0) {
            matches = matches || filter.sports.some(sport => 
                event.sport?.toLowerCase() === sport.toLowerCase()
            );
        }

        // Check teams filter
        if (filter.teams?.length > 0) {
            matches = matches || filter.teams.some(team => 
                event.teams?.some(eventTeam => 
                    eventTeam.toLowerCase().includes(team.toLowerCase())
                )
            );
        }

        // Check tournaments filter
        if (filter.tournaments?.length > 0) {
            matches = matches || filter.tournaments.some(tournament => 
                event.tournament?.toLowerCase().includes(tournament.toLowerCase())
            );
        }

        // Check keywords filter
        if (filter.keywords?.length > 0) {
            matches = matches || filter.keywords.some(keyword => 
                event.keywords?.some(eventKeyword => 
                    eventKeyword.toLowerCase().includes(keyword.toLowerCase())
                ) ||
                event.title?.toLowerCase().includes(keyword.toLowerCase()) ||
                event.description?.toLowerCase().includes(keyword.toLowerCase())
            );
        }

        return matches;
    });
}
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