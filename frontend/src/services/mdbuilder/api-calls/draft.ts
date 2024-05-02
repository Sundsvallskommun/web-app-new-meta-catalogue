import {
  CheckedOutOrganizationLevel2,
  Draft,
  DraftChangeCutOffDateDto,
  DraftComment,
  DraftRenameDto,
  DraftRunbook,
  InitialOrgStructureToExport,
  NewDraftDto,
  OrgChangeOrganizationTree,
  PostDraftCommentDto,
  RunBookActionTriggerDtoCommandEnum,
  VerifyResult,
} from '@data-contracts/backend/data-contracts';
import { ServiceResponse } from '@interfaces/service';
import { ApiResponse, apiService } from '@services/api-service';
import {
  handleGetCheckedOutOrganizationLevel2,
  handleGetDraft,
  handleGetDraftComments,
  handleGetDrafts,
  handleGetRunbook,
  handleRunVerify,
  handleSendDraft,
  handleSendDraftComment,
  handleSendDraftCutOffDate,
  handleSendDraftName,
  handleSendTrigger,
} from '../data-handlers/draft';
import { API_URL } from './config';

/**
 * newDraft
 *
 * @returns  new saved draft with data
 */
export const newDraft: (draft: NewDraftDto) => Promise<ServiceResponse<string>> = (draft) => {
  return apiService
    .post<ApiResponse<string>>(`${API_URL}/draft`, handleSendDraft(draft))
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
 * getDrafts
 *
 * @returns all drafts
 */
export const getDrafts: (signal?: AbortSignal) => Promise<{ data?: Draft[]; error?: string }> = (signal) => {
  return apiService
    .get<ApiResponse<Draft[]>>(`${API_URL}/drafts`, { signal })
    .then((res) => ({
      data: handleGetDrafts(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * getDraft
 *
 * @returns a draft by id
 */
export const getDraft: (draftId: string, signal?) => Promise<{ data?: Draft; error?: string }> = (draftId, signal) => {
  return apiService
    .get<ApiResponse<Draft>>(`${API_URL}/draft/${draftId}`, { signal })
    .then((res) => ({
      data: handleGetDraft(res.data.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * deleteDraft
 *
 * @returns deletes a draft by draft id
 */
export const deleteDraft: (draftId: string) => Promise<ServiceResponse<boolean>> = (draftId) => {
  return apiService
    .delete(`${API_URL}/draft/${draftId}`)
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * editDraftName
 *
 * @returns edits the name of a draft
 */
export const editDraftName: (draftRename: DraftRenameDto, draftId) => Promise<ServiceResponse<boolean>> = (
  draftRename,
  draftId
) => {
  return apiService
    .put(`${API_URL}/draft/${draftId}/rename`, handleSendDraftName(draftRename))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * editDraftCutOffDate
 *
 * @returns edits the planned production date of a draft
 */
export const editDraftCutOffDate: (
  draftCutOffDate: DraftChangeCutOffDateDto,
  draftId
) => Promise<ServiceResponse<boolean>> = (draftCutOffDate, draftId) => {
  return apiService
    .put(`${API_URL}/draft/${draftId}/cutoffdate`, handleSendDraftCutOffDate(draftCutOffDate))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * draftTrigger
 *
 * @returns true or error
 */
export const draftTrigger: (
  draftId: Draft['draftId'],
  command: RunBookActionTriggerDtoCommandEnum
) => Promise<ServiceResponse<boolean>> = (draftId, command) => {
  return apiService
    .post(`${API_URL}/draft/trigger`, handleSendTrigger({ draftId, command }))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * getRunbook
 *
 * @returns Runbook object with runner
 */
export const getRunbook: (draftId: Draft['draftId']) => Promise<ServiceResponse<DraftRunbook>> = (
  draftId: Draft['draftId']
) => {
  return apiService
    .get<ApiResponse<DraftRunbook>>(`${API_URL}/draft/${draftId}/runbook`)
    .then((res) => ({
      data: handleGetRunbook(res.data.data),
    }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * runVerify
 * On success it also adds a VerifyResult on Draft
 *
 * @returns VerifyResult
 */
export const runVerify: (draftId: Draft['draftId']) => Promise<ServiceResponse<VerifyResult>> = (
  draftId: Draft['draftId']
) => {
  return apiService
    .get<ApiResponse<VerifyResult>>(`${API_URL}/draft/${draftId}/verify`)
    .then((res) => ({
      data: handleRunVerify(res.data.data),
    }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * getOrgTree
 *
 * @returns draft tree
 */
export const getOrgTree: (draftId: string) => Promise<ServiceResponse<OrgChangeOrganizationTree[]>> = (draftId) => {
  return apiService
    .get<ApiResponse<OrgChangeOrganizationTree[]>>(`${API_URL}/draft/${draftId}/tree`)
    .then((res) => ({
      data: res.data.data,
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * getDraftComments
 *
 * @returns draft comments
 */
export const getDraftComments: (draftId: string) => Promise<ServiceResponse<DraftComment[]>> = (draftId) => {
  return apiService
    .get<ApiResponse<DraftComment[]>>(`${API_URL}/draft/comments/${draftId}`)
    .then((res) => ({
      data: handleGetDraftComments(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * postDraftComment
 *
 * @returns posts a new comment in draft
 */
export const postDraftComment: (draftComment: PostDraftCommentDto) => Promise<ServiceResponse<string>> = (
  draftComment
) => {
  return apiService
    .post<ApiResponse<string>>(`${API_URL}/draft/comment`, handleSendDraftComment(draftComment))
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
 * editDraftComment
 *
 * @returns edits a comment
 */
export const editDraftComment: (draftCommentId: string, comment: string) => Promise<ServiceResponse<boolean>> = (
  draftCommentId,
  comment
) => {
  return apiService
    .put(`${API_URL}/draft/comment/${draftCommentId}`, { comment: comment })
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * deleteDraftComment
 *
 * @returns deletes a draft comment by a comments id
 */
export const deleteDraftComment: (draftCommentId: string) => Promise<ServiceResponse<boolean>> = (draftCommentId) => {
  return apiService
    .delete(`${API_URL}/draft/comment/${draftCommentId}`)
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * getCheckedOutOrganizationsLevel2
 * @returns checked out organisations level 2
 */
export const getCheckedOutOrganizationsLevel2: (
  draftId: string
) => Promise<ServiceResponse<CheckedOutOrganizationLevel2[]>> = (draftId) => {
  return apiService
    .get<ApiResponse<CheckedOutOrganizationLevel2[]>>(`${API_URL}/organization/organizationlevel2/${draftId}`)
    .then((res) => ({
      data: handleGetCheckedOutOrganizationLevel2(res.data),
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

/**
 * getInitialOrgStructureToExport
 * @returns initialOrg structure based on checked out org level 2
 */
export const getInitialOrgStructuresToExport: (
  orgIds: number[]
) => Promise<ServiceResponse<InitialOrgStructureToExport[][]>> = (orgIds) => {
  return apiService
    .get<ApiResponse<InitialOrgStructureToExport[][]>>(`${API_URL}/organization`, {
      params: { orgIds: orgIds.join(',') },
    })
    .then((res) => ({
      data: res.data.data,
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
