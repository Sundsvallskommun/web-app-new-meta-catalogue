export interface Permissions {
  canEditSystemMessages: boolean;
  canViewEmployeeDetails: boolean;
  canViewDrafts: boolean;
  canEditEmployeeDetails: boolean;
  canEditResponsibility: boolean;
  canEditOperation: boolean;
  canEditOrganization: boolean;
  canEditOrganizationStructure: boolean;
  canCommentDraft: boolean;
}

/** AD roles */
export type ADRole =
  | 'sg_appl_meta_masterdata_admin'
  | 'sg_appl_meta_masterdata_operator'
  | 'sg_appl_meta_masterdata_verifier'
  | 'sg_appl_meta_masterdata_read';
/** Internal roles */
export type InternalRole = 'meta_admin' | 'meta_operator' | 'meta_verifier' | 'meta_read';
export enum InternalRoleEnum {
  'meta_read',
  'meta_verifier',
  'meta_operator',
  'meta_admin',
}

export type InternalRoleMap = Map<InternalRole, Partial<Permissions>>;

export interface User {
  name: string;
  givenname: string;
  surname: string;
  username: string;
  groups: string[];
  role: string;
  permissions: Permissions;
  personId: string;
}
export interface UserData {
  name: string;
  username: string;
  role: string;
  permissions: Permissions;
  readCommentsClearedDate?: string | null;
}
