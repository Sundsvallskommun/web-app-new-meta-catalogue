import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';

/**
 * Get states for when edit is needed on some employee of all in employeesByOrg
 * @returns
 */
export const shouldEditEmployees = () => {
  const employeesByOrg = useOrgChangeStore.getState().employeesByOrg;
  const operationsByOrg = useOrgChangeStore.getState().operationsByOrg;

  const mustEditPaTeam = !!employeesByOrg.find((x) => (!x.newPATeam && !x.paTeam) || (!x.paTeam && !x.newPATeam));
  const mustEditOperation = !!employeesByOrg.find(
    (x) =>
      (!x.newOperationCode && !x.operationCode) ||
      !x.operationCode ||
      !!!operationsByOrg.find((y) => y.operationCode === (x.newOperationCode || x.operationCode))
  );
  const mustEdit = mustEditPaTeam || mustEditOperation;
  const showFocus = mustEdit || !!employeesByOrg.find((x) => x.movedToNewOrg);

  return { showFocus, mustEdit, mustEditPaTeam, mustEditOperation };
};
