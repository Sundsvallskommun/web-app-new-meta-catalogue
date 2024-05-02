import { SearchResult } from '@data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from '@services/api-service';
import { handleGetSearchResults } from '../data-handlers/search';
import { API_PREFIX } from '../config';

/**
 *
 * @param query Search query
 * @returns
 */
export const getSearchResults: (query: string) => Promise<{ data?: SearchResult[]; error?: string }> = (query) => {
  return apiService
    .get<ApiResponse<SearchResult[]>>(`${API_PREFIX}/search/${query}/search`)
    .then((res) => ({
      data: handleGetSearchResults(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
