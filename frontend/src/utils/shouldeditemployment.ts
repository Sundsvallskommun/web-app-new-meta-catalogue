import { OrgChangeEmployment } from '@data-contracts/backend/data-contracts';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';

/**
 * Get states for when edit is needed on an employee employment
 * @param employmentDetails
 * @returns
 */
export const shouldEditEmployment = (employmentDetails: OrgChangeEmployment) => {
  const mustEditPaTeam = !employmentDetails.paTeam && !employmentDetails.newPATeam;
  const mustEditOperation =
    (!employmentDetails.operationCode && !employmentDetails.newOperationCode) ||
    !!!useOrgChangeStore
      .getState()
      .operationsByOrg.find(
        (x) => x.operationCode === (employmentDetails.newOperationCode || employmentDetails.operationCode)
      );
  const mustEdit = mustEditPaTeam || mustEditOperation;
  const showFocus = mustEdit || employmentDetails.movedToNewOrg;

  return { showFocus, mustEdit, mustEditPaTeam, mustEditOperation };
};
