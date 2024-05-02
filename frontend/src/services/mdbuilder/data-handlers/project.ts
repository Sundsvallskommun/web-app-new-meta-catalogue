import { OrgChangeProject } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const handleGetAllProjectsInCompany: (res: ApiResponse<OrgChangeProject[]>) => OrgChangeProject[] = (res) => {
  return res.data.map((data) => ({
    projectId: data.projectId,
    projectCode: data.projectCode,
    description: data.description,
    companyId: data.companyId,
  }));
};
