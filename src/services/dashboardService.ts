import { doRequest } from '@/services/apiClient.ts';
import type { MoviesCategory } from '@/types/movies.d.ts';

export interface DashboardPayload {
  section?: 'string';
}

export const DashboardService = {
  fetchDashBoardList: async (payload: DashboardPayload): Promise<MoviesCategory[]> => {
    return await doRequest({ url: 'api/dashboard', method: 'POST', payload });
  }
};
