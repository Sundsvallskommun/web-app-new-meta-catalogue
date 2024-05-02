import { OrgOperation } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const handleGetAllOperations: (res: ApiResponse<OrgOperation[]>) => OrgOperation[] = (res) => {
  return res.data.map((data) => ({
    orgOperationId: data.orgOperationId,
    orgId: data.orgId,
    operationCode: data.operationCode,
    operationDescription: data.operationDescription,
  }));
};
