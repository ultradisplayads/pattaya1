'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Users, 
  ChevronRight,
  RefreshCw,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types for Sports Fixtures
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

interface SportsFixturesData {
  fixtures: Fixture[];
  lastUpdated: string;
  totalFixtures: number;
}

// Fallback data for demonstration
const fallbackData: SportsFixturesData = {
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
  totalFixtures: 6
};

interface SportsFixturesWidgetProps {
  className?: string;
  title?: string;
  showHeader?: boolean;
  maxFixtures?: number;
  refreshInterval?: number;
}

export default function SportsFixturesWidget({
  className,
  title = "Sports Fixtures",
  showHeader = true,
  maxFixtures = 10,
  refreshInterval = 300000 // 5 minutes
}: SportsFixturesWidgetProps) {
  const [data, setData] = useState<SportsFixturesData>(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredFixtures, setFilteredFixtures] = useState<Fixture[]>(fallbackData.fixtures);

  // API Functions (commented out for now)
  /*
  const fetchSportsFixtures = async (): Promise<SportsFixturesData> => {
    try {
      const response = await fetch('/api/sports-fixtures', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching sports fixtures:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newData = await fetchSportsFixtures();
      setData(newData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sports fixtures');
      // Fallback to cached data or show error state
    } finally {
      setLoading(false);
    }
  };
  */

  // Simulated refresh function for demo
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, just update the timestamp
    setData(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString()
    }));
    
    setLoading(false);
  };

  // Filter fixtures based on active tab
  useEffect(() => {
    let filtered = data.fixtures;
    
    switch (activeTab) {
      case 'upcoming':
        filtered = data.fixtures.filter(fixture => fixture.status === 'upcoming');
        break;
      case 'live':
        filtered = data.fixtures.filter(fixture => fixture.status === 'live');
        break;
      case 'finished':
        filtered = data.fixtures.filter(fixture => fixture.status === 'finished');
        break;
      default:
        filtered = data.fixtures;
    }
    
    setFilteredFixtures(filtered.slice(0, maxFixtures));
  }, [data.fixtures, activeTab, maxFixtures]);

  // Auto-refresh functionality (commented out for now)
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);
  */

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge variant="destructive" className="animate-pulse">LIVE</Badge>;
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      case 'finished':
        return <Badge variant="outline">Finished</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getCompetitionColor = (competition: string) => {
    const colors: { [key: string]: string } = {
      'Premier League': 'bg-blue-100 text-blue-800',
      'La Liga': 'bg-yellow-100 text-yellow-800',
      'Bundesliga': 'bg-red-100 text-red-800',
      'Ligue 1': 'bg-green-100 text-green-800',
      'Serie A': 'bg-purple-100 text-purple-800',
      'Champions League': 'bg-indigo-100 text-indigo-800',
    };
    return colors[competition] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className={cn("w-full", className)}>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-orange-500" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshData}
                disabled={loading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {data.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
      )}

      <CardContent className="pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All ({data.fixtures.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs">
              Upcoming ({data.fixtures.filter(f => f.status === 'upcoming').length})
            </TabsTrigger>
            <TabsTrigger value="live" className="text-xs">
              Live ({data.fixtures.filter(f => f.status === 'live').length})
            </TabsTrigger>
            <TabsTrigger value="finished" className="text-xs">
              Results ({data.fixtures.filter(f => f.status === 'finished').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {error && (
              <div className="text-center py-4">
                <p className="text-sm text-red-500 mb-2">{error}</p>
                <Button variant="outline" size="sm" onClick={refreshData}>
                  Try Again
                </Button>
              </div>
            )}

            {filteredFixtures.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No fixtures found for the selected filter
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFixtures.map((fixture) => (
                  <div
                    key={fixture.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getCompetitionColor(fixture.competition))}
                        >
                          {fixture.competition}
                        </Badge>
                        {fixture.matchday && (
                          <Badge variant="outline" className="text-xs">
                            MD {fixture.matchday}
                          </Badge>
                        )}
                      </div>
                      {getStatusBadge(fixture.status)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Home Team */}
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <span className="text-sm font-medium text-right">
                            {fixture.homeTeam.name}
                          </span>
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {fixture.homeTeam.shortName}
                            </span>
                          </div>
                        </div>

                        {/* Score/Time */}
                        <div className="flex flex-col items-center gap-1 px-4">
                          {fixture.status === 'finished' ? (
                            <div className="text-lg font-bold">
                              {fixture.homeScore} - {fixture.awayScore}
                            </div>
                          ) : fixture.status === 'live' ? (
                            <div className="text-lg font-bold text-red-500">
                              {fixture.homeScore} - {fixture.awayScore}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              {formatTime(fixture.time)}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {formatDate(fixture.date)}
                          </div>
                        </div>

                        {/* Away Team */}
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {fixture.awayTeam.shortName}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {fixture.awayTeam.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {fixture.venue}
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Details
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredFixtures.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  View All Fixtures
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
