/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Activity {
  /** @format int32 */
  activityId?: number;
  activityCode?: string | null;
  description?: string | null;
  /** @format int32 */
  companyId?: number;
}

export interface BuilderOrganizationTree {
  /** @format int32 */
  orgId?: number;
  /** @format int32 */
  companyId?: number;
  /** @format int32 */
  treeLevel?: number;
  isLeafLevel?: boolean;
  /**
   * @format date
   * @example "2023-01-01"
   */
  nodeFromDate?: string;
  /**
   * @format date
   * @example "2023-01-01"
   */
  nodeToDate?: string;
  isWriteProtected?: boolean;
  /** @format uuid */
  nodeChangeId?: string | null;
  nodeChangeStatus?: RowChangeStatus;
  /** @format int32 */
  parentId?: number;
  /**
   * @format date
   * @example "2023-01-01"
   */
  structureFromDate?: string;
  /**
   * @format date
   * @example "2023-01-01"
   */
  structureToDate?: string;
  /** @format uuid */
  structureChangeId?: string | null;
  structureChangeStatus?: RowChangeStatus;
  name?: string | null;
  shortName?: string | null;
  abbreviation?: string | null;
  displayName?: string | null;
  /**
   * @format date
   * @example "2023-01-01"
   */
  nameFromDate?: string;
  /**
   * @format date
   * @example "2023-01-01"
   */
  nameToDate?: string;
  /** @format uuid */
  nameChangeId?: string | null;
  nameChangeStatus?: RowChangeStatus;
  responsibilityCodePart?: string | null;
  responsibilityCodePartList?: string | null;
  /**
   * @format date
   * @example "2023-01-01"
   */
  respCodePartFromDate?: string | null;
  /**
   * @format date
   * @example "2023-01-01"
   */
  respCodePartToDate?: string | null;
  /** @format uuid */
  respCodePartChangeId?: string | null;
  respCodePartChangeStatus?: RowChangeStatus;
  /** @format int32 */
  changes?: number;
  branches?: BuilderOrganizationTree[] | null;
}

export interface Draft {
  /** @format uuid */
  draftId?: string;
  name?: string | null;
  description?: string | null;
  /** @format int32 */
  companyId?: number;
  companyName?: string | null;
  loginname?: string | null;
  /**
   * @format date
   * @example "2023-01-01"
   */
  cutOffDate?: string;
  phase?: DraftPhase;
  /** @format date-time */
  phaseChangeDT?: string;
  nodes?: string[] | null;
  verifyResult?: VerifyResult;
  runbook?: Runbook;
  /** @format int32 */
  changes?: number | null;
  isArchived?: boolean;
  hasCloseRows?: boolean;
  /** @format date-time */
  createdDT?: string;
}

export interface DraftComment {
  /** @format uuid */
  draftCommentId?: string;
  /** @format uuid */
  draftId?: string;
  comment?: string | null;
  loginname?: string | null;
  /** @format date-time */
  createdDT?: string;
}

export enum DraftPhase {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  EXPORT = 'EXPORT',
  DONE = 'DONE',
}

export enum DraftTriggerCommand {
  APPROVE_DRAFT = 'APPROVE_DRAFT',
  APPROVEHRStep1 = 'APPROVE_HR_Step1',
  STARTHRStep3 = 'START_HR_Step3',
}

export interface Email {
  smtpAddress?: string | null;
  /** @minLength 1 */
  emailSystem: string;
}

export interface Employment {
  title?: string | null;
  /** @format date-time */
  hireDate?: string | null;
  /** @format date-time */
  retireDate?: string | null;
  /** @format int32 */
  companyId?: number;
  company?: string | null;
  department?: string | null;
  newDepartment?: string | null;
  managerName?: string | null;
  /** @format uuid */
  managerId?: string | null;
  isMainEmployment?: boolean;
  isManual?: boolean;
  employmentId?: string | null;
  paTeam?: string | null;
  paTeamName?: string | null;
  newPATeam?: string | null;
  newPATeamName?: string | null;
  operationCode?: string | null;
  operationName?: string | null;
  newOperationCode?: string | null;
  newOperationName?: string | null;
  activityCode?: string | null;
  activityName?: string | null;
  newActivityCode?: string | null;
  newActivityName?: string | null;
  projectCode?: string | null;
  projectName?: string | null;
  newProjectCode?: string | null;
  newProjectName?: string | null;
  objectCode?: string | null;
  objectName?: string | null;
  newObjectCode?: string | null;
  newObjectName?: string | null;
  /** @format uuid */
  employmentChangeIntentId?: string | null;
  movedToNewOrg?: boolean | null;
  employmentChangeIntentStarted?: boolean;
}

