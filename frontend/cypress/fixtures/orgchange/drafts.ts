import {
  Draft,
  DraftPhaseEnum,
  RunbookStepsActionEnum,
  RunbookStepsStateEnum,
  RunbookStepsWaitingForTriggerEnum,
} from '../../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../../src/services/api-service';
import { emptyVerifyResult } from './emptyVerifyResult';
import { nodes } from './nodes';

export const drafts: ApiResponse<Draft[]> = {
  data: [
    {
      companyName: 'Sundvalls kommun',
      draftId: 'id-hash-1',
      name: 'Draftname',
      description: null,
      companyId: 1,
      cutOffDate: '2999-07-01',
      phase: DraftPhaseEnum.DRAFT,
      phaseChangeDT: new Date().toISOString(),
      verifyResult: emptyVerifyResult,
      nodes: nodes,
      changes: 3,
      createdDT: new Date().toISOString(),
    },
    {
      companyName: 'Sundvalls kommun',
      draftId: 'id-hash-2',
      name: 'Draftname2',
      description: null,
      companyId: 1,
      cutOffDate: '2999-07-01',
      phase: DraftPhaseEnum.DRAFT,
      phaseChangeDT: new Date().toISOString(),
      verifyResult: emptyVerifyResult,
      nodes: nodes,
      changes: 3,
      createdDT: new Date().toISOString(),
    },
    {
      companyName: 'Sundvalls kommun',
      draftId: 'id-hash-3',
      name: 'Draftname-approved',
      description: null,
      companyId: 1,
      cutOffDate: '2999-07-01',
      phase: DraftPhaseEnum.APPROVED,
      phaseChangeDT: new Date().toISOString(),
      verifyResult: emptyVerifyResult,
      nodes: nodes,
      changes: 3,
      createdDT: new Date().toISOString(),
    },
    {
      companyName: 'Sundvalls kommun',
      draftId: 'id-hash-4',
      name: 'Draftname-export-close-nodes',
      description: null,
      companyId: 1,
      cutOffDate: '2999-07-01',
      phase: DraftPhaseEnum.EXPORT,
      phaseChangeDT: new Date().toISOString(),
      verifyResult: emptyVerifyResult,
      runbook: {
        runbookId: 1,
        currentStep: 1,
        runner: [
          {
            stepNo: 1,
            action: RunbookStepsActionEnum.StartHRStep3,
            state: RunbookStepsStateEnum.Waiting,
            result: 'string',
            isWaitAction: true,
            triggerBtnText: 'string',
            description: 'string',
            waitingForTrigger: RunbookStepsWaitingForTriggerEnum.STARTHRStep3,
            emailRecipient: 'string',
            reminderIntervalHours: 0,
            firstReminderDT: '2024-04-16T07:36:21.049Z',
            latestReminderDT: '2024-04-16T07:36:21.049Z',
          },
        ],
      },
      nodes: nodes,
      changes: 3,
      createdDT: new Date().toISOString(),
      isArchived: true,
    },
    {
      companyName: 'Sundvalls kommun',
      draftId: 'id-hash-5',
      name: 'Draftname-export-done',
      description: null,
      companyId: 1,
      cutOffDate: '2999-07-01',
      phase: DraftPhaseEnum.DONE,
      phaseChangeDT: new Date().toISOString(),
      verifyResult: emptyVerifyResult,
      nodes: nodes,
      changes: 3,
      createdDT: '2021-05-26T09:13:20.7005285',
      isArchived: true,
    },
  ],
  message: 'success',
};
