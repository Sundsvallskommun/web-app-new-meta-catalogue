import {
  CloseResponsibilityDto,
  OrgChangeResponsibility,
  OrgChangeResponsibilityDescriptionChangeStatusEnum,
  OrgChangeResponsibilityResponsibilityChangeStatusEnum,
  OrgChangeResponsibilityResponsibilityTypeIdEnum,
  RenameResponsibilityDto,
  ResponsibilityCreateDto,
} from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';
import dayjs from 'dayjs';

export const getAccountStatus = (fromDate, toDate, isPassive) => {
  const now = new Date().toLocaleDateString('sv-SE');
  const from = new Date(fromDate).toLocaleDateString('sv-SE');
  const to = new Date(toDate).toLocaleDateString('sv-SE');
  let status;
  let dot: 'primary' | 'error' | 'warning' | 'neutral';
  if (
    now > dayjs(from).add(-1, 'day').format('YYYY-MM-DD') &&
    now < dayjs(to).add(-2, 'day').format('YYYY-MM-DD') &&
    !isPassive
  ) {
    status = 'Aktiv';
    dot = 'primary';
  } else if (now === dayjs(from).add(-1, 'day').format('YYYY-MM-DD')) {
    status = 'Aktiveras snart';
    dot = 'warning';
  } else if (now === dayjs(to).format('YYYY-MM-DD') || now === dayjs(to).add(-1, 'day').format('YYYY-MM-DD')) {
    status = 'Pågående inaktivering';
    dot = 'warning';
  } else {
    status = 'Inaktiv';
    dot = 'neutral';
  }
  return { status: status, dot: dot };
};

export const handleSendNewResponsibility: (newResponsibility: ResponsibilityCreateDto) => ResponsibilityCreateDto = (
  newResponsibility
) => ({
  orgId: newResponsibility.orgId,
  responsibilityCode: newResponsibility.responsibilityCode,
  description: newResponsibility.description,
  responsibilityType: newResponsibility.responsibilityType,
});

export const handleRenameResponsibility: (body: RenameResponsibilityDto) => RenameResponsibilityDto = (body) => ({
  responsibilityId: body.responsibilityId,
  description: body.description,
});

export const handleCloseResponsibility: (body: CloseResponsibilityDto) => CloseResponsibilityDto = (body) => ({
  responsibilityId: body.responsibilityId,
});

export const handleGetResponsibilitiesByOrg: (
  res: ApiResponse<OrgChangeResponsibility[]>
) => OrgChangeResponsibility[] = (res) => {
  return res.data.map((data) => ({
    responsibilityId: data.responsibilityId || null,
    responsibilityCode: data.responsibilityCode || '',
    responsibilityTypeId: data.responsibilityTypeId || OrgChangeResponsibilityResponsibilityTypeIdEnum.ANSVAR,
    responsibilityType: data.responsibilityType || '',
    description: data.description || '',
    orgId: data.orgId || null,
    companyId: data.companyId || null,
    responsibilityFromDate: data.responsibilityFromDate || '',
    responsibilityToDate: data.responsibilityToDate || '',
    responsibilityPassive: data.responsibilityPassive || false,
    responsibilityChangeId: data.responsibilityChangeId || '',
    responsibilityChangeStatus:
      data.responsibilityChangeStatus || OrgChangeResponsibilityResponsibilityChangeStatusEnum.ORIGINAL_ROW,
    descriptionFromDate: data.descriptionFromDate || '',
    descriptionToDate: data.descriptionToDate || '',
    descriptionChangeId: data.descriptionChangeId || '',
    descriptionChangeStatus:
      data.descriptionChangeStatus || OrgChangeResponsibilityDescriptionChangeStatusEnum.ORIGINAL_ROW,
  }));
};