export interface EmploymentChange {
  pno?: string | null;
  /** @format int32 */
  employmentId?: number;
  /** @format int32 */
  benefitGroupId?: number;
  paTeam?: string | null;
  newPaTeam?: string | null;
  /**
   * @format date
   * @example "2023-01-01"
   */
  fromdat?: string;
  /**
   * @format date
   * @example "2023-01-01"
   */
  hireDate?: string;
  /**
   * @format date
   * @example "2023-01-01"
   */
  retireDate?: string | null;
  responsibility?: string | null;
  newResponsibility?: string | null;
  operation?: string | null;
  newOperation?: string | null;
  activity?: string | null;
  newActivity?: string | null;
  project?: string | null;
  newProject?: string | null;
  object?: string | null;
  newObject?: string | null;
  /** @format uuid */
  employmentChangeIntentId?: string;
}

export interface EmploymentChangeIntent {
  /** @format uuid */
  personId?: string;
  /** @format int32 */
  orgId?: number;
  /** @format int32 */
  newOrgId?: number | null;
  newPATeam?: string | null;
  /** @format int32 */
  newOperationId?: number | null;
  /** @format int32 */
  newActivityId?: number | null;
  /** @format int32 */
  newProjectId?: number | null;
  /** @format int32 */
  newObjectId?: number | null;
  loginname?: string | null;
}

export interface EmploymentHRStatus {
  /** @format uuid */
  employmentChangeIntentId?: string;
  /** @format int32 */
  hrStatus?: number;
}

export interface EmploymentWithChangeIntent {
  /** @format int32 */
  orgId?: number;
  /** @format uuid */
  personId?: string;
  personNumber?: string | null;
  givenname?: string | null;
  lastname?: string | null;
  loginname?: string | null;
  title?: string | null;
  /** @format uuid */
  managerId?: string | null;
  managerName?: string | null;
  paTeam?: string | null;
  paTeamName?: string | null;
  newPATeam?: string | null;
  newPATeamName?: string | null;
  operationCode?: string | null;
  operationName?: string | null;
  newOperationCode?: string | null;
  newOperationName?: string | null;
  activityCode?: string | null;
  activityName?: string | null;
  newActivityCode?: string | null;
  newActivityName?: string | null;
  projectCode?: string | null;
  projectName?: string | null;
  newProjectCode?: string | null;
  newProjectName?: string | null;
  objectCode?: string | null;
  objectName?: string | null;
  newObjectCode?: string | null;
  newObjectName?: string | null;
  /** @format int32 */
  newOrgId?: number | null;
  movedToNewOrg?: boolean;
  employmentChangeIntentStarted?: boolean;
  /** @format uuid */
  employmentChangeIntentId?: string | null;
}

export interface Login {
  loginname?: string | null;
  /** @minLength 1 */
  displayname: string;
}

export interface NewDraft {
  name?: string | null;
  description?: string | null;
  /** @format int32 */
  companyId?: number;
  loginname?: string | null;
  /**
   * @format date
   * @example "2023-01-01"
   */
  cutOffDate?: string;
}

export interface NewDraftComment {
  /** @format uuid */
  draftId?: string;
  comment?: string | null;
  loginname?: string | null;
}

export interface NewOrgNode {
  /** @format int32 */
  parentId?: number;
  name?: string | null;
  shortName?: string | null;
  abbreviation?: string | null;
  loginname?: string | null;
}

export interface NewTigger {
  /** @format uuid */
  draftId?: string;
  command?: DraftTriggerCommand;
}

export interface Object {
  /** @format int32 */
  objectId?: number;
  objectCode?: string | null;
  description?: string | null;
  /** @format int32 */
  companyId?: number;
}

