import { ServiceResponse } from '@interfaces/service';
import { apiService, ApiResponse } from '@services/api-service';
import { handleGetAllEmployees, handleGetEmployeeDetails } from '../data-handlers/employment';
import { API_URL } from './config';
import {
  OrgChangeEmployment,
  OrgChangeOrganizationEmployee,
  OrgChangePersonEmployeeDetail,
} from '@data-contracts/backend/data-contracts';

/**
 *
 * @param people List of people to move
 * @returns No content
 */
export const changeEmployment: (people: OrgChangeEmployment[]) => Promise<ServiceResponse<string>> = (people) => {
  return apiService
    .put<ApiResponse<string>>(`${API_URL}/employment`, { people })
    .then((res) => ({
      data: res.data.data,
      message: res.data.message,
    }))
    .catch((e) => ({
      message: e.response?.data?.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 *
 * @param orgId Organization id
 * @param signal Axios signal to abort in BE
 * @returns List of employees for the orgId given
 */
export const getEmployeesByOrg: (
  orgId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrgChangeOrganizationEmployee[]; error?: string }> = (orgId, signal) => {
  return apiService
    .get<ApiResponse<OrgChangeOrganizationEmployee[]>>(`${API_URL}/employment/${orgId}`, { signal: signal })
    .then((res) => ({
      data: handleGetAllEmployees(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getEmployeeDetails: (
  personId: string,
  signal?: AbortSignal
) => Promise<{ data?: OrgChangePersonEmployeeDetail; error?: string; message?: string }> = (personId, signal) => {
  return apiService
    .get<ApiResponse<OrgChangePersonEmployeeDetail>>(`${API_URL}/employment/${personId}/detail`, {
      signal: signal,
    })
    .then((res) => ({
      data: handleGetEmployeeDetails(res.data),
    }))
    .catch((e) => ({
      message: e.response?.data?.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
