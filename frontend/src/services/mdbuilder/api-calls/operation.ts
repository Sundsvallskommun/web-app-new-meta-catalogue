import {
  ConnectOperationDto,
  DisconnectOperationDto,
  OrgChangeOperation,
  OrgChangeOrganizationOperation,
} from '@data-contracts/backend/data-contracts';
import { ServiceResponse } from '@interfaces/service';
import { ApiResponse, apiService } from '@services/api-service';
import {
  handleConnectOperation,
  handleDisconnectOperation,
  handleGetAllOperationsInCompany,
  handleGetAllOperationsInOrg,
} from '../data-handlers/operation';
import { API_URL } from './config';

/**
 *
 * @param orgId Organization id
 * @param signal Axios signal to abort in BE
 * @returns List of operations for the orgId given
 */
export const getOperationsByOrg: (
  orgId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrgChangeOrganizationOperation[]; error?: string }> = (orgId, signal) => {
  return apiService
    .get<ApiResponse<OrgChangeOrganizationOperation[]>>(`${API_URL}/operation/organization/${orgId}`, { signal })
    .then((res) => ({
      data: handleGetAllOperationsInOrg(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 *
 * @param companyId Company id
 * @param signal Axios signal to abort in BE
 * @returns List of operations for the orgId given
 */
export const getOperationsByCompany: (
  companyId: number,
  signal?: AbortSignal
) => Promise<{ data?: OrgChangeOperation[]; error?: string }> = (companyId, signal) => {
  return apiService
    .get<ApiResponse<OrgChangeOperation[]>>(`${API_URL}/operation/${companyId}`, { signal })
    .then((res) => ({
      data: handleGetAllOperationsInCompany(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * ConnectOperation
 *
 * @returns Connects on operationId, orgId
 */
export const connectOperation: (operation: ConnectOperationDto) => Promise<ServiceResponse<boolean>> = (operation) => {
  return apiService
    .put<ApiResponse<string>>(`${API_URL}/operation/connect`, handleConnectOperation(operation))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * DisconnectOperation
 *
 * @returns Disconnects on organizationOperationId
 */
export const disconnectOperation: (operation: DisconnectOperationDto) => Promise<ServiceResponse<boolean>> = (
  operation
) => {
  return apiService
    .put<ApiResponse<string>>(`${API_URL}/operation/disconnect`, handleDisconnectOperation(operation))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
