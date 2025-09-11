import { NextRequest, NextResponse } from 'next/server';

// Types for Sports Fixtures API
interface Team {
  id: string;
  name: string;
  logo?: string;
  shortName: string;
}

interface Fixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: string;
  venue: string;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'finished';
  homeScore?: number;
  awayScore?: number;
  matchday?: number;
  season: string;
}

interface SportsFixturesResponse {
  fixtures: Fixture[];
  lastUpdated: string;
  totalFixtures: number;
  success: boolean;
  message?: string;
}

// Fallback data for when external API is not available
const fallbackData: SportsFixturesResponse = {
  fixtures: [
    {
      id: '1',
      homeTeam: { id: '1', name: 'Manchester United', shortName: 'MUN', logo: '/api/placeholder/40/40' },
      awayTeam: { id: '2', name: 'Liverpool FC', shortName: 'LIV', logo: '/api/placeholder/40/40' },
      competition: 'Premier League',
      venue: 'Old Trafford',
      date: '2024-01-15',
      time: '15:30',
      status: 'upcoming',
      matchday: 21,
      season: '2023/24'
    },
    {
      id: '2',
      homeTeam: { id: '3', name: 'Arsenal', shortName: 'ARS', logo: '/api/placeholder/40/40' },
      awayTeam: { id: '4', name: 'Chelsea', shortName: 'CHE', logo: '/api/placeholder/40/40' },
      competition: 'Premier League',
      venue: 'Emirates Stadium',
      date: '2024-01-14',
      time: '17:30',
      status: 'live',
      homeScore: 2,
      awayScore: 1,
      matchday: 21,
      season: '2023/24'
    },
    {
      id: '3',
      homeTeam: { id: '5', name: 'Barcelona', shortName: 'BAR', logo: '/api/placeholder/40/40' },
      awayTeam: { id: '6', name: 'Real Madrid', shortName: 'RMA', logo: '/api/placeholder/40/40' },
      competition: 'La Liga',
      venue: 'Camp Nou',
      date: '2024-01-13',
      time: '20:00',
      status: 'finished',
      homeScore: 3,
      awayScore: 2,
      matchday: 20,
      season: '2023/24'
    },
    {
      id: '4',
      homeTeam: { id: '7', name: 'Bayern Munich', shortName: 'BAY', logo: '/api/placeholder/40/40' },
      awayTeam: { id: '8', name: 'Borussia Dortmund', shortName: 'BVB', logo: '/api/placeholder/40/40' },
      competition: 'Bundesliga',
      venue: 'Allianz Arena',
      date: '2024-01-16',
      time: '18:30',
      status: 'upcoming',
      matchday: 17,
      season: '2023/24'
    },
    {
      id: '5',
      homeTeam: { id: '9', name: 'PSG', shortName: 'PSG', logo: '/api/placeholder/40/40' },
      awayTeam: { id: '10', name: 'Marseille', shortName: 'MAR', logo: '/api/placeholder/40/40' },
      competition: 'Ligue 1',
      venue: 'Parc des Princes',
      date: '2024-01-17',
      time: '21:00',
      status: 'upcoming',
      matchday: 18,
      season: '2023/24'
    },
    {
      id: '6',
      homeTeam: { id: '11', name: 'Inter Milan', shortName: 'INT', logo: '/api/placeholder/40/40' },
      awayTeam: { id: '12', name: 'AC Milan', shortName: 'MIL', logo: '/api/placeholder/40/40' },
      competition: 'Serie A',
      venue: 'San Siro',
      date: '2024-01-12',
      time: '20:45',
      status: 'finished',
      homeScore: 1,
      awayScore: 0,
      matchday: 19,
      season: '2023/24'
    }
  ],
  lastUpdated: new Date().toISOString(),
  totalFixtures: 6,
  success: true,
  message: 'Using fallback data - external API not configured'
};

