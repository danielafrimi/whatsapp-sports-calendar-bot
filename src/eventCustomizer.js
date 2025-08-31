class EventCustomizer {
    constructor() {
        this.userSessions = new Map(); // Store user customization sessions
    }

    // Parse user messages for event customization
    async parseCustomEvent(messageText, userId = 'default') {
        const text = messageText.toLowerCase();
        
        // Check if user wants to customize events
        if (this.isCustomizationRequest(text)) {
            return this.startCustomizationSession(userId, messageText);
        }
        
        // Check if user is in a customization session
        if (this.userSessions.has(userId)) {
            return this.handleCustomizationStep(userId, messageText);
        }
        
        return null;
    }

    isCustomizationRequest(text) {
        const keywords = [
            'customize', 'custom', 'create event', 'add event', 'new event',
            'my event', 'make event', 'build calendar', 'personal event'
        ];
        return keywords.some(keyword => text.includes(keyword));
    }

    startCustomizationSession(userId, messageText) {
        const session = {
            step: 'sport_selection',
            events: [],
            currentEvent: {},
            messageText: messageText
        };
        
        this.userSessions.set(userId, session);
        
        return {
            type: 'customization_start',
            message: this.getSportSelectionMessage(),
            session: session
        };
    }

    handleCustomizationStep(userId, messageText) {
        const session = this.userSessions.get(userId);
        if (!session) return null;

        switch (session.step) {
            case 'sport_selection':
                return this.handleSportSelection(userId, messageText);
            case 'team_selection':
                return this.handleTeamSelection(userId, messageText);
            case 'date_selection':
                return this.handleDateSelection(userId, messageText);
            case 'time_selection':
                return this.handleTimeSelection(userId, messageText);
            case 'location_selection':
                return this.handleLocationSelection(userId, messageText);
            case 'more_events':
                return this.handleMoreEvents(userId, messageText);
            default:
                return this.completeCustomization(userId);
        }
    }

    handleSportSelection(userId, messageText) {
        const session = this.userSessions.get(userId);
        const text = messageText.toLowerCase();
        
        let sport = 'other';
        if (text.includes('tennis')) sport = 'tennis';
        else if (text.includes('football') || text.includes('soccer')) sport = 'football';
        else if (text.includes('basketball')) sport = 'basketball';
        else if (text.includes('hockey')) sport = 'hockey';
        else if (text.includes('baseball')) sport = 'baseball';
        else if (text.includes('golf')) sport = 'golf';
        else if (text.includes('volleyball')) sport = 'volleyball';
        else if (text.includes('rugby')) sport = 'rugby';
        
        session.currentEvent.sport = sport;
        session.step = 'team_selection';
        
        return {
            type: 'customization_step',
            message: this.getTeamSelectionMessage(sport),
            session: session
        };
    }

    handleTeamSelection(userId, messageText) {
        const session = this.userSessions.get(userId);
        
        // Parse teams from message (simple extraction)
        const teams = this.extractTeams(messageText);
        session.currentEvent.teams = teams;
        session.currentEvent.title = teams.length > 1 ? 
            `${teams[0]} vs ${teams[1]}` : 
            `${teams[0] || 'Sports Event'}`;
            
        session.step = 'date_selection';
        
        return {
            type: 'customization_step',
            message: this.getDateSelectionMessage(),
            session: session
        };
    }

    handleDateSelection(userId, messageText) {
        const session = this.userSessions.get(userId);
        
        const date = this.parseDate(messageText);
        session.currentEvent.date = date;
        session.step = 'time_selection';
        
        return {
            type: 'customization_step',
            message: this.getTimeSelectionMessage(),
            session: session
        };
    }

    handleTimeSelection(userId, messageText) {
        const session = this.userSessions.get(userId);
        
        const time = this.parseTime(messageText);
        session.currentEvent.time = time;
        session.step = 'location_selection';
        
        return {
            type: 'customization_step',
            message: this.getLocationSelectionMessage(),
            session: session
        };
    }

    handleLocationSelection(userId, messageText) {
        const session = this.userSessions.get(userId);
        
        session.currentEvent.location = messageText.trim() || 'TBD';
        session.currentEvent.description = `Custom ${session.currentEvent.sport} event\\nCreated by user`;
        
        // Add current event to session events
        session.events.push({ ...session.currentEvent });
        session.currentEvent = {};
        session.step = 'more_events';
        
        return {
            type: 'customization_step',
            message: this.getMoreEventsMessage(session.events.length),
            session: session
        };
    }

    handleMoreEvents(userId, messageText) {
        const session = this.userSessions.get(userId);
        const text = messageText.toLowerCase();
        
        if (text.includes('yes') || text.includes('add') || text.includes('more')) {
            // Start new event
            session.step = 'sport_selection';
            return {
                type: 'customization_step',
                message: this.getSportSelectionMessage(true),
                session: session
            };
        } else {
            // Finish customization
            return this.completeCustomization(userId);
        }
    }

    completeCustomization(userId) {
        const session = this.userSessions.get(userId);
        if (!session || session.events.length === 0) {
            this.userSessions.delete(userId);
            return {
                type: 'customization_error',
                message: '❌ No events were created. Start over with "customize events".'
            };
        }
        
        const events = session.events;
        this.userSessions.delete(userId);
        
        return {
            type: 'customization_complete',
            message: `✅ Created ${events.length} custom event(s)!\\n\\n${this.formatEventSummary(events)}`,
            events: events
        };
    }

    // Helper methods
    extractTeams(text) {
        const teams = [];
        const words = text.split(/\\s+/);
        
        // Simple team extraction - look for capitalized words or common team patterns
        const teamPatterns = [
            // Famous teams
            /barcelona|real madrid|atletico|chelsea|arsenal|liverpool|manchester|bayern|juventus/gi,
            /lakers|warriors|celtics|heat|bulls|knicks|nets|rockets/gi,
            // General patterns
            /\\b[A-Z][a-z]+\\s?[A-Z]?[a-z]*\\b/g
        ];
        
        teamPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                teams.push(...matches.map(m => m.trim()));
            }
        });
        
        // If no teams found, try to extract any capitalized words
        if (teams.length === 0) {
            const words = text.split(/\\s+/);
            const capitalizedWords = words.filter(word => 
                word.length > 2 && word[0] === word[0].toUpperCase()
            );
            teams.push(...capitalizedWords.slice(0, 2));
        }
        
        return teams.slice(0, 2); // Max 2 teams
    }

    parseDate(text) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const lowerText = text.toLowerCase();
        
        // Parse relative dates
        if (lowerText.includes('today')) {
            return today.toISOString().split('T')[0];
        }
        if (lowerText.includes('tomorrow')) {
            return tomorrow.toISOString().split('T')[0];
        }
        if (lowerText.includes('next week')) {
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            return nextWeek.toISOString().split('T')[0];
        }
        
        // Try to parse specific dates (YYYY-MM-DD, DD/MM/YYYY, etc.)
        const datePatterns = [
            /\\d{4}-\\d{2}-\\d{2}/, // YYYY-MM-DD
            /\\d{1,2}\/\\d{1,2}\/\\d{4}/, // DD/MM/YYYY or MM/DD/YYYY
            /\\d{1,2}-\\d{1,2}-\\d{4}/ // DD-MM-YYYY
        ];
        
        for (const pattern of datePatterns) {
            const match = text.match(pattern);
            if (match) {
                const dateStr = match[0];
                const parsedDate = new Date(dateStr);
                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate.toISOString().split('T')[0];
                }
            }
        }
        
        // Default to tomorrow
        return tomorrow.toISOString().split('T')[0];
    }

    parseTime(text) {
        // Look for time patterns
        const timePatterns = [
            /\\b([0-1]?[0-9]|2[0-3]):([0-5][0-9])\\b/, // HH:MM
            /\\b([0-1]?[0-9])\\s*([ap]m)\\b/i, // 3pm, 10am
            /\\b([0-1]?[0-9]):([0-5][0-9])\\s*([ap]m)\\b/i // 3:30pm
        ];
        
        for (const pattern of timePatterns) {
            const match = text.match(pattern);
            if (match) {
                if (match[2] && (match[2].toLowerCase() === 'pm' || match[2].toLowerCase() === 'am')) {
                    // Convert 12-hour to 24-hour
                    let hour = parseInt(match[1]);
                    if (match[2].toLowerCase() === 'pm' && hour !== 12) hour += 12;
                    if (match[2].toLowerCase() === 'am' && hour === 12) hour = 0;
                    return `${hour.toString().padStart(2, '0')}:${match[3] || '00'}`;
                } else {
                    return match[0];
                }
            }
        }
        
        // Default time
        return '20:00';
    }

    formatEventSummary(events) {
        return events.map((event, index) => 
            `${index + 1}. ${event.title}\\n   📅 ${event.date} at ${event.time}\\n   📍 ${event.location}`
        ).join('\\n\\n');
    }

    // Message templates
    getSportSelectionMessage(isAdditional = false) {
        const prefix = isAdditional ? '🔄 Adding another event!\\n\\n' : '';
        return `${prefix}🏟️ **Step 1: Choose Sport**\\n\\nWhat sport is your event?\\n\\nOptions:\\n🎾 Tennis\\n⚽ Football/Soccer\\n🏀 Basketball\\n🏒 Hockey\\n⚾ Baseball\\n🏌️ Golf\\n🏐 Volleyball\\n🏉 Rugby\\n\\nOr type any other sport name!`;
    }

    getTeamSelectionMessage(sport) {
        const sportEmoji = {
            tennis: '🎾',
            football: '⚽',
            basketball: '🏀',
            hockey: '🏒',
            baseball: '⚾',
            golf: '🏌️',
            volleyball: '🏐',
            rugby: '🏉'
        }[sport] || '🏟️';
        
        return `${sportEmoji} **Step 2: Teams/Players**\\n\\nWho's playing?\\n\\nExamples:\\n• "Barcelona vs Real Madrid"\\n• "Lakers Warriors"\\n• "Djokovic Alcaraz"\\n• "Championship Final"\\n\\nType the teams or players:`;
    }

    getDateSelectionMessage() {
        return `📅 **Step 3: Date**\\n\\nWhen is the event?\\n\\nExamples:\\n• "Tomorrow"\\n• "Next week"\\n• "2024-09-15"\\n• "15/09/2024"\\n• "September 15"\\n\\nType the date:`;
    }

    getTimeSelectionMessage() {
        return `🕐 **Step 4: Time**\\n\\nWhat time does it start?\\n\\nExamples:\\n• "7pm"\\n• "19:30"\\n• "3:00pm"\\n• "20:00"\\n\\nType the time:`;
    }

    getLocationSelectionMessage() {
        return `📍 **Step 5: Location**\\n\\nWhere is the event?\\n\\nExamples:\\n• "Wembley Stadium"\\n• "Camp Nou, Barcelona"\\n• "Madison Square Garden"\\n• "Home"\\n\\nType the location:`;
    }

    getMoreEventsMessage(eventCount) {
        return `✅ Event ${eventCount} added!\\n\\n🔄 **Add Another Event?**\\n\\nType:\\n• "Yes" or "Add more" → Create another event\\n• "No" or "Done" → Finish and generate calendar\\n\\nWhat would you like to do?`;
    }
}

module.exports = EventCustomizer;