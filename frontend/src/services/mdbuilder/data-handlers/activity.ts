import { OrgChangeActivity } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const handleGetAllActivitiesInCompany: (res: ApiResponse<OrgChangeActivity[]>) => OrgChangeActivity[] = (
  res
) => {
  return res.data.map((data) => ({
    activityId: data.activityId,
    activityCode: data.activityCode,
    description: data.description,
    companyId: data.companyId,
  }));
};
