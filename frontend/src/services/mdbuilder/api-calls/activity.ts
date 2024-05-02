import { OrgChangeActivity } from '@data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from '@services/api-service';
import { handleGetAllActivitiesInCompany } from '../data-handlers/activity';
import { API_URL } from './config';

/**
 *
 * @param companyId Company id
 * @param signal Axios signal to abort in BE
 * @returns List of activities for the orgId given
 */
export const getActivitiesByCompany: (
  companyId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrgChangeActivity[]; error?: string }> = (companyId, signal) => {
  return apiService
    .get<ApiResponse<OrgChangeActivity[]>>(`${API_URL}/activity/${companyId}`, { signal })
    .then((res) => ({
      data: handleGetAllActivitiesInCompany(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
