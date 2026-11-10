import {
  OrganizationResponsibility,
  OrganizationResponsibilityTypeOfResponsibilityEnum,
} from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const responsibilityType = (type) => {
  let text, color;
  if (type == OrganizationResponsibilityTypeOfResponsibilityEnum.LONEANSVAR) {
    text = 'Löneansvar';
    color = 'success';
  } else if (type == OrganizationResponsibilityTypeOfResponsibilityEnum.PSEUDOANSVAR) {
    text = 'Pseudoansvar';
    color = 'warning';
  } else {
    text = 'Ansvar';
    color = 'bjornstigen';
  }
  return { text: text, color: color };
};

export const handleGetAllResponsibilities: (
  res: ApiResponse<OrganizationResponsibility[]>
) => OrganizationResponsibility[] = (res) => {
  return res.data.map((data) => ({
    responsibilityCode: data.responsibilityCode || '',
    orgId: data.orgId,
    responsibilityText: data.responsibilityText || '',
    responsibilityValidFrom: data.responsibilityValidFrom || '',
    orgResponsibilityId: data.orgResponsibilityId || '',
    orgName: data.orgName || '',
    orgFromName: data.orgFromName || '',
    typeOfResponsibility: data.typeOfResponsibility || OrganizationResponsibilityTypeOfResponsibilityEnum.ANSVAR,
  }));
};
