import { Organization, OrganizationTree } from '@data-contracts/backend/data-contracts';
import { ServiceResponse } from '@interfaces/service';
import { __DEV__ } from '@sk-web-gui/react';
import { findIdInTree } from '@utils/findIdInTree';
import { devtools, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { emptyOrganization } from './defaults/organization';
import { getCompanyOrganizations, getOrgTree, getRootOrg } from './api-calls/organization';
import { flatten } from '@utils/flatten';

interface State {
  organization: OrganizationTree;
  organizationIsLoading: boolean;
  companyOrganizationsIsLoading: boolean;
  companyOrganizations: Organization[];
  selectedCompanyId: number | null;
  selectedOrganizationId: number | null;
  company: OrganizationTree;
  orgTree: OrganizationTree[];
  orgTreeOrganizations: Organization[];
  companyIsLoading: boolean;
  orgTreeIsLoading: boolean;
  selectedCompanyOrgId: number;
  organizationTabIndex: number;
  treeImageId: number;
  treeImage: Organization[];
}

interface Actions {
  setOrganization: (organization: OrganizationTree) => Promise<void>;
  getOrganization: (
    selectedOrganizationId?: number,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrganizationTree>>;
  setCompanyOrganizations: (companyOrganizations: Organization[]) => Promise<void>;
  getCompanyOrganizations: (
    selectedCompanyId?: number,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<Organization[]>>;
  setSelectedCompanyId: (selectedCompanyId: number) => Promise<void>;
  setSelectedOrganizationId: (selectedOrganizationId: number) => Promise<void>;
  setCompany: (company: OrganizationTree) => Promise<void>;
  setOrgTree: (orgTree: OrganizationTree[]) => Promise<void>;
  getCompany: (selectedCompanyOrgId?: number) => Promise<ServiceResponse<OrganizationTree>>;
  getOrgTree: (selectedOrgTreeId?: number) => Promise<ServiceResponse<OrganizationTree[]>>;
  setSelectedCompanyOrgId: (selectedCompanyOrgId: number) => Promise<void>;
  setOrganizationTabIndex: (index: number) => Promise<void>;
  getTreeImage: () => Promise<ServiceResponse<Organization[]>>;
  setTreeImageId: (treeImageId: number) => Promise<void>;
  setTreeImage: (treeImage: Organization[]) => Promise<void>;
  reset: () => Promise<void>;
}

const initialState: State = {
  organization: emptyOrganization,
  organizationIsLoading: false,
  companyOrganizationsIsLoading: false,
  companyOrganizations: [],
  selectedCompanyId: null,
  selectedOrganizationId: null,
  company: emptyOrganization,
  orgTree: [],
  orgTreeOrganizations: [],
  companyIsLoading: false,
  orgTreeIsLoading: false,
  selectedCompanyOrgId: 13,
  organizationTabIndex: 0,
  treeImageId: 0,
  treeImage: [],
};

export const useOrganizationStore = createWithEqualityFn<
  State & Actions,
  [
    ['zustand/devtools', never],
    [
      'zustand/persist',
      {
        selectedOrganizationId: number;
        selectedCompanyOrgId: number;
        selectedCompanyId: number;
        organizationTabIndex: number;
      },
    ],
  ]
>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setOrganization: async (organization) => await set(() => ({ organization })),
        getOrganization: async (selectedOrganizationId?) => {
          const organizationId = selectedOrganizationId || get().selectedOrganizationId;
          if (organizationId === null) {
            await set(() => ({ organization: emptyOrganization }));
            return;
          }
          await set(() => ({ organizationIsLoading: true }));
          let res;
          const data = findIdInTree(get().orgTree, organizationId, 'subItems'); // Select already fetched in tree
          await set(() => ({ organization: data, organizationIsLoading: false }));
          return { data: data, error: res ? res.error : false };
        },
        setCompanyOrganizations: async (companyOrganizations) => await set(() => ({ companyOrganizations })),
        getCompanyOrganizations: async (selectedCompanyId, signal) => {
          const companyId = selectedCompanyId || get().selectedCompanyId;
          if (companyId === null) {
            await set(() => ({ companyOrganizations: initialState.companyOrganizations }));
            return;
          }
          await set(() => ({ companyOrganizationsIsLoading: true }));
          const res = await getCompanyOrganizations(companyId, signal);
          const data = (!res.error && res.data) || initialState.companyOrganizations;
          await set(() => ({ companyOrganizations: data, companyOrganizationsIsLoading: false }));
          return { data };
        },
        setSelectedCompanyId: async (selectedCompanyId) => {
          await set(() => ({ selectedCompanyId }));
        },
        setSelectedOrganizationId: async (selectedOrganizationId) => {
          await set(() => ({ selectedOrganizationId }));
          await get().getOrganization(selectedOrganizationId);
        },
        setCompany: async (company) => await set(() => ({ company })),
        setOrgTree: async (orgTree) => await set(() => ({ orgTree })),
        getOrgTree: async () => {
          await set(() => ({ orgTreeIsLoading: true }));
          const data = get().company.subItems;
          let orgTreeOrganizations = [];
          orgTreeOrganizations = flatten(
            data,
            (x) => x.subItems,
            data,
            (x, parent) => Object.assign(x, { orgFromName: parent.label })
          );
          await set(() => ({ orgTree: data, orgTreeIsLoading: false, orgTreeOrganizations }));
          return { data, error: false };
        },
        getCompany: async (selectedCompanyOrgId?) => {
          const companyOrgId = selectedCompanyOrgId || get().selectedCompanyOrgId;
          if (companyOrgId === null) {
            await set(() => ({ company: emptyOrganization }));
            return;
          }
          const { treeImageId, selectedOrganizationId } = get();
          await set(() => ({ companyIsLoading: true, orgTreeIsLoading: true, organizationIsLoading: true }));
          const res = await getOrgTree(companyOrgId, treeImageId);
          const data = (!res.error && res.data.length > 0 && res.data[0]) || get().company;
          await set(() => ({ company: data, companyIsLoading: false }));
          await get().getOrgTree(); // update orgTree
          await get().getOrganization(selectedOrganizationId); // update organization
          return { data: data, error: res.error };
        },
        setSelectedCompanyOrgId: async (selectedCompanyOrgId) => {
          await set(() => ({ selectedCompanyOrgId }));
          await get().getCompany(selectedCompanyOrgId);
        },
        setOrganizationTabIndex: async (organizationTabIndex) => await set(() => ({ organizationTabIndex })),
        setTreeImageId: async (treeImageId) => {
          await set(() => ({ treeImageId }));
          await get().getCompany();
        },
        getTreeImage: async () => {
          const res = await getRootOrg();
          if (!res.error) {
            await get().setTreeImage(res.data);
          }
          return { data: res.data, error: res.error };
        },
        setTreeImage: async (treeImage) => await set(() => ({ treeImage })),
        reset: async () => {
          await set(initialState);
        },
      }),
      {
        name: 'organization-storage',
        version: 3,
        partialize: ({ selectedOrganizationId, selectedCompanyOrgId, organizationTabIndex, selectedCompanyId }) => ({
          selectedOrganizationId,
          selectedCompanyOrgId,
          selectedCompanyId,
          organizationTabIndex,
        }),
      }
    ),
    { name: 'organization-storage', enabled: __DEV__ }
  )
);
