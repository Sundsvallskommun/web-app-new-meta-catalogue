import { __DEV__ } from '@sk-web-gui/react';
import { devtools } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

interface State {
  isUnsaved: boolean;
  isSaving: boolean;
  formStates: { [key: string]: boolean };
}
interface Actions {
  setIsSaving: (isSaving: boolean) => void;
  updateSaveState: (formKeyName: string, isDirty: boolean) => void;
  reset: () => void;
}

const initialState: State = {
  isUnsaved: false,
  isSaving: false,
  formStates: {},
};

export const useSaveStore = createWithEqualityFn<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setIsSaving: (isSaving) => set(() => ({ isSaving })),
      updateSaveState: (formKeyName, isDirty) => {
        const formStates = get().formStates;
        formStates[formKeyName] = isDirty;
        const isUnsaved = Object.values(formStates).some((x) => x === true);
        if (isUnsaved !== get().isUnsaved) {
          set(() => ({ isUnsaved, formStates, isSaving: false }));
        }
      },
      reset: () => {
        set(initialState);
      },
    }),
    { name: 'save-storage', enabled: __DEV__ }
  )
);
