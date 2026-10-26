import {
  Draft,
  DraftPhaseEnum,
  RunBookActionTriggerDtoCommandEnum,
  RunbookStepsActionEnum,
  RunbookStepsStateEnum,
} from '@data-contracts/backend/data-contracts';
import { CircleAlert } from 'lucide-react';
import { draftListEntry, useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, useConfirm } from '@sk-web-gui/react';
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
      <Button size="sm" variant="secondary" color="warning" rightIcon={<CircleAlert />} onClick={handleCloseNodes}>
        Slutför stängning av grenar
      </Button>
    );
  }

  if (phaseRunbookStep) {
    return <span className="text-small">{phaseRunbookStep.result || phaseRunbookStep.description}</span>;
  }
  return <></>;
}
