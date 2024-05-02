import { OrgChangeOrganizationTree } from '../../../src/data-contracts/backend/data-contracts';
import { flatten } from '../../../src/utils/flatten';
import { orgTreeResponse } from '../getOrgtree';

export const companyOrganizations: OrgChangeOrganizationTree[] = flatten(
  orgTreeResponse.data,
  (x: OrgChangeOrganizationTree) => x.subItems,
  orgTreeResponse.data
);
