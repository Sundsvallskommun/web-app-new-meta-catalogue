import { apiService, ApiResponse } from '@services/api-service';
import { handleGetPaTeamResults, handleGetPaTeamsByManager } from '../data-handlers/pateam';
import { API_URL } from './config';
import { PATeamAndManager, PATeamSearchResult } from '@data-contracts/backend/data-contracts';

/**
 *
 * @param query Search query
 * @returns
 */
export const getPaTeamSearchResults: (query: string) => Promise<{ data?: PATeamSearchResult[]; error?: string }> = (
  query
) => {
  return apiService
    .get<ApiResponse<PATeamSearchResult[]>>(`${API_URL}/pateam/search`, { params: { query } })
    .then((res) => ({
      data: handleGetPaTeamResults(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 *
 * @param managerId id of the manager
 * @returns a list of PA-teams by manager
 */
export const getPaTeamsByManager: (managerId: string) => Promise<{ data?: PATeamAndManager[]; error?: string }> = (
  managerId
) => {
  return apiService
    .get<ApiResponse<PATeamAndManager[]>>(`${API_URL}/pateam`, { params: { managerId } })
    .then((res) => ({
      data: handleGetPaTeamsByManager(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
