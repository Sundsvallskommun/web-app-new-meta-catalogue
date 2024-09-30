import { ApiResponse } from '@services/api-service';
import { Permissions, User, UserRoleEnum } from '@data-contracts/backend/data-contracts';

export const defaultPermissions: Permissions = {
  canEditSystemMessages: false,
  canViewEmployees: false,
  canViewEmployeeDetails: false,
  canEditEmployeeDetails: false,
  canViewResponsibility: false,
  canEditResponsibility: false,
  canViewOperation: false,
  canEditOperation: false,
  canEditOrganization: false,
  canViewDrafts: false,
  canEditDrafts: false,
  canEditOrganizationStructure: false,
  canCommentDraft: false,
};

export const emptyUser: User = {
  name: '',
  username: '',
  role: UserRoleEnum.MetaRead,
  permissions: defaultPermissions,
  readCommentsClearedDate: null,
};

export const emptyUserResponse: ApiResponse<User> = {
  data: emptyUser,
  message: 'none',
};
