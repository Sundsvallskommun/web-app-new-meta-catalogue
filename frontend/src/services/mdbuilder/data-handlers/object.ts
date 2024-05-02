import { OrgChangeObject } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const handleGetAllObjectsInCompany: (res: ApiResponse<OrgChangeObject[]>) => OrgChangeObject[] = (res) => {
  return res.data.map((data) => ({
    objectId: data.objectId,
    objectCode: data.objectCode,
    description: data.description,
    companyId: data.companyId,
  }));
};
