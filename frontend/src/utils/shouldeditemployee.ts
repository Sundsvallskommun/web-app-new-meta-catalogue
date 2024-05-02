import { OrgChangeOrganizationEmployee } from '@data-contracts/backend/data-contracts';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { renderNewOrOld } from './render-new-or-old';

/**
 * Get states for when edit is needed on an employee
 * @param person
 * @returns
 */

export const shouldEditEmployee = (person: OrgChangeOrganizationEmployee) => {
  const mustEditPaTeam = !person.paTeam && !person.newPATeam;
  const mustEditOperation =
    (!person.operationCode && !person.newOperationCode) ||
    !!!useOrgChangeStore
      .getState()
      .operationsByOrg.find((x) => x.operationCode === renderNewOrOld(person.newOperationCode, person.operationCode));
  const mustEdit = mustEditPaTeam || mustEditOperation;
  const showFocus = mustEdit || person.movedToNewOrg;

  return { showFocus, mustEdit, mustEditPaTeam, mustEditOperation };
};
