import {
  RunBookActionTriggerDtoCommandEnum,
  RunbookSteps,
  RunbookStepsStateEnum,
} from '@data-contracts/backend/data-contracts';
import { Check, Circle, CircleAlert } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, Spinner, cx, useConfirm, Icon } from '@sk-web-gui/react';

export const MessageStatusIcon = ({
  status,
  className = '',
}: {
  status: RunbookStepsStateEnum;
  className?: string;
}) => {
  switch (status) {
    case RunbookStepsStateEnum.Queued:
      return <Icon color="info" className={className} icon={<Circle />} />;
    case RunbookStepsStateEnum.Waiting:
      return <Icon color="warning" className={className} icon={<CircleAlert />} />;
    case RunbookStepsStateEnum.Running:
      return <Spinner color="info" size={1.5} className={className} />;
    case RunbookStepsStateEnum.Completed:
      return <Icon color="success" className={className} icon={<Check />} />;
    case RunbookStepsStateEnum.Fail:
      return <Icon color="error" className={className} icon={<CircleAlert />} />;

    default:
      return <></>;
  }
};

export const ExportMessages = ({ className = '' }) => {
  const runbook = useOrgChangeStore((s) => s.runbook);
  const triggerDraft = useOrgChangeStore((s) => s.triggerDraft);
  const lockedView = useOrgChangeStore((s) => s.lockedView);

  const { showConfirmation } = useConfirm();

  if (!runbook) return <></>;

  let messages = runbook.runner;
  if (!lockedView) {
    messages = [runbook.currentStep === 0 ? messages[0] : messages[runbook.currentStep - 1]];
  }

  const handleTrigger = async (runbookStep: RunbookSteps) => {
    const shouldContinue = await showConfirmation(
      'Fortsätt exportera',
      'Är du säker på att du vill fortsätta med exporteringen?'
    );
    if (!shouldContinue) return;

    await triggerDraft(runbookStep.waitingForTrigger as unknown as RunBookActionTriggerDtoCommandEnum);
  };

  return (
    <ul className="flex flex-col gap-8">
      {messages.map((runbookStep, i) => {
        const current = messages.length === 1 || runbook.currentStep === i + 1;
        const showTrigger = runbookStep.isWaitAction && runbookStep.state === RunbookStepsStateEnum.Waiting && current;
        return (
          <li
            className={cx(
              'flex gap-sm',
              showTrigger ? 'items-start' : 'items-center',
              current && 'font-bold',
              className
            )}
            key={`message-${i}`}
            data-key={`message-${i}`}
          >
            <MessageStatusIcon status={runbookStep.state} />
            {showTrigger ?
              <div className="flex flex-col items-start gap-8">
                <div>{runbookStep.result || runbookStep.description}</div>
                <Button onClick={() => handleTrigger(runbookStep)} variant="primary" color="primary">
                  {runbookStep.triggerBtnText ? runbookStep.triggerBtnText : 'Fortsätt med exporten'}
                </Button>
              </div>
            : <div>{runbookStep.result || runbookStep.description}</div>}
          </li>
        );
      })}
    </ul>
  );
};

export default ExportMessages;
