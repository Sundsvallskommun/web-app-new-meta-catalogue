import {
  CheckedOutOrganizationLevel2,
  Draft,
  DraftChangeCutOffDateDto,
  DraftComment,
  DraftRenameDto,
  DraftRunbook,
  NewDraftDto,
  OrgChangeOrganizationTree,
  PostDraftCommentDto,
  RunBookActionTriggerDto,
  VerifyResult,
} from '@data-contracts/backend/data-contracts';
import { VerifyResultByOrgId } from '@interfaces/orgchange';
import { ApiResponse } from '@services/api-service';

export const handleSendDraft: (draft: NewDraftDto) => NewDraftDto = (draft) => ({
  name: draft.name,
  description: draft.description,
  companyId: draft.companyId,
  cutOffDate: draft.cutOffDate,
});

export const handleSendDraftName: (draft: DraftRenameDto) => DraftRenameDto = (draft) => ({
  name: draft.name,
});

export const handleSendDraftCutOffDate: (draft: DraftChangeCutOffDateDto) => DraftChangeCutOffDateDto = (draft) => ({
  cutOffDate: draft.cutOffDate,
});

export const handleSendTrigger: (trigger: RunBookActionTriggerDto) => RunBookActionTriggerDto = (trigger) => ({
  draftId: trigger.draftId,
  command: trigger.command,
});

export const handleGetDraft: (data: Draft) => Draft = (data) => ({
  draftId: data.draftId,
  name: data.name,
  description: data.description,
  companyId: data.companyId,
  companyName: data.companyName,
  loginname: data.loginname,
  cutOffDate: data.cutOffDate,
  phase: data.phase,
  phaseChangeDT: data.phaseChangeDT,
  nodes: data.nodes,
  verifyResult: data.verifyResult,
  runbook: data.runbook,
  changes: data.changes,
  createdDT: data.createdDT,
  isArchived: data.isArchived,
});

export const handleGetDrafts: (res: ApiResponse<Draft[]>) => Draft[] = (res) => {
  return res.data.map(handleGetDraft);
};

export const handleGetRunbook: (data: DraftRunbook) => DraftRunbook = (data) => ({
  runbookId: data.runbookId,
  currentStep: data.currentStep,
  runner: data.runner,
});

export const handleRunVerify: (data: VerifyResult) => VerifyResult = (data) => ({
  numberOfValidationErrors: data.numberOfValidationErrors,
  missingParent: data.missingParent,
  noChildren: data.noChildren,
});

export const handleGetDraftComments: (res: ApiResponse<DraftComment[]>) => DraftComment[] = (res) => {
  return res.data.map((data) => ({
    draftCommentId: data.draftCommentId,
    draftId: data.draftId,
    comment: data.comment,
    loginname: data.loginname,
    createdDT: data.createdDT,
  }));
};

export const handleSendDraftComment: (draftComment: PostDraftCommentDto) => PostDraftCommentDto = (comment) => ({
  draftId: comment.draftId,
  comment: comment.comment,
});

export const handleGetCheckedOutOrganizationLevel2: (
  res: ApiResponse<CheckedOutOrganizationLevel2[]>
) => CheckedOutOrganizationLevel2[] = (res) => {
  return res.data.map((org) => ({
    orgId: org.orgId,
    name: org.name,
    draftId: org.draftId,
  }));
};

export const handleGetDraftTree: (res: ApiResponse<OrgChangeOrganizationTree[]>) => OrgChangeOrganizationTree[] = (
  res
) => {
  return res.data.map((data) => ({
    id: data.id,
    level: data.level,
    label: data.label,
    orgName: data.orgName,
    companyId: data.companyId,
    isLeafLevel: data.isLeafLevel,
    nodeFromDate: data.nodeFromDate,
    nodeToDate: data.nodeToDate,
    isWriteProtected: data.isWriteProtected,
    nodeChangeId: data.nodeChangeId,
    nodeChangeStatus: data.nodeChangeStatus,
    parentId: data.parentId,
    structureFromDate: data.structureFromDate,
    structureToDate: data.structureToDate,
    structureChangeId: data.structureChangeId,
    structureChangeStatus: data.structureChangeStatus,
    orgNameShort: data.orgNameShort,
    abbreviation: data.abbreviation,
    displayName: data.displayName,
    nameFromDate: data.nameFromDate,
    nameToDate: data.nameToDate,
    nameChangeId: data.nameChangeId,
    nameChangeStatus: data.nameChangeStatus,
    responsibilityCode: data.responsibilityCode,
    responsibilityCodeList: data.responsibilityList,
    responsibilityList: data.responsibilityList,
    respCodePartFromDate: data.respCodePartFromDate,
    respCodePartToDate: data.respCodePartToDate,
    respCodePartChangeId: data.respCodePartChangeId,
    respCodePartChangeStatus: data.respCodePartChangeStatus,
    changes: data.changes,
    subItems: data.subItems,
  }));
};

interface ErrorData {
  orgId: number;
  [key: string]: unknown;
}

export function verifyErrorsByOrgId(verifyResult: VerifyResult): VerifyResultByOrgId {
  const restructuredObj: VerifyResultByOrgId = {};

  Object.keys(verifyResult).forEach((errorType) => {
    if (errorType !== 'numberOfValidationErrors' && verifyResult[errorType] !== null) {
      const errorData = verifyResult[errorType];
      if (Array.isArray(errorData)) {
        errorData.forEach((data: ErrorData) => {
          if (data.orgId) {
            if (!(data.orgId in restructuredObj)) {
              restructuredObj[data.orgId] = {
                numberOfValidationErrors: 0,
              };
            }
            restructuredObj[data.orgId][errorType] = {
              ...data,
            };
            restructuredObj[data.orgId].numberOfValidationErrors++;
          }
        });
      }
    }
  });

  return restructuredObj;
}
