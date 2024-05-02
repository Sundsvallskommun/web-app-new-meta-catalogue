import { OrganizationTree } from '../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../src/services/api-service';

export const organization: ApiResponse<OrganizationTree> = {
  data: {
    organizationId: 'organizationId',
    id: 1,
    level: 1,
    label: 'label',
    abbreviation: 'abbreviation',
    orgName: 'orgName',
    orgNameShort: 'orgNameShort',
    parentId: 1,
    isLeafLevel: true,
    responsibilityCode: '1',
  },
  message: 'success',
};
