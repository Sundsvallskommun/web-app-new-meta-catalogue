import { OrgChangeObject } from '@data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from '@services/api-service';
import { handleGetAllObjectsInCompany } from '../data-handlers/object';
import { API_URL } from './config';

/**
 *
 * @param companyId Company id
 * @param signal Axios signal to abort in BE
 * @returns List of objects for the orgId given
 */
export const getObjectsByCompany: (
  companyId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrgChangeObject[]; error?: string }> = (companyId, signal) => {
  return apiService
    .get<ApiResponse<OrgChangeObject[]>>(`${API_URL}/object/${companyId}`, { signal })
    .then((res) => ({
      data: handleGetAllObjectsInCompany(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
