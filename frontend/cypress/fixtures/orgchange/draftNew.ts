import { Draft, DraftPhaseEnum } from '../../../src/data-contracts/backend/data-contracts';
import { emptyVerifyResult } from './emptyVerifyResult';

export const draftNew: Draft = {
  companyName: 'Sundvalls kommun',
  draftId: 'id-hash-Draftname3',
  name: 'Draftname3',
  description: 'SIMULATED-NEW-DRAFT',
  companyId: 1,
  cutOffDate: '2999-07-01',
  phase: DraftPhaseEnum.DRAFT,
  phaseChangeDT: '2023-05-26T09:13:20.7005285',
  nodes: [],
  changes: null,
  createdDT: '2023-05-26T09:13:20.7005285',
  verifyResult: emptyVerifyResult,
};
