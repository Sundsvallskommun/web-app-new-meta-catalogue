import {
  ConnectOperationDto,
  DisconnectOperationDto,
  OrgChangeOperation,
  OrgChangeOrganizationOperation,
} from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const handleGetAllOperationsInOrg: (
  res: ApiResponse<OrgChangeOrganizationOperation[]>
) => OrgChangeOrganizationOperation[] = (res) => {
  return res.data.map((data) => ({
    organizationOperationId: data.organizationOperationId,
    operationId: data.operationId,
    operationCode: data.operationCode,
    description: data.description,
    companyId: data.companyId,
    orgId: data.orgId,
    fromDate: data.fromDate,
    toDate: data.toDate,
    changeId: data.changeId,
    changeStatus: data.changeStatus,
  }));
};

export const handleGetAllOperationsInCompany: (res: ApiResponse<OrgChangeOperation[]>) => OrgChangeOperation[] = (
  res
) => {
  return res.data.map((data) => ({
    operationId: data.operationId,
    operationCode: data.operationCode,
    description: data.description,
    companyId: data.companyId,
  }));
};

export const handleConnectOperation: (body: ConnectOperationDto) => ConnectOperationDto = (body) => ({
  operationId: body.operationId,
  orgId: body.orgId,
});

export const handleDisconnectOperation: (body: DisconnectOperationDto) => DisconnectOperationDto = (body) => ({
  organizationOperationId: body.organizationOperationId,
});
