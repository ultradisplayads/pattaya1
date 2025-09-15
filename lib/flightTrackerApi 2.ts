interface FlightSearchParams {
  flight_number?: string;
  airline?: string;
  departure_airport?: string;
  arrival_airport?: string;
  date?: string;
}

interface LiveFlightsParams {
  airport: string;
  flight_type?: 'arrival' | 'departure' | 'all';
  limit?: number;
  offset?: number;
}

export const flightTrackerApi = {
  async getLiveFlights(params: LiveFlightsParams) {
    const { airport, flight_type = 'all', limit = 50 } = params;
    
    // Try cached data first (which is working)
    try {
      const query = new URLSearchParams({
        airport,
        limit: limit.toString(),
      });
      
      if (flight_type !== 'all') {
        query.append('type', flight_type === 'arrival' ? 'arrivals' : 'departures');
      }

      const response = await fetch(`/api/flight-tracker/cached?${query}`);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.warn('Cached data not available, trying live endpoint');
    }

    // Fallback to live endpoint
    const response = await fetch(`/api/flight-tracker/flights/${airport}`);
    if (!response.ok) {
      throw new Error('Failed to fetch live flights');
    }
    return response.json();
  },

  async searchFlights(params: FlightSearchParams) {
    // First try to search in cached data
    try {
      const query = new URLSearchParams();
      
      if (params.flight_number) {
        // Search cached data for specific flight number
        const response = await fetch(`/api/flight-tracker/cached?airport=BKK&limit=100`);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            // Filter cached flights by flight number
            const filteredFlights = data.data.filter((flight: any) => 
              flight.FlightNumber?.includes(params.flight_number!) ||
              flight.FlightNumber?.endsWith(params.flight_number!)
            );
            
            if (filteredFlights.length > 0) {
              return { data: filteredFlights };
            }
          }
        }
      }
      
      if (params.departure_airport && params.arrival_airport) {
        // Search cached data for route
        const response = await fetch(`/api/flight-tracker/cached?airport=${params.departure_airport}&limit=100`);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            // This is a simplified route search - in practice you'd need more sophisticated filtering
            return { data: data.data.slice(0, 5) }; // Return first 5 flights as sample
          }
        }
      }
    } catch (error) {
      console.warn('Cached search failed, trying live search');
    }

    // Fallback to live search (may not work due to API limits)
    const query = new URLSearchParams();
    if (params.flight_number) query.append('flight_number', params.flight_number);
    if (params.airline) query.append('airline', params.airline);
    if (params.departure_airport) query.append('departure_airport', params.departure_airport);
    if (params.arrival_airport) query.append('arrival_airport', params.arrival_airport);
    if (params.date) query.append('date', params.date);

    const response = await fetch(`/api/flight-tracker/search?${query}`);
    if (!response.ok) {
      throw new Error('No flights found');
    }
    return response.json();
  },

  async getServiceStatus() {
    const response = await fetch('/api/flight-tracker/status');
    if (!response.ok) {
      throw new Error('Failed to fetch service status');
    }
    return response.json();
  },

  async getAllAirports() {
    const response = await fetch('/api/flight-tracker/airports');
    if (!response.ok) {
      throw new Error('Failed to fetch airports');
    }
    return response.json();
  },

  async getAirportStatus(iata: string) {
    const response = await fetch(`/api/flight-tracker/airport/${iata}`);
    if (!response.ok) {
      throw new Error('Failed to fetch airport status');
    }
    return response.json();
  },

  async getAirlineInfo(iata: string) {
    const response = await fetch(`/api/flight-tracker/airline/${iata}`);
    if (!response.ok) {
      throw new Error('Failed to fetch airline information');
    }
    return response.json();
  }
};
