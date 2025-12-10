// API configuration - point to your local FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface Satellite {
  id: number;
  norad_id: string;
  name: string;
  operator: string;
  orbit_class: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  type: 'COMMUNICATION' | 'GNSS' | 'EARTH_OBSERVATION' | 'WEATHER' | 'SCIENCE' | 'OTHER';
  launch_date?: string;
  description: string;
  impact_tags: string[];
  latitude?: number;
  longitude?: number;
  altitude?: number;
  elevation?: number;
  azimuth?: number;
}

export interface DayScenario {
  id: number;
  name: string;
  description: string;
  steps: DayScenarioStep[];
}

export interface DayScenarioStep {
  id: number;
  order_index: number;
  title: string;
  time_of_day: string;
  description: string;
  satellite_types: string[];
  example_satellites?: string[];
}

export interface GlobalStats {
  total_satellites: number;
  by_orbit: Record<string, number>;
  by_type: Record<string, number>;
  by_operator: Record<string, number>;
}

// Fetch satellites visible above a location
export async function getSatellitesAbove(lat: number, lon: number, time?: string): Promise<Satellite[]> {
  const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString() });
  if (time) params.append('time', time);
  
  const response = await fetch(`${API_BASE_URL}/satellites/over?${params}`);
  if (!response.ok) throw new Error('Failed to fetch satellites');
  return response.json();
}

// Fetch all satellites with optional filters
export async function getSatellites(filters?: {
  type?: string;
  operator?: string;
  orbit_class?: string;
}): Promise<Satellite[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.operator) params.append('operator', filters.operator);
  if (filters?.orbit_class) params.append('orbit_class', filters.orbit_class);
  
  const response = await fetch(`${API_BASE_URL}/satellites?${params}`);
  if (!response.ok) throw new Error('Failed to fetch satellites');
  return response.json();
}

// Fetch day scenarios
export async function getDayScenarios(): Promise<DayScenario[]> {
  const response = await fetch(`${API_BASE_URL}/day-scenarios`);
  if (!response.ok) throw new Error('Failed to fetch scenarios');
  return response.json();
}

// Fetch a specific day scenario
export async function getDayScenario(id: number): Promise<DayScenario> {
  const response = await fetch(`${API_BASE_URL}/day-scenarios/${id}`);
  if (!response.ok) throw new Error('Failed to fetch scenario');
  return response.json();
}

// Fetch global statistics
export async function getGlobalStats(): Promise<GlobalStats> {
  const response = await fetch(`${API_BASE_URL}/global/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

// Fetch satellite types
export async function getSatelliteTypes(): Promise<{ code: string; display_name: string; description: string }[]> {
  const response = await fetch(`${API_BASE_URL}/satellite-types`);
  if (!response.ok) throw new Error('Failed to fetch satellite types');
  return response.json();
}