export interface Operation {
  /** @format int32 */
  operationId?: number;
  operationCode?: string | null;
  description?: string | null;
  /** @format int32 */
  companyId?: number;
}

export interface OperationConnect {
  /** @format int32 */
  operationId?: number;
  /** @format int32 */
  orgId?: number;
  loginname?: string | null;
}

export interface OperationDisconnect {
  /** @format int32 */
  organizationOperationId?: number;
  loginname?: string | null;
}

export interface OrgNodeCheckOut {
  /** @format int32 */
  orgId?: number;
  /** @format uuid */
  draftId?: string;
  loginname?: string | null;
}

export interface OrgNodeMove {
  /** @format int32 */
  orgId?: number;
  /** @format int32 */
  newParentId?: number;
  loginname?: string | null;
}

export interface OrgNodeNameUpdate {
  /** @format int32 */
  orgId?: number;
  name?: string | null;
  shortName?: string | null;
  abbreviation?: string | null;
  loginname?: string | null;
}

export interface OrgNodeRespCodeUpdate {
  /** @format int32 */
  orgId?: number;
  newRespCodePart?: string | null;
  loginname?: string | null;
}

export interface OrganizationExport {
  nameLvl2?: string | null;
  shortnameLv2?: string | null;
  abbreviationLv2?: string | null;
  responsibilityCodePartLv2?: string | null;
  nameLvl3?: string | null;
  shortnameLv3?: string | null;
  abbreviationLv3?: string | null;
  responsibilityCodePartLv3?: string | null;
  nameLvl4?: string | null;
  shortnameLv4?: string | null;
  abbreviationLv4?: string | null;
  responsibilityCodePartLv4?: string | null;
  nameLvl5?: string | null;
  shortnameLv5?: string | null;
  abbreviationLv5?: string | null;
  responsibilityCodePartLv5?: string | null;
  nameLvl6?: string | null;
  shortnameLv6?: string | null;
  abbreviationLv6?: string | null;
  responsibilityCodePartLv6?: string | null;
  responsibilityCode?: string | null;
  responsibilityDescription?: string | null;
  operations?: string | null;
}

export interface OrganizationLevel2 {
  /** @format int32 */
  orgId?: number;
  name?: string | null;
  /** @format uuid */
  draftId?: string;
}

export interface OrganizationOperation {
  /** @format int32 */
  organizationOperationId?: number;
  /** @format int32 */
  operationId?: number;
  operationCode?: string | null;
  description?: string | null;
  /** @format int32 */
  companyId?: number;
  /** @format int32 */
  orgId?: number;
  /**
   * @format date
   * @example "2023-01-01"
   */
  fromDate?: string;
  /**
   * @format date
   * @example "2023-01-01"
   */
  toDate?: string;
  /** @format uuid */
  changeId?: string | null;
  changeStatus?: RowChangeStatus;
}

export interface PATeamAndManager {
  /** @format uuid */
  managerId?: string;
  paTeam?: string | null;
  paTeamName?: string | null;
  managerName?: string | null;
  employeeImage?: string | null;
}

export interface PATeamSearchResult {
  /** @format uuid */
  managerId?: string;
  paTeam?: string | null;
  paTeamName?: string | null;
  managerName?: string | null;
}

