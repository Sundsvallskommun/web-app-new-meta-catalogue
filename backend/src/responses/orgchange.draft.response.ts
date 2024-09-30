import {
  DraftComment as _DraftComment,
  Runbook as _Runbook,
  RunbookSteps as _RunbookSteps,
  VerifyResult as _VerifyResult,
  DraftPhase,
  RowChangeStatus,
  Draft as _Draft,
  RBStepAction,
  RBStepState,
  DraftTriggerCommand,
  VRMissingparent,
  VRNochildren,
} from '@/data-contracts/mdbuilder/data-contracts';
import ApiResponse from '@/interfaces/api-service.interface';
import { DraftTree } from '@/interfaces/orgchange.interface';
import { IsNullable } from '@/utils/custom-validation-classes';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

// verify
export class VerifyMissingParent implements VRMissingparent {
  @IsNumber()
  orgId: number;
  @IsNumber()
  parentId: number;
  @IsNumber()
  treeLevel: number;
}

export class VerifyNoChildren implements VRNochildren {
  @IsNumber()
  orgId: number;
  @IsNumber()
  treeLevel: number;
}

export class VerifyResult implements _VerifyResult {
  @IsNumber()
  numberOfValidationErrors: number;
  @ValidateNested({ each: true })
  @Type(() => VerifyMissingParent)
  missingParent: VerifyMissingParent[];
  @ValidateNested({ each: true })
  @Type(() => VerifyNoChildren)
  noChildren: VerifyNoChildren[];
}

// Runbook
export class RunbookSteps implements _RunbookSteps {
  @IsNumber()
  stepNo: number;
  @IsEnum(RBStepAction)
  action: RBStepAction;
  @IsEnum(RBStepState)
  state: RBStepState;
  @IsString()
  @IsOptional()
  @IsNullable()
  result?: string;
  @IsBoolean()
  isWaitAction?: boolean;
  @IsString()
  @IsOptional()
  @IsNullable()
  triggerBtnText?: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string;
  @IsEnum(DraftTriggerCommand)
  waitingForTrigger?: DraftTriggerCommand;
  @IsString()
  @IsOptional()
  @IsNullable()
  emailRecipient?: string;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  reminderIntervalHours?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  firstReminderDT?: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  latestReminderDT?: string;
}

export class DraftRunbook implements _Runbook {
  @IsNumber()
  runbookId: number;
  @IsNumber()
  currentStep: number;
  @ValidateNested({ each: true })
  @Type(() => RunbookSteps)
  runner: RunbookSteps[];
}

export class Draft implements _Draft {
  @IsString()
  @IsOptional()
  /** @format uuid */
  draftId?: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  name?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  description?: string | null;
  @IsNumber()
  @IsOptional()
  /** @format int32 */
  companyId?: number;
  @IsString()
  @IsOptional()
  @IsNullable()
  companyName?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  loginname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  /**
   * @format date
   * @example "2023-01-01"
   */
  cutOffDate?: string | null;
  @IsEnum(DraftPhase)
  phase?: DraftPhase;
  @IsString()
  @IsOptional()
  @IsNullable()
  /** @format date-time */
  phaseChangeDT?: string;
  @IsString({ each: true })
  @IsOptional()
  @IsNullable()
  nodes?: string[] | null;
  @ValidateNested()
  @Type(() => VerifyResult)
  @IsNullable()
  @IsOptional()
  verifyResult?: VerifyResult | null;
  @ValidateNested()
  @Type(() => DraftRunbook)
  @IsNullable()
  @IsOptional()
  runbook?: DraftRunbook;
  @IsNumber()
  @IsOptional()
  @IsNullable()
  /** @format int32 */
  changes?: number | null;
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
  @IsString()
  @IsOptional()
  /** @format date-time */
  createdDT?: string;
}

export class OrgChangeDraftApiResponse implements ApiResponse<Draft> {
  @ValidateNested()
  @Type(() => Draft)
  data: Draft;
  @IsString()
  message: string;
}

export class OrgChangeDraftsApiResponse implements ApiResponse<Draft[]> {
  @ValidateNested({ each: true })
  @Type(() => Draft)
  data: Draft[];
  @IsString()
  message: string;
}

