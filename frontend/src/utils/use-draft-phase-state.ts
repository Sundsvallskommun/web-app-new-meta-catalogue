import { Draft, DraftPhaseEnum, UserRoleEnum } from '@data-contracts/backend/data-contracts';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useUserStore } from '@services/user-service/user-service';

export const allPhases = Array.from(Object.values(DraftPhaseEnum));

/**
 * Provides state related to the draft phase of an organization change.
 * @returns {{
 *  draftIsReadOnly: boolean,
 *  draftIsApproved: boolean,
 *  draftIsExportPhase: boolean,
 *  nextPhase: string
 * }} An object containing the state of the draft phase.
 */
export const useDraftPhaseState = (_draft?: Draft) => {
  const user = useUserStore.getState().user;
  const draft = _draft ? _draft : useOrgChangeStore.getState().draft;
  const draftPhase = _draft ? _draft.phase : draft.phase;
  let draftIsReadOnly = ![UserRoleEnum.MetaAdmin, UserRoleEnum.MetaOperator].includes(user.role);
  const draftIsApproved = draft.phase === DraftPhaseEnum.APPROVED;
  let draftIsExported = draft.phase === DraftPhaseEnum.DONE;
  const currentPhaseIndex = allPhases.indexOf(draftPhase);
  const nextPhase = allPhases[currentPhaseIndex + 1];
  const draftIsExportPhase = draft.phase === DraftPhaseEnum.EXPORT;
  const pastPhases = allPhases.slice(0, currentPhaseIndex + 1); // include current
  const draftIsArchived = draft.isArchived;

  if (draftIsApproved || draftIsExportPhase) {
    draftIsReadOnly = true;
  }

  if (draftPhase === DraftPhaseEnum.DONE) {
    draftIsExported = true;
  }

  return {
    draftIsReadOnly,
    draftIsApproved,
    draftIsExportPhase,
    draftIsExported,
    draftIsArchived,
    nextPhase,
    pastPhases,
  };
};
