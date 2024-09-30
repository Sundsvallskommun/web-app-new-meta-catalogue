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

export interface Organization {
  id: number;
  orgName?: string | null;
  label?: string | null;
  orgNameShort?: string | null;
  abbreviation?: string | null;
  concatAbbreviation?: string | null;
  parentId?: number | null;
  isLeafLevel?: boolean;
  level?: number | null;
  responsibilityCode?: string | null;
  responsibilityCodePartList?: string | null;
  companyId?: number | null;
}

export interface OrganizationApiResponse {
  data: Organization;
  message: string;
}

export interface OrganizationsApiResponse {
  data: Organization[];
  message: string;
}

export interface OrganizationTree {
  organizationId?: string;
  id: number;
  level: number;
  orgName?: string | null;
  orgNameShort?: string | null;
  abbreviation?: string | null;
  label: string | null;
  parentId?: number;
  isLeafLevel?: boolean;
  responsibilityCode?: string | null;
  responsibilityList?: string | null;
  subItems?: OrganizationTree[] | null;
}

export interface OrganizationTreeApiResponse {
  data: OrganizationTree[];
  message: string;
}

export interface OrganizationResponsibility {
  orgResponsibilityId?: string;
  responsibilityCode?: string | null;
  orgId?: number | null;
  responsibilityText?: string | null;
  responsibilityValidFrom?: string;
  companyId?: number;
  typeOfResponsibility?: OrganizationResponsibilityTypeOfResponsibilityEnum;
  orgName?: string | null;
  orgFromName?: string | null;
}

export interface ResponsibilityApiResponse {
  data: OrganizationResponsibility;
  message: string;
}

export interface ResponsibilitiesApiResponse {
  data: OrganizationResponsibility[];
  message: string;
}

export interface PatchUserSettingsDto {
  readCommentsClearedDate: string;
}

export interface Permissions {
  canEditSystemMessages: boolean;
  canViewEmployees: boolean;
  canViewEmployeeDetails: boolean;
  canEditEmployeeDetails: boolean;
  canViewResponsibility: boolean;
  canEditResponsibility: boolean;
  canViewOperation: boolean;
  canEditOperation: boolean;
  canEditOrganization: boolean;
  canViewDrafts: boolean;
  canEditDrafts: boolean;
  canEditOrganizationStructure: boolean;
  canCommentDraft: boolean;
}

export interface User {
  name: string;
  username: string;
  role: UserRoleEnum;
  permissions: Permissions;
  readCommentsClearedDate: string | null;
}

export interface UserApiResponse {
  data: User;
  message: string;
}

