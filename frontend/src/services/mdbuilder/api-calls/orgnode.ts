import { ServiceResponse } from '@interfaces/service';
import { apiService, ApiResponse } from '@services/api-service';
import {
  handleSendAddNode,
  handleSendCreateNode,
  handleMoveNode,
  handleRenameNode,
  handleChangeNodeRespCode,
} from '../data-handlers/orgnode';
import { API_URL } from './config';
import {
  OrgnodeAddDto,
  OrgnodeChangeRespCodeDto,
  OrgnodeCreateDto,
  OrgnodeMoveDto,
  OrgnodeRenameDto,
} from '@data-contracts/backend/data-contracts';

/**
 * addExistingNodeToTree
 *
 * @returns adding existing node structures to tree in draft
 */
export const addExistingNodeToTree: (node?: OrgnodeAddDto) => Promise<ServiceResponse<boolean>> = (node) => {
  return apiService
    .put<ApiResponse<string>>(`${API_URL}/orgnode/add`, handleSendAddNode(node))
    .then((res) => ({
      data: true,
      message: res.data.data,
    }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * createNode
 *
 * @returns creating a new node/branch
 */
export const createNode: (cNode: OrgnodeCreateDto) => Promise<ServiceResponse<number>> = (cNode) => {
  return apiService
    .post<ApiResponse<number>>(`${API_URL}/orgnode`, handleSendCreateNode(cNode))
    .then((res) => ({
      data: res.data.data,
      message: res.data.message,
    }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * orgNodeMove
 *
 * @returns moves a node and its underlying node structure
 */
export const orgNodeMove: (body: OrgnodeMoveDto) => Promise<ServiceResponse<boolean>> = (body) => {
  return apiService
    .put<ApiResponse<string>>(`${API_URL}/orgnode/move`, handleMoveNode(body))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * orgNodeRename
 *
 * @returns edit on name, short name, abbreviation
 */
export const orgNodeRename: (rNode: OrgnodeRenameDto) => Promise<ServiceResponse<boolean>> = (rNode) => {
  return apiService
    .put<ApiResponse<string>>(`${API_URL}/orgnode/rename`, handleRenameNode(rNode))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * orgNodeRename
 *
 * @returns edit on name, short name, abbreviation
 */
export const orgNodeChangeRespCode: (crNode: OrgnodeChangeRespCodeDto) => Promise<ServiceResponse<boolean>> = (
  crNode
) => {
  return apiService
    .put<ApiResponse<string>>(`${API_URL}/orgnode/responsibilitycodepart`, handleChangeNodeRespCode(crNode))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * orgNodeRemovefromDraft
 *
 * @returns removes a node/branch and its underlying structure from draft
 */
export const orgNodeRemovefromDraft: (orgId: number) => Promise<ServiceResponse<boolean>> = (orgId) => {
  return apiService
    .put<ApiResponse<string>>(`${API_URL}/orgnode/${orgId}/remove`, {})
    .then(() => ({ data: true }))
    .catch((e) => ({ message: e.response.data.message, error: e.response?.status ?? 'UNKNOWN ERROR' }));
};

/**
 * orgNodeTerminate
 *
 * @returns terminates a node/branch and its underlying structure from the system
 */
export const orgNodeTerminate: (orgId: number) => Promise<ServiceResponse<boolean>> = (orgId) => {
  return apiService
    .delete<ApiResponse<string>>(`${API_URL}/orgnode/${orgId}`)
    .then(() => ({ data: true }))
    .catch((e) => ({ message: e.response.data.message, error: e.response?.status ?? 'UNKNOWN ERROR' }));
};

/**
 * undoTerminate
 *
 * @returns undo a terminate of node/branch
 */
export const undoOrgNodeTerminate: (orgId: number) => Promise<ServiceResponse<boolean>> = (orgId) => {
  return apiService
    .post<ApiResponse<string>>(`${API_URL}/orgnode/undodelete/${orgId}`, { orgId })
    .then(() => ({ data: true }))
    .catch((e) => ({ message: e.response.data.message, error: e.response?.status ?? 'UNKNOWN ERROR' }));
};
