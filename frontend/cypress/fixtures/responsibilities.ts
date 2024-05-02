import {
  OrganizationResponsibility,
  OrganizationResponsibilityTypeOfResponsibilityEnum,
} from '../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../src/services/api-service';

export const responsibilities: ApiResponse<OrganizationResponsibility[]> = {
  data: [
    {
      orgResponsibilityId: '8ce77bbc-2f8f-42a6-bb60-592acad3af0e',
      responsibilityCode: '69990000',
      orgId: null,
      responsibilityText: 'BoU Pseudo',
      responsibilityValidFrom: '1799-12-31',
      orgName: null,
      orgFromName: null,
      typeOfResponsibility: OrganizationResponsibilityTypeOfResponsibilityEnum.PSEUDOANSVAR,
    },
    {
      orgResponsibilityId: '9ce77bbc-2f8f-42a6-bb60-592acad3af0e',
      responsibilityCode: '69990002',
      orgId: null,
      responsibilityText: 'BoU Löne',
      responsibilityValidFrom: '1899-12-31',
      orgName: null,
      orgFromName: null,
      typeOfResponsibility: OrganizationResponsibilityTypeOfResponsibilityEnum.LONEANSVAR,
    },
    {
      orgResponsibilityId: '9ce77bbc-2f8f-42a6-bb60-592acad3af0e',
      responsibilityCode: '69990001',
      orgId: null,
      responsibilityText: 'BoU Ans',
      responsibilityValidFrom: '9999-12-31',
      orgName: null,
      orgFromName: null,
      typeOfResponsibility: OrganizationResponsibilityTypeOfResponsibilityEnum.ANSVAR,
    },
  ],
  message: 'success',
};
