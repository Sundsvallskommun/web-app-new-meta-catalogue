import { OrgOperation } from '@data-contracts/backend/data-contracts';
import { ServiceResponse } from '@interfaces/service';
import { IFilterData, __DEV__ } from '@sk-web-gui/react';
import { devtools, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { orgDefaultOperationFilter } from './defaults/operation';
import { getOperationsByOrg, getOperationsByOrgAndUnder } from './api-calls/operation';

interface State {
  operationsByOrg: OrgOperation[];
  operationsByOrgIsLoading: boolean;
  orgOperationFilter: IFilterData[];
}

interface Actions {
  setOperationsByOrg: (operationsByOrg: OrgOperation[]) => void;
  getOperationsByOrg: (orgId: number, signal?: AbortSignal) => Promise<ServiceResponse<OrgOperation[]>>;
  setOperationsByOrgIsLoading: (operationsByOrgIsLoading: boolean) => void;
  getOperationsByOrgAndUnder: (orgId: number, signal?: AbortSignal) => Promise<ServiceResponse<OrgOperation[]>>;
  setOrgOperationFilter: (orgOperationFilter: IFilterData[]) => Promise<void>;
  reset: () => void;
}

const initialState: State = {
  operationsByOrg: [],
  operationsByOrgIsLoading: false,
  orgOperationFilter: orgDefaultOperationFilter,
};

export const useOperationStore = createWithEqualityFn<
  State & Actions,
  [['zustand/devtools', never], ['zustand/persist', { orgOperationFilter: IFilterData[] }]]
>(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setOperationsByOrg: (operationsByOrg) => set(() => ({ operationsByOrg })),
        getOperationsByOrg: async (orgId, signal) => {
          if (orgId === null) {
            await set(() => ({
              operationsByOrg: initialState.operationsByOrg,
              operationsByOrgIsLoading: initialState.operationsByOrgIsLoading,
            }));
            return;
          }
          await set(() => ({ operationsByOrgIsLoading: true }));
          const res = await getOperationsByOrg(orgId, signal);
          const data = (!res.error && res.data) || initialState.operationsByOrg;
          await set(() => ({ operationsByOrg: data, operationsByOrgIsLoading: false }));
          return { data, error: res.error };
        },
        setOperationsByOrgIsLoading: (operationsByOrgIsLoading) => set(() => ({ operationsByOrgIsLoading })),
        getOperationsByOrgAndUnder: async (orgId, signal) => {
          await set(() => ({ operationsByOrgIsLoading: true }));
          const res = await getOperationsByOrgAndUnder(orgId, signal);
          const data = (!res.error && res.data) || initialState.operationsByOrg;
          await set(() => ({ operationsByOrg: data, operationsByOrgIsLoading: false }));
          return { data, error: res.error };
        },
        setOrgOperationFilter: async (orgOperationFilter) => await set(() => ({ orgOperationFilter })),
        reset: async () => {
          await set(initialState);
        },
      }),
      {
        name: 'operation-storage',
        version: 3,
        partialize: ({ orgOperationFilter }) => ({
          orgOperationFilter,
        }),
      }
    ),
    { name: 'operation-storage', enabled: __DEV__ }
  )
);
