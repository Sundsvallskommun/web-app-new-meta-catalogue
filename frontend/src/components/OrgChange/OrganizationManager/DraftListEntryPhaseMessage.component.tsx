import {
  Draft,
  DraftPhaseEnum,
  RunBookActionTriggerDtoCommandEnum,
  RunbookStepsActionEnum,
  RunbookStepsStateEnum,
} from '@data-contracts/backend/data-contracts';
import ErrorIcon from '@mui/icons-material/Error';
import { draftListEntry, useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, cx, useConfirm } from '@sk-web-gui/react';
import { MessageStatusIcon } from '../Draft/BottomInfoBar/ExportMessages.component';
import { useUserStore } from '@services/user-service/user-service';

export default function DraftListEntryPhaseMessage({ draft }: { draft: Draft }) {
  const triggerDraft = useOrgChangeStore((s) => s.triggerDraft);
  const getDrafts = useOrgChangeStore((s) => s.getDrafts);
  const user = useUserStore((s) => s.user);

  const { phaseRunbookStep } = draftListEntry(draft);
  const { showConfirmation } = useConfirm();

  if (draft.phase !== DraftPhaseEnum.EXPORT || phaseRunbookStep === null) return <></>;

  if (
    user.permissions.canEditDrafts &&
    phaseRunbookStep.state === RunbookStepsStateEnum.Waiting &&
    phaseRunbookStep.action === RunbookStepsActionEnum.StartHRStep3
  ) {
    const handleCloseNodes = async () => {
      const shouldContinue = await showConfirmation(
        'Fortsätt exportera',
        'Är du säker på att du vill fortsätta med exporteringen?'
      );
      if (!shouldContinue) return;

      const res = await triggerDraft(RunBookActionTriggerDtoCommandEnum.STARTHRStep3, draft.draftId);
      if (!res.error) {
        getDrafts();
      }
    };
    return (
      <Button
        size="sm"
        variant="outline"
        className="bg-white text-body [&>.btn-has-icon-right]:text-warning [&:hover>.btn-has-icon-right]:text-white"
        rightIcon={<ErrorIcon />}
        onClick={handleCloseNodes}
      >
        <span>Slutför stängning av grenar</span>
      </Button>
    );
  }

  if (phaseRunbookStep) {
    return (
      <span className={`flex items-center space-x-[1rem]`}>
        <span
          className={cx(
            `inline-flex text-xs leading-[1.6rem] max-w-[20rem]`,
            phaseRunbookStep.state === RunbookStepsStateEnum.Queued && 'text-primary',
            phaseRunbookStep.state === RunbookStepsStateEnum.Running && 'text-primary',
            phaseRunbookStep.state === RunbookStepsStateEnum.Waiting && 'text-warning',
            phaseRunbookStep.state === RunbookStepsStateEnum.Completed && 'text-success',
            phaseRunbookStep.state === RunbookStepsStateEnum.Fail && 'text-error'
          )}
        >
          {phaseRunbookStep.result || phaseRunbookStep.description}
        </span>
        <span className="inline-flex">
          <MessageStatusIcon className="!text-xl" status={phaseRunbookStep.state} />
        </span>
      </span>
    );
  }
  return <></>;
}
