import {
  CloseResponsibilityDto,
  OrgChangeResponsibility,
  RenameResponsibilityDto,
  ResponsibilityCreateDto,
} from '@data-contracts/backend/data-contracts';
import { ServiceResponse } from '@interfaces/service';
import { ApiResponse, apiService } from '@services/api-service';
import {
  handleCloseResponsibility,
  handleGetResponsibilitiesByOrg,
  handleRenameResponsibility,
  handleSendNewResponsibility,
} from '../data-handlers/responsibility';
import { API_URL } from './config';

/**
 * newResponsibility
 *
 * @returns true or error with message
 */
export const newResponsibility: (responsibility: ResponsibilityCreateDto) => Promise<ServiceResponse<boolean>> = (
  responsibility
) => {
  return apiService
    .post<ApiResponse<string>>(`${API_URL}/responsibility`, handleSendNewResponsibility(responsibility))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response?.data?.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 *
 * @param draftId Draft id
 * @param orgId Organization id
 * @param signal Axios signal to abort in BE
 * @returns List of operations for the orgId given
 */
export const getResponsibilitiesByOrg: (
  draftId: string,
  orgId: number,
  signal?: AbortSignal
) => Promise<ServiceResponse<OrgChangeResponsibility[]>> = (draftId, orgId, signal) => {
  return apiService
    .get<ApiResponse<OrgChangeResponsibility[]>>(`${API_URL}/responsibility/${draftId}`, {
      signal,
      params: { orgId: orgId },
    })
    .then((res) => ({
      data: handleGetResponsibilitiesByOrg(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 *
 * @param responsibilityCodePart Organization code
 * @returns Get new responsibilityCode suggestion
 */
export const getNewResponsibilityCodeSuggestion: (
  responsibilityCodePart: OrgChangeResponsibility['responsibilityCode'],
  responsibilityTypeId: OrgChangeResponsibility['responsibilityTypeId']
) => Promise<ServiceResponse<OrgChangeResponsibility['responsibilityCode']>> = (
  responsibilityCodePart,
  responsibilityTypeId
) => {
  return apiService
    .get<ApiResponse<OrgChangeResponsibility['responsibilityCode']>>(
      `${API_URL}/responsibility/${responsibilityCodePart}/newcode`,
      {
        params: { responsibilityType: responsibilityTypeId },
      }
    )
    .then((res) => ({
      data: res.data.data,
    }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * renameResponsibility
 *
 * @returns edits a responsibility name
 */
export const renameResponsibility: (responsibility: RenameResponsibilityDto) => Promise<ServiceResponse<boolean>> = (
  responsibility
) => {
  return apiService
    .put(`${API_URL}/responsibility/rename`, handleRenameResponsibility(responsibility))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * closeResponsibility
 *
 * @returns closes a responsibility
 */
export const closeResponsibility: (responsibility: CloseResponsibilityDto) => Promise<ServiceResponse<boolean>> = (
  responsibility
) => {
  return apiService
    .put(`${API_URL}/responsibility/close`, handleCloseResponsibility(responsibility))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
