import {
  OrganizationResponsibility,
  OrganizationResponsibilityTypeOfResponsibilityEnum,
} from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const responsibilityType = (type) => {
  let bg, text, border;
  if (type == OrganizationResponsibilityTypeOfResponsibilityEnum.LONEANSVAR) {
    text = 'Löneansvar';
    bg = 'bg-[#E0F6DE]';
    border = 'border-[#00733B]';
  } else if (type == OrganizationResponsibilityTypeOfResponsibilityEnum.PSEUDOANSVAR) {
    text = 'Pseudoansvar';
    bg = 'bg-[#f9e9ca]';
    border = 'border-[#C16A03]';
  } else {
    text = 'Ansvar';
    bg = 'bg-[#D7DBF2]';
    border = 'border-[#5B1F78]';
  }
  return { bg: bg, text: text, border: border };
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
