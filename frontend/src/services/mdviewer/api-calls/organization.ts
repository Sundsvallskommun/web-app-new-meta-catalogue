import { Organization, OrganizationTree } from '@data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from '@services/api-service';
import { handleGetCompanyOrg, handleGetRootTree } from '../data-handlers/organization';
import { API_PREFIX } from '../config';

export const getRootOrg: () => Promise<{ data?: Organization[]; error?: string }> = () => {
  return apiService
    .get<ApiResponse<Organization[]>>(`${API_PREFIX}/organization/root`)
    .then((res) => ({
      data: handleGetRootTree(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getOrgTree: (orgId: number, view: number) => Promise<{ data?: OrganizationTree[]; error?: string }> = (
  orgId,
  view
) => {
  return apiService
    .get<ApiResponse<OrganizationTree[]>>(`${API_PREFIX}/organization/${orgId}/orgtree/${view}`)
    .then((res) => ({
      data: res.data.data,
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getCompanyOrganizations: (
  companyId: number,
  signal?: AbortSignal
) => Promise<{ data?: Organization[]; error?: string }> = (companyId, signal) => {
  return apiService
    .get<ApiResponse<Organization[]>>(`${API_PREFIX}/organization/${companyId}/company`, { signal: signal })
    .then((res) => ({
      data: handleGetCompanyOrg(res.data.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
