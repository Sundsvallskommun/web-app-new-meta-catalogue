import {
  OrgChangeOrganizationOperation,
  OrgChangeOrganizationOperationChangeStatusEnum,
} from '../../../src/data-contracts/backend/data-contracts';

export const orgChangeOperationsNotInOrg: OrgChangeOrganizationOperation[] = [
  {
    organizationOperationId: 14,
    operationId: 558,
    operationCode: '25',
    description: 'Test Description 95',
    companyId: 1,
    orgId: 123,
    fromDate: '2023-11-14',
    toDate: '2023-03-07',
    changeId: 'f97972e6-20a6-4536-b508-03ee9f361375',
    changeStatus: OrgChangeOrganizationOperationChangeStatusEnum.NEW,
  },
  {
    organizationOperationId: 710,
    operationId: 986,
    operationCode: '58',
    description: 'Test Description 20',
    companyId: 1,
    orgId: 123,
    fromDate: '2023-09-18',
    toDate: '2023-06-12',
    changeId: null,
    changeStatus: OrgChangeOrganizationOperationChangeStatusEnum.ORIGINAL_ROW,
  },
  {
    organizationOperationId: 821,
    operationId: 591,
    operationCode: '76',
    description: 'Test Description 31',
    companyId: 1,
    orgId: 123,
    fromDate: '2023-12-12',
    toDate: '2023-09-01',
    changeId: 'cb0ff7ac-a2aa-4dff-84bb-ba7a65d9e8b2',
    changeStatus: OrgChangeOrganizationOperationChangeStatusEnum.RENAMED,
  },
];
