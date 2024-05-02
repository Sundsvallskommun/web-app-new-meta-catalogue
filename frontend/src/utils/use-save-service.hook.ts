import { useSaveStore } from '@services/save-service/save-service';
import { useEffect } from 'react';

export function useSaveState(formKeyName: string, isDirty: boolean) {
  const updateSaveState = useSaveStore((s) => s.updateSaveState);
  useEffect(() => {
    updateSaveState(formKeyName, isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);
}