export class OrgChangeOrganizationTree implements DraftTree {
  @IsNumber()
  /** @format int32 */
  id: number;
  /** @format int32 */
  @IsOptional()
  @IsNumber()
  companyId?: number;
  @IsNumber()
  /** @format int32 */
  level: number;
  @IsOptional()
  @IsBoolean()
  isLeafLevel?: boolean;
  @IsString()
  @IsOptional()
  /**
   * @format date
   * @example "2023-01-01"
   */
  nodeFromDate?: string;
  @IsOptional()
  @IsString()
  /**
   * @format date
   * @example "2023-01-01"
   */
  nodeToDate?: string;
  @IsOptional()
  @IsBoolean()
  isWriteProtected?: boolean;
  // @IsOptional()
  @IsString()
  /** @format uuid */
  @IsNullable()
  nodeChangeId: string | null;
  @IsOptional()
  @IsEnum(RowChangeStatus)
  nodeChangeStatus?: RowChangeStatus;
  @IsOptional()
  @IsNumber()
  /** @format int32 */
  parentId?: number;
  @IsOptional()
  @IsString()
  /**
   * @format date
   * @example "2023-01-01"
   */
  structureFromDate?: string;
  @IsOptional()
  @IsString()
  /**
   * @format date
   * @example "2023-01-01"
   */
  structureToDate?: string;
  @IsOptional()
  @IsString()
  @IsNullable()
  /** @format uuid */
  structureChangeId?: string | null;
  @IsOptional()
  @IsEnum(RowChangeStatus)
  structureChangeStatus?: RowChangeStatus;
  @IsOptional()
  @IsString()
  @IsNullable()
  orgName?: string | null;
  @IsString()
  @IsNullable()
  label: string | null;
  @IsOptional()
  @IsString()
  @IsNullable()
  orgNameShort?: string | null;
  @IsOptional()
  @IsString()
  @IsNullable()
  abbreviation?: string | null;
  @IsOptional()
  @IsString()
  @IsNullable()
  displayName?: string | null;
  @IsOptional()
  @IsString()
  /**
   * @format date
   * @example "2023-01-01"
   */
  nameFromDate?: string;
  @IsOptional()
  @IsString()
  /**
   * @format date
   * @example "2023-01-01"
   */
  nameToDate?: string;
  /** @format uuid */
  @IsOptional()
  @IsString()
  @IsNullable()
  nameChangeId?: string | null;
  @IsOptional()
  @IsEnum(RowChangeStatus)
  nameChangeStatus?: RowChangeStatus;
  @IsOptional()
  @IsString()
  @IsNullable()
  responsibilityCode?: string | null;
  @IsOptional()
  @IsString()
  @IsNullable()
  responsibilityList?: string | null;
  @IsOptional()
  @IsString()
  @IsNullable()
  /**
   * @format date
   * @example "2023-01-01"
   */
  respCodePartFromDate?: string | null;
  @IsOptional()
  @IsString()
  @IsNullable()
  /**
   * @format date
   * @example "2023-01-01"
   */
  respCodePartToDate?: string | null;
  @IsOptional()
  @IsString()
  @IsNullable()
  /** @format uuid */
  respCodePartChangeId?: string | null;
  @IsOptional()
  @IsEnum(RowChangeStatus)
  respCodePartChangeStatus?: RowChangeStatus;
  @IsOptional()
  @IsNullable()
  @ValidateNested({ each: true })
  @Type(() => OrgChangeOrganizationTree)
  subItems: OrgChangeOrganizationTree[] | [] | null;
  @IsOptional()
  @IsNumber()
  changes?: number;
}

export class OrgChangeDraftTreeApiResponse implements ApiResponse<OrgChangeOrganizationTree[]> {
  @ValidateNested()
  @Type(() => OrgChangeOrganizationTree)
  data: OrgChangeOrganizationTree[];
  @IsString()
  message: string;
}

export class DraftComment implements _DraftComment {
  @IsString()
  @IsOptional()
  /** @format uuid */
  draftCommentId: string;
  @IsString()
  @IsOptional()
  /** @format uuid */
  draftId: string;
  @IsString()
  @IsOptional()
  @IsNullable()
  comment: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  loginname?: string | null;
  @IsString()
  @IsOptional()
  @IsNullable()
  /**
   * @format date
   * @example "2023-01-01"
   */
  createdDT: string | null;
}

export class DraftCommentsApiResponse implements ApiResponse<DraftComment[]> {
  @ValidateNested({ each: true })
  @Type(() => DraftComment)
  data: DraftComment[];
  @IsString()
  message: string;
}

export class DraftRunbookApiResponse implements ApiResponse<DraftRunbook> {
  @ValidateNested({ each: true })
  @Type(() => DraftRunbook)
  data: DraftRunbook;
  @IsString()
  message: string;
}

export class DraftVerifyApiResponse implements ApiResponse<VerifyResult> {
  @ValidateNested({ each: true })
  @Type(() => VerifyResult)
  data: VerifyResult;
  @IsString()
  message: string;
}
