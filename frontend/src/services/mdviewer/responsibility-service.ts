import { OrganizationResponsibility } from '@data-contracts/backend/data-contracts';
import { ServiceResponse } from '@interfaces/service';
import { IFilterData, __DEV__ } from '@sk-web-gui/react';
import { devtools, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { defaultResponsibilityFilter, orgDefaultResponsibilityFilter } from './defaults/responsibility';
import {
  getResponsibilities,
  getResponsibilitiesByOrg,
  getResponsibilitiesByOrgAndUnder,
} from './api-calls/responsibility';

interface State {
  responsibilities: OrganizationResponsibility[];
  responsibilitiesIsLoading: boolean;
  responsibilitiesByOrg: OrganizationResponsibility[];
  responsibilitiesByOrgIsLoading: boolean;
  selectedCompanyId: number;
  responsibilityFilter: IFilterData[];
  orgResponsibilityFilter: IFilterData[];
}

interface Actions {
  getResponsibilities: (
    selectedCompanyId: number,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrganizationResponsibility[]>>;
  getResponsibilitiesByOrg: (
    orgId: number | null,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrganizationResponsibility[]>>;
  getResponsibilitiesByOrgAndUnder: (
    orgId: number | null,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrganizationResponsibility[]>>;
  setSelectedCompanyId: (selectedCompanyId: number) => Promise<void>;
  setResponsibilityFilter: (responsibilityFilter: IFilterData[]) => Promise<void>;
  setOrgResponsibilityFilter: (orgResponsibilityFilter: IFilterData[]) => Promise<void>;
  reset: () => Promise<void>;
}

const initialState: State = {
  responsibilities: [],
  responsibilitiesIsLoading: false,
  responsibilitiesByOrg: [],
  responsibilitiesByOrgIsLoading: false,
  selectedCompanyId: 1,
  responsibilityFilter: defaultResponsibilityFilter,
  orgResponsibilityFilter: orgDefaultResponsibilityFilter,
};

export const useResponsibilityStore = createWithEqualityFn<
  State & Actions,
  [
    ['zustand/devtools', never],
    ['zustand/persist', { responsibilityFilter: IFilterData[]; orgResponsibilityFilter: IFilterData[] }],
  ]
>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        getResponsibilities: async (selectedCompanyId?, signal?) => {
          const companyId = selectedCompanyId || get().selectedCompanyId;
          await set(() => ({ responsibilitiesIsLoading: true }));
          const res = await getResponsibilities(companyId, signal);
          const data = (!res.error && res.data) || initialState.responsibilities;
          await set(() => ({ responsibilities: data, responsibilitiesIsLoading: false }));
          return { data, error: res.error };
        },
        getResponsibilitiesByOrg: async (orgId, signal) => {
          if (orgId === null) {
            await set(() => ({
              responsibilitiesByOrg: initialState.responsibilitiesByOrg,
              responsibilitiesByOrgIsLoading: initialState.responsibilitiesByOrgIsLoading,
            }));
            return;
          }
          await set(() => ({ responsibilitiesByOrgIsLoading: true }));
          const res = await getResponsibilitiesByOrg(orgId, signal);
          const data = (!res.error && res.data) || initialState.responsibilitiesByOrg;
          await set(() => ({ responsibilitiesByOrg: data, responsibilitiesByOrgIsLoading: false }));
          return { data, error: res.error };
        },
        getResponsibilitiesByOrgAndUnder: async (orgId, signal) => {
          if (orgId === null) {
            await set(() => ({
              responsibilitiesByOrg: initialState.responsibilitiesByOrg,
              responsibilitiesByOrgIsLoading: initialState.responsibilitiesByOrgIsLoading,
            }));
            return;
          }
          await set(() => ({ responsibilitiesByOrgIsLoading: true }));
          const res = await getResponsibilitiesByOrgAndUnder(orgId, signal);
          const data = (!res.error && res.data) || initialState.responsibilitiesByOrg;
          await set(() => ({ responsibilitiesByOrg: data, responsibilitiesByOrgIsLoading: false }));
          return { data, error: res.error };
        },
        setSelectedCompanyId: async (selectedCompanyId) => {
          await set(() => ({ selectedCompanyId }));
        },
        setResponsibilityFilter: async (responsibilityFilter) => await set(() => ({ responsibilityFilter })),
        setOrgResponsibilityFilter: async (orgResponsibilityFilter) => await set(() => ({ orgResponsibilityFilter })),
        reset: async () => {
          await set(initialState);
        },
      }),
      {
        name: 'responsibility-storage',
        version: 4,
        partialize: ({ selectedCompanyId, responsibilityFilter, orgResponsibilityFilter }) => ({
          selectedCompanyId,
          responsibilityFilter,
          orgResponsibilityFilter,
        }),
      }
    ),
    { name: 'responsibility-storage', enabled: __DEV__ }
  )
);
