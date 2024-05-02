import {
  OrganizationResponsibility,
  OrganizationResponsibilityTypeOfResponsibilityEnum,
} from '../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../src/services/api-service';

export const responsibilitiesCompany2: ApiResponse<OrganizationResponsibility[]> = {
  data: [
    {
      orgResponsibilityId: '42a6ebbc-2f8f-42a6-bb60-592acad3af0e',
      responsibilityCode: '39990000',
      orgId: null,
      responsibilityText: 'FYI Ans',
      responsibilityValidFrom: '1799-12-31',
      orgName: null,
      orgFromName: null,
      typeOfResponsibility: OrganizationResponsibilityTypeOfResponsibilityEnum.PSEUDOANSVAR,
    },
  ],
  message: 'success',
};
