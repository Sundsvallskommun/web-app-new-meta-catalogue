import { Organization, OrganizationTree } from '@/data-contracts/mdviewer/data-contracts';

export type OrganizationTreeModified = Omit<OrganizationTree, 'orgId' | 'orgDisplayName' | 'treeLevel' | 'organizations'> & {
  id: number | string;
  label: string;
  level: number;
  subItems?: OrganizationTreeModified[] | [] | null;
};

export type OrganizationModified = Omit<Organization, 'orgId' | 'treeLevel'> & {
  id?: Organization['orgId'];
  level?: Organization['treeLevel'];
};
