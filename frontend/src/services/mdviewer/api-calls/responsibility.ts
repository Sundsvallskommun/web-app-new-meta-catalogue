import { OrganizationResponsibility } from '@data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from '@services/api-service';
import { handleGetAllResponsibilities } from '../data-handlers/responsibility';
import { API_PREFIX } from '../config';

/**
 * getResponsibilities
 *
 * @returns all responsibilities
 */
export const getResponsibilities: (
  selectedCompanyOrgId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrganizationResponsibility[]; error?: string }> = (selectedCompanyOrgId, signal) => {
  return apiService
    .get<ApiResponse<OrganizationResponsibility[]>>(
      `${API_PREFIX}/responsibility/${selectedCompanyOrgId}/responsibilitysallcompany`,
      { signal }
    )
    .then((res) => ({
      data: handleGetAllResponsibilities(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * getAllFreeResponsibilities
 *
 * @returns list for all responsibilities filtered by not connected to an org
 */

export const getAllFreeResponsibilities: (
  signal?: AbortSignal
) => Promise<{ data?: OrganizationResponsibility[]; error?: string }> = (signal) => {
  return apiService
    .get<ApiResponse<OrganizationResponsibility[]>>(`${API_PREFIX}/responsibility/responsibilities`, { signal })
    .then((res) => {
      const data = handleGetAllResponsibilities(res.data);
      const arr = data.filter((r) => r?.orgId === null);
      return { data: arr };
    })
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * getResponsibilitiesByOrgAndUnder
 *
 * @returns Get responsiblities by Company ID<number>
 */
export const getResponsibilitiesByOrgAndUnder: (
  orgId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrganizationResponsibility[]; error?: string }> = (orgId, signal) => {
  return apiService
    .get<ApiResponse<OrganizationResponsibility[]>>(`${API_PREFIX}/responsibility/${orgId}/responsibilitysallleaves`, {
      signal,
    })
    .then((res) => ({
      data: handleGetAllResponsibilities(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * getResponsibilitiesByOrg
 *
 * @returns Get responsiblities by Org ID<number>
 */
export const getResponsibilitiesByOrg: (
  orgId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrganizationResponsibility[]; error?: string }> = (orgId, signal) => {
  return apiService
    .get<ApiResponse<OrganizationResponsibility[]>>(`${API_PREFIX}/responsibility/${orgId}/responsibilities`, {
      signal,
    })
    .then((res) => ({
      data: handleGetAllResponsibilities(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
