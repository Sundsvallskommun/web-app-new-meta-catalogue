import { User, UserRoleEnum } from '../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../src/services/api-service';

export const user: ApiResponse<User> = {
  data: {
    name: 'Mel Eli',
    username: 'aaa12bbb',
    role: UserRoleEnum.MetaAdmin,
    permissions: {
      canEditSystemMessages: true,
      canViewEmployees: true,
      canViewEmployeeDetails: true,
      canEditEmployeeDetails: true,
      canViewResponsibility: true,
      canEditResponsibility: true,
      canViewOperation: true,
      canEditOperation: true,
      canEditOrganization: true,
      canViewDrafts: true,
      canEditDrafts: true,
      canEditOrganizationStructure: true,
      canCommentDraft: true,
    },
    readCommentsClearedDate: null,
  },
  message: 'success',
};