export interface AlertBannerDto {
  message: string;
  severity: string;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface AlertBannerMessage {
  id?: number;
  message: string;
  severity: string;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface AlertBannerMessageApiResponse {
  data: AlertBannerMessage;
  message: string;
}

export interface AlertBannerMessageDeleteApiResponse {
  message: string;
}

export interface FeedbackDto {
  body: string;
  type: string;
  typeLabel: string;
}

export interface MDVEmployee {
  personId?: string;
  personNumber?: string | null;
  classified?: string | null;
  givenname?: string | null;
  lastname?: string | null;
  friendlyGivenname?: string | null;
  orgId?: number | null;
  workPhone?: string | null;
  workMobile?: string | null;
  loginname?: string | null;
  title?: string | null;
  isManual?: boolean;
  logins?: Login[] | null;
  emails: Email[] | null;
  employments: MDVEmployment[] | null;
}

export interface EmployeeApiResponse {
  data: MDVEmployee;
  message: string;
}

export interface EmployeesApiResponse {
  data: MDVEmployee[];
  message: string;
}

export interface Email {
  smtpAddress?: string | null;
  emailSystem: string;
}

export interface Login {
  loginname?: string | null;
  displayname: string;
}

export interface MDVEmployment {
  title?: string | null;
  hireDate?: string | null;
  retireDate?: string | null;
  paTeam?: string | null;
  department?: string | null;
  managerName?: string | null;
}

export interface EmployeeDetailsApiResponse {
  data: MDVEmployee;
  message: string;
}

export interface OrgOperation {
  orgOperationId?: string;
  orgId?: number;
  operationCode?: string | null;
  operationDescription?: string | null;
}

export interface OrgOperationsApiResponse {
  data: OrgOperation[];
  message: string;
}

export interface SearchResult {
  objectType?: string | null;
  subObjectType?: string | null;
  id?: string;
  subId?: number;
  header?: string | null;
  text?: string | null;
}

export interface SearchResultsApiResponse {
  data: SearchResult[];
  message: string;
}

export interface OrgChangeActivity {
  activityId?: number;
  activityCode?: string | null;
  description?: string | null;
  companyId?: number;
}

export interface CompanyActivitysApiResponse {
  data: OrgChangeActivity[];
  message: string;
}

export interface NewDraftDto {
  name: string;
  description: string;
  companyId: number;
  cutOffDate: string;
}

export interface DraftRenameDto {
  name: string;
}

export interface DraftChangeCutOffDateDto {
  cutOffDate: string;
}

export interface DraftChangePhaseDto {
  phase: string;
}

export interface PostDraftCommentDto {
  draftId: string;
  comment?: string | null;
}

export interface RunBookActionTriggerDto {
  draftId: string;
  command: RunBookActionTriggerDtoCommandEnum;
}

export interface VerifyMissingParent {
  orgId: number;
  parentId: number;
  treeLevel: number;
}

export interface VerifyNoChildren {
  orgId: number;
  treeLevel: number;
}

export interface VerifyResult {
  numberOfValidationErrors: number;
  missingParent: VerifyMissingParent[];
  noChildren: VerifyNoChildren[];
}

export interface RunbookSteps {
  stepNo: number;
  action: RunbookStepsActionEnum;
  state: RunbookStepsStateEnum;
  result?: string | null;
  isWaitAction: boolean;
  triggerBtnText?: string | null;
  description?: string | null;
  waitingForTrigger: RunbookStepsWaitingForTriggerEnum;
  emailRecipient?: string | null;
  reminderIntervalHours?: number | null;
  firstReminderDT?: string | null;
  latestReminderDT?: string | null;
}

export interface DraftRunbook {
  runbookId: number;
  currentStep: number;
  runner: RunbookSteps[];
}

export interface Draft {
  draftId?: string;
  name?: string | null;
  description?: string | null;
  companyId?: number;
  companyName?: string | null;
  loginname?: string | null;
  cutOffDate?: string | null;
  phase: DraftPhaseEnum;
  phaseChangeDT?: string | null;
  nodes?: string[] | null;
  verifyResult?: VerifyResult | null;
  runbook?: DraftRunbook | null;
  changes?: number | null;
  isArchived?: boolean;
  createdDT?: string;
}

export interface OrgChangeDraftApiResponse {
  data: Draft;
  message: string;
}

export interface OrgChangeDraftsApiResponse {
  data: Draft[];
  message: string;
}

export interface OrgChangeOrganizationTree {
  id: number;
  companyId?: number;
  level: number;
  isLeafLevel?: boolean;
  nodeFromDate?: string;
  nodeToDate?: string;
  isWriteProtected?: boolean;
  nodeChangeId: string | null;
  nodeChangeStatus?: OrgChangeOrganizationTreeNodeChangeStatusEnum;
  parentId?: number;
  structureFromDate?: string;
  structureToDate?: string;
  structureChangeId?: string | null;
  structureChangeStatus?: OrgChangeOrganizationTreeStructureChangeStatusEnum;
  orgName?: string | null;
  label: string | null;
  orgNameShort?: string | null;
  abbreviation?: string | null;
  displayName?: string | null;
  nameFromDate?: string;
  nameToDate?: string;
  nameChangeId?: string | null;
  nameChangeStatus?: OrgChangeOrganizationTreeNameChangeStatusEnum;
  responsibilityCode?: string | null;
  responsibilityList?: string | null;
  respCodePartFromDate?: string | null;
  respCodePartToDate?: string | null;
  respCodePartChangeId?: string | null;
  respCodePartChangeStatus?: OrgChangeOrganizationTreeRespCodePartChangeStatusEnum;
  subItems?: OrgChangeOrganizationTree[] | null;
  changes?: number;
}

export interface OrgChangeDraftTreeApiResponse {
  data: OrgChangeOrganizationTree;
  message: string;
}

export interface DraftComment {
  draftCommentId?: string;
  draftId?: string;
  comment?: string | null;
  loginname?: string | null;
  createdDT?: string | null;
}

export interface DraftCommentsApiResponse {
  data: DraftComment[];
  message: string;
}

export interface DraftRunbookApiResponse {
  data: DraftRunbook[];
  message: string;
}

export interface DraftVerifyApiResponse {
  data: VerifyResult[];
  message: string;
}

export interface OrgChangeOrganizationEmployee {
  orgId?: number;
  personId?: string;
  personNumber?: string | null;
  givenname?: string | null;
  lastname?: string | null;
  loginname?: string | null;
  title?: string | null;
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
  newOrgId?: number | null;
  movedToNewOrg?: boolean;
  employmentChangeIntentStarted?: boolean;
  employmentChangeIntentId?: string | null;
}

export interface OrgChangeOrganizationEmployeesApiResponse {
  data: OrgChangeOrganizationEmployee[];
  message: string;
}

export interface OrgChangeLogin {
  loginname?: string | null;
  displayname: string;
}

export interface OrgChangeEmail {
  smtpAddress?: string | null;
  emailSystem: string;
}

export interface OrgChangeEmployment {
  title?: string | null;
  hireDate?: string | null;
  retireDate?: string | null;
  companyId?: number;
  company?: string | null;
  department?: string | null;
  newDepartment?: string | null;
  managerName?: string | null;
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
  employmentChangeIntentId?: string | null;
  movedToNewOrg?: boolean | null;
  employmentChangeIntentStarted?: boolean;
}

export interface OrgChangePersonEmployeeDetail {
  personId?: string;
  personNumber?: string | null;
  givenname?: string | null;
  middlename?: string | null;
  lastname?: string | null;
  friendlyGivenname?: string | null;
  customFriendlyGivenname?: string | null;
  workPhone?: string | null;
  workMobile?: string | null;
  logins?: OrgChangeLogin[] | null;
  emails?: OrgChangeEmail[] | null;
  employments?: OrgChangeEmployment[] | null;
}

export interface OrgChangePersonEmployeeDetailApiResponse {
  data: OrgChangePersonEmployeeDetail;
  message: string;
}

export interface EmploymentChange {
  personId: string;
  orgId: number;
  newOrgId?: number | null;
  newPATeam?: string | null;
  newOperationId?: number | null;
  newActivityId?: number | null;
  newProjectId?: number | null;
  newObjectId?: number | null;
}

export interface EmploymentChangeArrayDto {
  people: EmploymentChange[];
}

export interface EmploymentChangeResetArrayDto {
  people: string[];
}

export interface OrgChangeObject {
  objectId?: number;
  objectCode?: string | null;
  description?: string | null;
  companyId?: number;
}

export interface CompanyObjectsApiResponse {
  data: OrgChangeObject[];
  message: string;
}

export interface ConnectOperationDto {
  operationId: number;
  orgId: number;
}

export interface DisconnectOperationDto {
  organizationOperationId: number;
}

export interface OrgChangeOrganizationOperation {
  organizationOperationId?: number;
  operationId?: number;
  operationCode?: string | null;
  description?: string | null;
  companyId?: number;
  orgId?: number;
  fromDate?: string;
  toDate?: string;
  changeId?: string | null;
  changeStatus: OrgChangeOrganizationOperationChangeStatusEnum;
}

export interface OrgChangeOrganizationOperationsApiResponse {
  data: OrgChangeOrganizationOperation[];
  message: string;
}

export interface OrgChangeOperation {
  operationId?: number;
  operationCode?: string | null;
  description?: string | null;
  companyId?: number;
}

export interface CompanyOperationsApiResponse {
  data: OrgChangeOperation[];
  message: string;
}

export interface InitialOrgStructureToExport {
  nameLvl2?: string | null;
  shortnameLv2?: string | null;
  abbreviationLv2?: string | null;
  responsibilityCodePartLv2?: string | null;
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

export interface InitialOrgStructuresToExporApiResponse {
  data: InitialOrgStructureToExport;
  message: string;
}

export interface CheckedOutOrganizationLevel2 {
  orgId?: number;
  name?: string | null;
  draftId?: string | null;
}

export interface CheckedOutOrganizationLevel2ApiResponse {
  data: CheckedOutOrganizationLevel2;
  message: string;
}

export interface OrgnodeAddDto {
  orgId: number;
  draftId: string;
}

export interface OrgnodeCreateDto {
  parentId: number;
  name?: string | null;
  shortName?: string | null;
  abbreviation?: string | null;
}

export interface OrgnodeRenameDto {
  orgId: number;
  name?: string | null;
  shortName?: string | null;
  abbreviation?: string | null;
}

export interface OrgnodeChangeRespCodeDto {
  orgId: number;
  newRespCodePart?: string | null;
}

export interface OrgnodeMoveDto {
  orgId: number;
  newParentId: number;
}

export interface TerminateNodeDto {
  orgId: number;
}

export interface PATeamSearchResult {
  managerId?: string;
  paTeam?: string | null;
  paTeamName?: string | null;
  managerName?: string | null;
}

export interface PATeamSearchResultsApiResponse {
  data: PATeamSearchResult[];
  message: string;
}

export interface PATeamAndManager {
  managerId?: string;
  paTeam?: string | null;
  paTeamName?: string | null;
  managerName?: string | null;
  employeeImage?: string | null;
}

export interface PATeamAndManagersApiResponse {
  data: PATeamAndManager[];
  message: string;
}

export interface OrgChangeProject {
  projectId?: number;
  projectCode?: string | null;
  description?: string | null;
  companyId?: number;
}

export interface CompanyProjectsApiResponse {
  data: OrgChangeProject[];
  message: string;
}

export interface OrgChangeResponsibility {
  responsibilityId?: number;
  responsibilityCode?: string | null;
  responsibilityTypeId?: OrgChangeResponsibilityResponsibilityTypeIdEnum;
  responsibilityType?: string | null;
  description?: string | null;
  orgId?: number;
  companyId?: number;
  responsibilityFromDate?: string;
  responsibilityToDate?: string;
  responsibilityPassive?: boolean;
  responsibilityChangeId?: string | null;
  responsibilityChangeStatus?: OrgChangeResponsibilityResponsibilityChangeStatusEnum;
  descriptionFromDate?: string;
  descriptionToDate?: string;
  descriptionChangeId?: string | null;
  descriptionChangeStatus?: OrgChangeResponsibilityDescriptionChangeStatusEnum;
}

export interface OrgChangeResponsibilitiesApiResponse {
  data: OrgChangeResponsibility;
  message: string;
}

export interface OrgChangeResponsibilityNewCodeApiResponse {
  data: string;
  message: string;
}

export interface ResponsibilityCreateDto {
  orgId: number;
  responsibilityCode: string;
  description: string;
  responsibilityType: string;
}

export interface RenameResponsibilityDto {
  responsibilityId: number;
  description?: string | null;
}

export interface CloseResponsibilityDto {
  responsibilityId: number;
}

export enum OrganizationResponsibilityTypeOfResponsibilityEnum {
  ANSVAR = 'ANSVAR',
  LONEANSVAR = 'LÖNEANSVAR',
  PSEUDOANSVAR = 'PSEUDOANSVAR',
}

export enum UserRoleEnum {
  MetaRead = 'meta_read',
  MetaVerifier = 'meta_verifier',
  MetaOperator = 'meta_operator',
  MetaAdmin = 'meta_admin',
  Value0 = '0',
  Value1 = '1',
  Value2 = '2',
  Value3 = '3',
}

export enum RunBookActionTriggerDtoCommandEnum {
  APPROVE_DRAFT = 'APPROVE_DRAFT',
  APPROVEHRStep1 = 'APPROVE_HR_Step1',
  STARTHRStep3 = 'START_HR_Step3',
}

export enum RunbookStepsActionEnum {
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

export enum RunbookStepsStateEnum {
  Queued = 'Queued',
  Waiting = 'Waiting',
  Running = 'Running',
  Completed = 'Completed',
  Fail = 'Fail',
}

export enum RunbookStepsWaitingForTriggerEnum {
  APPROVE_DRAFT = 'APPROVE_DRAFT',
  APPROVEHRStep1 = 'APPROVE_HR_Step1',
  STARTHRStep3 = 'START_HR_Step3',
}

export enum DraftPhaseEnum {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  EXPORT = 'EXPORT',
  DONE = 'DONE',
}

export enum OrgChangeOrganizationTreeNodeChangeStatusEnum {
  ORIGINAL_ROW = 'ORIGINAL_ROW',
  NEW = 'NEW',
  MOVED = 'MOVED',
  RENAMED = 'RENAMED',
  RESPCODE_CHANGED = 'RESPCODE_CHANGED',
  DELETED = 'DELETED',
}

export enum OrgChangeOrganizationTreeStructureChangeStatusEnum {
  ORIGINAL_ROW = 'ORIGINAL_ROW',
  NEW = 'NEW',
  MOVED = 'MOVED',
  RENAMED = 'RENAMED',
  RESPCODE_CHANGED = 'RESPCODE_CHANGED',
  DELETED = 'DELETED',
}

export enum OrgChangeOrganizationTreeNameChangeStatusEnum {
  ORIGINAL_ROW = 'ORIGINAL_ROW',
  NEW = 'NEW',
  MOVED = 'MOVED',
  RENAMED = 'RENAMED',
  RESPCODE_CHANGED = 'RESPCODE_CHANGED',
  DELETED = 'DELETED',
}

export enum OrgChangeOrganizationTreeRespCodePartChangeStatusEnum {
  ORIGINAL_ROW = 'ORIGINAL_ROW',
  NEW = 'NEW',
  MOVED = 'MOVED',
  RENAMED = 'RENAMED',
  RESPCODE_CHANGED = 'RESPCODE_CHANGED',
  DELETED = 'DELETED',
}

export enum OrgChangeOrganizationOperationChangeStatusEnum {
  ORIGINAL_ROW = 'ORIGINAL_ROW',
  NEW = 'NEW',
  MOVED = 'MOVED',
  RENAMED = 'RENAMED',
  RESPCODE_CHANGED = 'RESPCODE_CHANGED',
  DELETED = 'DELETED',
}

export enum OrgChangeResponsibilityResponsibilityTypeIdEnum {
  ANSVAR = 'ANSVAR',
  LONEANSVAR = 'LÖNEANSVAR',
  PSEUDOANSVAR = 'PSEUDOANSVAR',
}

export enum OrgChangeResponsibilityResponsibilityChangeStatusEnum {
  ORIGINAL_ROW = 'ORIGINAL_ROW',
  NEW = 'NEW',
  MOVED = 'MOVED',
  RENAMED = 'RENAMED',
  RESPCODE_CHANGED = 'RESPCODE_CHANGED',
  DELETED = 'DELETED',
}

export enum OrgChangeResponsibilityDescriptionChangeStatusEnum {
  ORIGINAL_ROW = 'ORIGINAL_ROW',
  NEW = 'NEW',
  MOVED = 'MOVED',
  RENAMED = 'RENAMED',
  RESPCODE_CHANGED = 'RESPCODE_CHANGED',
  DELETED = 'DELETED',
}
