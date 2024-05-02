import { OrgOperation } from '@data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from '@services/api-service';
import { handleGetAllOperations } from '../data-handlers/operation';
import { API_PREFIX } from '../config';

/**
 *
 * @param orgId
 * @returns
 */
export const getOperationsByOrg: (
  orgId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrgOperation[]; error?: string }> = (orgId, signal) => {
  return apiService
    .get<ApiResponse<OrgOperation[]>>(`${API_PREFIX}/operation/${orgId}/operation`, { signal })
    .then((res) => ({
      data: handleGetAllOperations(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 *
 * @param orgId
 * @returns
 */
export const getOperationsByOrgAndUnder: (
  orgId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrgOperation[]; error?: string }> = (orgId, signal) => {
  return apiService
    .get<ApiResponse<OrgOperation[]>>(`${API_PREFIX}/operation/${orgId}/operationallleaves`, { signal })
    .then((res) => ({
      data: handleGetAllOperations(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
