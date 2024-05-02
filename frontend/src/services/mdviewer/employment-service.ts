import { MDVEmployee } from '@data-contracts/backend/data-contracts';
import { ServiceResponse } from '@interfaces/service';
import { IFilterData, __DEV__ } from '@sk-web-gui/react';
import { devtools, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { defaultEmployeeFilter } from './defaults/employment';
import { getEmployeesByOrg, getEmployeesByOrgAndUnder } from './api-calls/employment';

interface State {
  employeesByOrg: MDVEmployee[];
  employeesByOrgIsLoading: boolean;
  orgEmployeeFilter: IFilterData[];
}
interface Actions {
  setEmployeesByOrg: (employeesByOrg: MDVEmployee[]) => Promise<void>;
  getEmployeesByOrg: (orgId: number | null, signal?: AbortSignal) => Promise<ServiceResponse<MDVEmployee[]>>;
  setEmployeesByOrgIsLoading: (employeesByOrgIsLoading: boolean) => Promise<void>;
  getEmployeesByOrgAndUnder: (orgId: number, signal?: AbortSignal) => Promise<ServiceResponse<MDVEmployee[]>>;
  setOrgEmployeeFilter: (orgEmployeeFilter: IFilterData[]) => Promise<void>;
  reset: () => Promise<void>;
}

const initialState: State = {
  employeesByOrg: [],
  employeesByOrgIsLoading: false,
  orgEmployeeFilter: defaultEmployeeFilter,
};

export const useEmployeesStore = createWithEqualityFn<
  State & Actions,
  [['zustand/devtools', never], ['zustand/persist', { orgEmployeeFilter: IFilterData[] }]]
>(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setEmployeesByOrg: async (employeesByOrg) => await set(() => ({ employeesByOrg })),
        getEmployeesByOrg: async (orgId, signal) => {
          if (orgId === null) {
            await set(() => ({
              employeesByOrg: initialState.employeesByOrg,
              employeesByOrgIsLoading: initialState.employeesByOrgIsLoading,
            }));
            return;
          }
          await set(() => ({ employeesByOrgIsLoading: true }));
          const res = await getEmployeesByOrg(orgId, signal);
          const data = (!res.error && res.data) || initialState.employeesByOrg;
          await set(() => ({ employeesByOrg: data, employeesByOrgIsLoading: false }));
          return { data, error: res.error };
        },
        setEmployeesByOrgIsLoading: async (employeesByOrgIsLoading) => await set(() => ({ employeesByOrgIsLoading })),
        getEmployeesByOrgAndUnder: async (orgId, signal) => {
          await set(() => ({ employeesByOrgIsLoading: true }));
          const res = await getEmployeesByOrgAndUnder(orgId, signal);
          const data = (!res.error && res.data) || initialState.employeesByOrg;
          await set(() => ({ employeesByOrg: data, employeesByOrgIsLoading: false }));
          return { data, error: res.error };
        },
        setOrgEmployeeFilter: async (orgEmployeeFilter) => await set(() => ({ orgEmployeeFilter })),
        reset: async () => {
          await set(initialState);
        },
      }),
      {
        name: 'employees-storage',
        version: 4,
        partialize: ({ orgEmployeeFilter }) => ({
          orgEmployeeFilter,
        }),
      }
    ),
    { name: 'employees-storage', enabled: __DEV__ }
  )
);
