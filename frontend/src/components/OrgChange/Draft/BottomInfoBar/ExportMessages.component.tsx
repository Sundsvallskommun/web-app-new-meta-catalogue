import {
  RunBookActionTriggerDtoCommandEnum,
  RunbookSteps,
  RunbookStepsStateEnum,
} from '@data-contracts/backend/data-contracts';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import ErrorIcon from '@mui/icons-material/Error';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, Spinner, cx, useConfirm } from '@sk-web-gui/react';

export const MessageStatusIcon = ({
  status,
  className = '',
}: {
  status: RunbookStepsStateEnum;
  className?: string;
}) => {
  switch (status) {
    case RunbookStepsStateEnum.Queued:
      return <CircleIcon className={`text-info p-2 w-[1rem] h-[1rem] ${className}`} />;
    case RunbookStepsStateEnum.Waiting:
      return <ErrorIcon className={`text-warning w-[1.5rem] h-[1.5rem] ${className}`} />;
    case RunbookStepsStateEnum.Running:
      return <Spinner className={`text-info w-[1.5rem] h-[1.5rem] ${className}`} />;
    case RunbookStepsStateEnum.Completed:
      return <CheckIcon className={`text-success w-[1.5rem] h-[1.5rem] ${className}`} />;
    case RunbookStepsStateEnum.Fail:
      return <ErrorIcon className={`text-error w-[1.5rem] h-[1.5rem] ${className}`} />;

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
    <ul>
      {messages.map((runbookStep, i) => {
        const current = messages.length === 1 || runbook.currentStep === i + 1;
        return (
          <li
            className={cx('flex gap-sm', current && 'font-bold text-lg my-[.5em]', className)}
            key={`message-${i}`}
            data-key={`message-${i}`}
          >
            <MessageStatusIcon
              className={cx(current ? 'mt-[.2rem] !text-xl' : 'mt-[.4rem]')}
              status={runbookStep.state}
            />
            {runbookStep.isWaitAction && runbookStep.state === RunbookStepsStateEnum.Waiting && current ?
              <div>
                <div>{runbookStep.result || runbookStep.description}</div>
                <Button className="my-sm" onClick={() => handleTrigger(runbookStep)} variant="solid" color="primary">
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
