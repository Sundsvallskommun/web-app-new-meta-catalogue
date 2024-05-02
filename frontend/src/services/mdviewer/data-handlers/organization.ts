import { Organization, OrganizationTree } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const handleGetRootTree: (res: ApiResponse<Organization[]>) => Organization[] = (res) => {
  return res.data.map((data) => ({
    label: data.orgName,
    id: data.id,
    level: data.level,
    orgName: data.orgName,
    abbreviation: data.abbreviation,
    orgNameShort: data.orgNameShort,
    parentId: data.parentId,
    isLeafLevel: data.isLeafLevel,
    responsibilityCode: data.responsibilityCode,
    companyId: data.companyId,
  }));
};

export const handleGetOrgTree: (res: ApiResponse<OrganizationTree[]>) => OrganizationTree[] = (res) => {
  return res.data.map((data) => ({
    organizationId: data.organizationId,
    id: data.id,
    level: data.level,
    label: data.label,
    abbreviation: data.abbreviation,
    orgName: data.orgName,
    orgNameShort: data.orgNameShort,
    parentId: data.parentId,
    isLeafLevel: data.isLeafLevel,
    responsibilityCode: data.responsibilityCode,
    responsibilityList: data.responsibilityList,
    subItems: data.subItems,
  }));
};

export const handleGetCompanyOrg: (data: Organization[]) => Organization[] = (res) => {
  return res.map((data) => ({
    id: data.id,
    label: data.label,
    orgNameShort: data.orgNameShort,
    abbreviation: data.abbreviation,
    parentId: data.parentId,
    isLeafLevel: data.isLeafLevel,
    level: data.level,
    responsibilityCode: data.responsibilityCode,
    companyId: data.companyId,
  }));
};
