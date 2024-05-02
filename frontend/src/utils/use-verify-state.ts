import { Draft } from '@data-contracts/backend/data-contracts';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useSaveStore } from '@services/save-service/save-service';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const needsVerify = (draft, lastChangeDate, lastVerificationDate) => {
  if (draft.changes > 0) {
    // on init
    if (draft.verifyResult === null) return true;
    // on change
    if (dayjs(lastChangeDate).isAfter(lastVerificationDate) || (lastChangeDate && !lastVerificationDate)) return true;
  }

  return false;
};

export default function useVerifyState(_draft?: Draft) {
  const draft = _draft ? _draft : useOrgChangeStore.getState().draft;
  const lastVerificationDate = useOrgChangeStore.getState().lastVerificationDate;
  const lastChangeDate = useOrgChangeStore.getState().lastChangeDate;
  let verifyHasErrors = false;
  const isUnsaved = useSaveStore.getState().isUnsaved;

  const [needsNewVerify, setNeedsNewVerify] = useState(needsVerify(draft, lastChangeDate, lastVerificationDate));

  useEffect(() => {
    setNeedsNewVerify(needsVerify(draft, lastChangeDate, lastVerificationDate));
  }, [isUnsaved, draft, lastChangeDate, lastVerificationDate]);

  if (draft.verifyResult?.numberOfValidationErrors > 0) {
    verifyHasErrors = true;
  }

  return { verifyHasErrors, needsNewVerify };
}
