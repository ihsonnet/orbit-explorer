import { useQuery } from '@tanstack/react-query';
import { getDayScenarios, getDayScenario, type DayScenario } from '@/lib/api';

export function useDayScenarios() {
  return useQuery<DayScenario[]>({
    queryKey: ['day-scenarios'],
    queryFn: getDayScenarios,
  });
}

export function useDayScenario(id: number) {
  return useQuery<DayScenario>({
    queryKey: ['day-scenario', id],
    queryFn: () => getDayScenario(id),
    enabled: id > 0,
  });
}
