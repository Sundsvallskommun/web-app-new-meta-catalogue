import { Organization } from '../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../src/services/api-service';

export const organizationRoot: ApiResponse<Organization[]> = {
  data: [
    {
      id: 13,
      orgName: 'Sundsvalls kommun',
      label: 'Sundsvalls kommun',
      orgNameShort: 'Sundsvalls kommun',
      abbreviation: '',
      parentId: null,
      isLeafLevel: false,
      level: 1,
      responsibilityCode: null,
      companyId: 1,
    },
    {
      id: 14,
      orgName: 'Mittuniversitetet',
      label: 'Mittuniversitetet',
      orgNameShort: 'Mittuniversitetet',
      abbreviation: '',
      parentId: null,
      isLeafLevel: false,
      level: 1,
      responsibilityCode: null,
      companyId: 2,
    },
  ],
  message: 'success',
};
