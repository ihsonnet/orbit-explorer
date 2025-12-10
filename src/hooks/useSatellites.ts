import { useQuery } from '@tanstack/react-query';
import { getSatellitesAbove, getSatellites, getGlobalStats, type Satellite, type GlobalStats } from '@/lib/api';

export function useSatellitesAbove(lat: number | null, lon: number | null) {
  return useQuery<Satellite[]>({
    queryKey: ['satellites-above', lat, lon],
    queryFn: () => getSatellitesAbove(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 30000, // Refresh every 30 seconds
    refetchInterval: 30000,
  });
}

export function useSatellites(filters?: { type?: string; operator?: string; orbit_class?: string }) {
  return useQuery<Satellite[]>({
    queryKey: ['satellites', filters],
    queryFn: () => getSatellites(filters),
    staleTime: 60000,
  });
}

export function useGlobalStats() {
  return useQuery<GlobalStats>({
    queryKey: ['global-stats'],
    queryFn: getGlobalStats,
    staleTime: 60000,
  });
}
