import { OrgChangeProject } from '@data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from '@services/api-service';
import { handleGetAllProjectsInCompany } from '../data-handlers/project';
import { API_URL } from './config';

/**
 *
 * @param companyId Company id
 * @param signal Axios signal to abort in BE
 * @returns List of projects for the orgId given
 */
export const getProjectsByCompany: (
  companyId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrgChangeProject[]; error?: string }> = (companyId, signal) => {
  return apiService
    .get<ApiResponse<OrgChangeProject[]>>(`${API_URL}/project/${companyId}`, { signal })
    .then((res) => ({
      data: handleGetAllProjectsInCompany(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