// External API configuration (commented out for now)
/*
const SPORTS_API_BASE_URL = process.env.SPORTS_API_BASE_URL || 'https://api.sportsfixtures.net';
const SPORTS_API_KEY = process.env.SPORTS_API_KEY;

const fetchFromExternalAPI = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
  const url = new URL(`${SPORTS_API_BASE_URL}${endpoint}`);
  
  // Add API key if available
  if (SPORTS_API_KEY) {
    url.searchParams.append('api_key', SPORTS_API_KEY);
  }
  
  // Add other parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Pattaya-News-App/1.0',
    },
    // Add timeout
    signal: AbortSignal.timeout(10000), // 10 seconds timeout
  });

  if (!response.ok) {
    throw new Error(`External API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const transformExternalData = (externalData: any): SportsFixturesResponse => {
  // Transform external API data to our internal format
  const fixtures: Fixture[] = externalData.fixtures?.map((fixture: any) => ({
    id: fixture.id || fixture.match_id,
    homeTeam: {
      id: fixture.home_team?.id || fixture.home_team_id,
      name: fixture.home_team?.name || fixture.home_team_name,
      shortName: fixture.home_team?.short_name || fixture.home_team_short,
      logo: fixture.home_team?.logo || fixture.home_team_logo,
    },
    awayTeam: {
      id: fixture.away_team?.id || fixture.away_team_id,
      name: fixture.away_team?.name || fixture.away_team_name,
      shortName: fixture.away_team?.short_name || fixture.away_team_short,
      logo: fixture.away_team?.logo || fixture.away_team_logo,
    },
    competition: fixture.competition || fixture.league || 'Unknown',
    venue: fixture.venue || fixture.stadium || 'TBD',
    date: fixture.date || fixture.match_date,
    time: fixture.time || fixture.match_time,
    status: fixture.status === 'live' ? 'live' : 
            fixture.status === 'finished' || fixture.status === 'completed' ? 'finished' : 'upcoming',
    homeScore: fixture.home_score || fixture.home_goals,
    awayScore: fixture.away_score || fixture.away_goals,
    matchday: fixture.matchday || fixture.round || fixture.gameweek,
    season: fixture.season || '2023/24',
  })) || [];

  return {
    fixtures,
    lastUpdated: new Date().toISOString(),
    totalFixtures: fixtures.length,
    success: true,
    message: 'Data fetched from external API'
  };
};
*/

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const competition = searchParams.get('competition');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const team = searchParams.get('team');

    // For now, return fallback data
    // TODO: Implement external API integration when available
    /*
    try {
      const params: Record<string, string> = {};
      
      if (competition) params.competition = competition;
      if (status) params.status = status;
      if (limit) params.limit = limit;
      if (team) params.team = team;

      const externalData = await fetchFromExternalAPI('/fixtures', params);
      const transformedData = transformExternalData(externalData);
      
      return NextResponse.json(transformedData, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
        },
      });
    } catch (externalError) {
      console.error('External API error:', externalError);
      // Fall back to fallback data
    }
    */

    // Apply filters to fallback data
    let filteredFixtures = fallbackData.fixtures;

    if (competition) {
      filteredFixtures = filteredFixtures.filter(f => 
        f.competition.toLowerCase().includes(competition.toLowerCase())
      );
    }

    if (status) {
      filteredFixtures = filteredFixtures.filter(f => f.status === status);
    }

    if (team) {
      filteredFixtures = filteredFixtures.filter(f => 
        f.homeTeam.name.toLowerCase().includes(team.toLowerCase()) ||
        f.awayTeam.name.toLowerCase().includes(team.toLowerCase())
      );
    }

    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredFixtures = filteredFixtures.slice(0, limitNum);
      }
    }

    const response: SportsFixturesResponse = {
      ...fallbackData,
      fixtures: filteredFixtures,
      totalFixtures: filteredFixtures.length,
      message: 'Using fallback data - external API not configured'
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
      },
    });

  } catch (error) {
    console.error('Sports fixtures API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch sports fixtures',
        fixtures: [],
        totalFixtures: 0,
        lastUpdated: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint for webhook updates from external API
/*
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle webhook from external sports API
    // This could be used to update cached data or trigger real-time updates
    
    const { event, data } = body;
    
    switch (event) {
      case 'fixture_updated':
        // Update specific fixture
        break;
      case 'score_updated':
        // Update live scores
        break;
      case 'fixture_finished':
        // Mark fixture as finished
        break;
      default:
        console.log('Unknown webhook event:', event);
    }
    
    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, message: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
*/
