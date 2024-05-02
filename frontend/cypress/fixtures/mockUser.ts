import { User, UserRoleEnum } from '../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../src/services/api-service';

export const user: ApiResponse<User> = {
  data: {
    name: 'Mel Eli',
    username: 'aaa12bbb',
    role: UserRoleEnum.MetaAdmin,
    permissions: {
      canCommentDraft: true,
      canEditSystemMessages: true,
      canViewEmployeeDetails: true,
      canViewDrafts: true,
      canEditEmployeeDetails: true,
      canEditResponsibility: true,
      canEditOperation: true,
      canEditOrganization: true,
      canEditOrganizationStructure: true,
    },
    readCommentsClearedDate: null,
  },
  message: 'success',
};
