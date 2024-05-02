import { MDVEmployee } from '@data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from '@services/api-service';
import { handleGetEmployee, handleGetEmployees } from '../data-handlers/employment';
import { API_PREFIX } from '../config';

export const getEmployeesByOrg: (
  orgId: number,
  signal?: AbortSignal
) => Promise<{ data?: MDVEmployee[]; error?: string }> = (orgId, signal) => {
  return apiService
    .get<ApiResponse<MDVEmployee[]>>(`${API_PREFIX}/employment/${orgId}/employees`, { signal: signal })
    .then((res) => ({
      data: handleGetEmployees(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getEmployeesByOrgAndUnder: (
  orgId: number,
  signal?: AbortSignal
) => Promise<{ data?: MDVEmployee[]; error?: string }> = (orgId, signal) => {
  return apiService
    .get<ApiResponse<MDVEmployee[]>>(`${API_PREFIX}/employment/${orgId}/employeesallleaves`, { signal: signal })
    .then((res) => ({
      data: handleGetEmployees(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getEmployeeDetails: (
  personId: string,
  signal?: AbortSignal
) => Promise<{ data?: MDVEmployee; error?: string }> = (personId, signal) => {
  return apiService
    .get<ApiResponse<MDVEmployee>>(`${API_PREFIX}/employment/${personId}/employeedetails`, { signal: signal })
    .then((res) => ({
      data: handleGetEmployee(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
