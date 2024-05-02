import {
  Draft,
  DraftChangeCutOffDateDto,
  DraftRenameDto,
  OrgChangeOrganizationOperation,
  OrgChangeOrganizationTree,
} from '@data-contracts/backend/data-contracts';
import { IFilterData } from '@sk-web-gui/react';

export interface SaveDraft extends Partial<DraftRenameDto & DraftChangeCutOffDateDto & Pick<Draft, 'phase'>> {
  description?: string;
  draftId?: Draft['draftId'];
}

export interface DraftTreeOrganization extends OrgChangeOrganizationTree {
  orgFromName: string;
}

export interface IFilterDataMenu extends IFilterData {
  propertyName: string;
}

export type OrgChangeOrganizationOperationSelectList = Pick<
  OrgChangeOrganizationOperation,
  'operationCode' | 'description' | 'operationId'
>;

export interface IOrgNameEditForm extends EditOrganizationDto {
  parentResponsibilityCode?: string;
}

// ordered, used for sorting
export enum DraftPhaseAction {
  UNSET,
  DRAFT,
  EXPORT_NEED_ACTION,
  EXPORT_ONGOING,
  APPROVED,
  ARCHIVED,
}

export interface DraftListFilters {
  query: string;
  phase: DraftPhaseAction | null;
  timeRange: string | null;
}

export interface EditOrganizationDto {
  orgId: number;
  orgName?: string | null;
  treeLevel?: number | null;
  parentId?: number | null;
  abbreviation?: string | null;
  orgNameShort?: string | null;
  isLeafLevel: boolean;
  responsibilityCode?: string | null;
}

export interface VerifyResultByOrgId {
  [orgId: number]: {
    [key: string]: unknown;
    numberOfValidationErrors: number;
  };
}