export interface PersonEmployeeDetail {
  /** @format uuid */
  personId?: string;
  personNumber?: string | null;
  givenname?: string | null;
  middlename?: string | null;
  lastname?: string | null;
  friendlyGivenname?: string | null;
  customFriendlyGivenname?: string | null;
  workPhone?: string | null;
  workMobile?: string | null;
  logins?: Login[] | null;
  emails?: Email[] | null;
  employments?: Employment[] | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface Project {
  /** @format int32 */
  projectId?: number;
  projectCode?: string | null;
  description?: string | null;
  /** @format int32 */
  companyId?: number;
}

export enum RBStepAction {
  Verify = 'Verify',
  ExportToHRStep1 = 'ExportTo_HR_Step1',
  ApproveHRStep1 = 'Approve_HR_Step1',
  Merge = 'Merge',
  MergeMeta = 'MergeMeta',
  MergeStratsys = 'MergeStratsys',
  ExportToRDStep1 = 'ExportTo_RD_Step1',
  ExportToRDStep2 = 'ExportTo_RD_Step2',
  ExportToRDStep3 = 'ExportTo_RD_Step3',
  ExportToRDStep4 = 'ExportTo_RD_Step4',
  ExportToHRStep2 = 'ExportTo_HR_Step2',
  Archive = 'Archive',
  StartHRStep3 = 'Start_HR_Step3',
  ExportToHRStep3 = 'ExportTo_HR_Step3',
  Done = 'Done',
}

export enum RBStepState {
  Queued = 'Queued',
  Waiting = 'Waiting',
  Running = 'Running',
  Completed = 'Completed',
  Fail = 'Fail',
}

export interface Responsibility {
  /** @format int32 */
  responsibilityId?: number;
  responsibilityCode?: string | null;
  responsibilityTypeId?: ResponsibilityType;
  responsibilityType?: string | null;
  description?: string | null;
  /** @format int32 */
  orgId?: number;
  /** @format int32 */
  companyId?: number;
  /**
   * @format date
   * @example "2023-01-01"
   */
  responsibilityFromDate?: string;
  /**
   * @format date
   * @example "2023-01-01"
   */
  responsibilityToDate?: string;
  responsibilityPassive?: boolean;
  /** @format uuid */
  responsibilityChangeId?: string | null;
  responsibilityChangeStatus?: RowChangeStatus;
  /**
   * @format date
   * @example "2023-01-01"
   */
  descriptionFromDate?: string;
  /**
   * @format date
   * @example "2023-01-01"
   */
  descriptionToDate?: string;
  /** @format uuid */
  descriptionChangeId?: string | null;
  descriptionChangeStatus?: RowChangeStatus;
}

export interface ResponsibilityClose {
  /** @format int32 */
  responsibilityId?: number;
  loginname?: string | null;
}

export interface ResponsibilityCreate {
  /** @format int32 */
  orgId?: number;
  responsibilityCode?: string | null;
  description?: string | null;
  responsibilityType?: ResponsibilityType;
  loginname?: string | null;
}

export interface ResponsibilityRename {
  /** @format int32 */
  responsibilityId?: number;
  description?: string | null;
  loginname?: string | null;
}

export enum ResponsibilityType {
  ANSVAR = 'ANSVAR',
  LONEANSVAR = 'LÖNEANSVAR',
  PSEUDOANSVAR = 'PSEUDOANSVAR',
}

export enum RowChangeStatus {
  ORIGINAL_ROW = 'ORIGINAL_ROW',
  NEW = 'NEW',
  MOVED = 'MOVED',
  RENAMED = 'RENAMED',
  RESPCODE_CHANGED = 'RESPCODE_CHANGED',
  DELETED = 'DELETED',
}

export interface Runbook {
  /** @format int32 */
  runbookId?: number;
  /** @format int32 */
  currentStep?: number;
  runner?: RunbookSteps[] | null;
}

export interface RunbookSteps {
  /** @format int32 */
  stepNo?: number;
  action?: RBStepAction;
  state?: RBStepState;
  result?: string | null;
  isWaitAction?: boolean;
  triggerBtnText?: string | null;
  description?: string | null;
  waitingForTrigger?: DraftTriggerCommand;
  emailRecipient?: string | null;
  /** @format int32 */
  reminderIntervalHours?: number | null;
  /** @format date-time */
  firstReminderDT?: string | null;
  /** @format date-time */
  latestReminderDT?: string | null;
}

export interface VRLongNames {
  /** @format int32 */
  orgId?: number;
  shortNameWithAbbreviations?: string | null;
  /** @format int32 */
  length?: number;
}

export interface VRMissingparent {
  /** @format int32 */
  orgId?: number;
  /** @format int32 */
  parentId?: number;
  /** @format int32 */
  treeLevel?: number;
}

export interface VRNochildren {
  /** @format int32 */
  orgId?: number;
  /** @format int32 */
  treeLevel?: number;
}

export interface VerifyResult {
  /** @format int32 */
  numberOfValidationErrors?: number;
  missingParent?: VRMissingparent[] | null;
  noChildren?: VRNochildren[] | null;
  longNames?: VRLongNames[] | null;
}
