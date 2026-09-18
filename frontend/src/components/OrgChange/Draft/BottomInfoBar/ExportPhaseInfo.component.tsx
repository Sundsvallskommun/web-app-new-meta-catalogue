import { RunbookStepsStateEnum } from '@data-contracts/backend/data-contracts';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, Link, useMessage } from '@sk-web-gui/react';
import { useEffect } from 'react';
import ExportMessages from './ExportMessages.component';
import { repeater } from '@utils/repeater';

const runbookIntervals = {};
export default function ExportPhaseInfo() {
  const lockedView = useOrgChangeStore((s) => s.lockedView);
  const setLockedView = useOrgChangeStore((s) => s.setLockedView);
  const getRunbook = useOrgChangeStore((s) => s.getRunbook);
  const runbook = useOrgChangeStore((s) => s.runbook);
  const message = useMessage();

  let severityBackground = 'bg-info-light';
  if (runbook?.currentStep > 0) {
    if (runbook?.runner[runbook.currentStep - 1].state === RunbookStepsStateEnum.Completed) {
      severityBackground = 'bg-success-light';
    }
    if (runbook?.runner[runbook.currentStep - 1].state === RunbookStepsStateEnum.Waiting) {
      severityBackground = 'bg-warning-light';
    }
    if (runbook?.runner[runbook.currentStep - 1].state === RunbookStepsStateEnum.Fail) {
      severityBackground = 'bg-error-light';
    }
  }

  const handleExpand = () => {
    setLockedView((lockedView) => !lockedView);
  };

  const updateRunBook = async () => {
    // get initial runbook
    await getRunbook().catch((e) => {
      message({
        message: `Det gick inte att hämta exportstatus: ${e.message}`,
        status: 'error',
      });
    });
    // update runbook every 5 seconds 2 times
    runbookIntervals['short'] = await repeater(getRunbook, 2, 5000);
    // update every 5 minutes for 30 mins (6 times)
    runbookIntervals['long'] = await repeater(getRunbook, 2, 5 * 60 * 1000 * 6);
  };

  useEffect(() => {
    updateRunBook();
    return () => {
      if (runbookIntervals['short'] && runbookIntervals['long']) {
        clearInterval(runbookIntervals['short']);
        clearInterval(runbookIntervals['long']);
        runbookIntervals['short'] = null;
        runbookIntervals['long'] = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runbook?.currentStep]);

  return (
    <div className="relative flex flex-col justify-end">
      <div
        className={`transition-height bg-opacity-75 ${
          !lockedView ? 'min-h-md' : ' min-h-40'
        } duration-300 ${severityBackground}`}
      >
        <div className="max-width-content transition-all mx-auto flex flex-col-reverse lg:flex-row w-full">
          <h2 className="sr-only">Exportflöde</h2>
          <div className="flex flex-grow gap-md p-md">
            <span>
              <ExportMessages />
            </span>
          </div>
          <Button
            onClick={handleExpand}
            size="lg"
            aria-label={
              lockedView ?
                'Dölj exportinformation, lås upp visningsläge av utkastet'
              : 'Visa exportinformation, lås visningsläge av utkastet'
            }
            variant="ghost"
            className="px-0 max-h-fit h-fit py-md"
          >
            {lockedView ?
              <Link as="span">Dölj exportinformation</Link>
            : <Link as="span">Visa exportinformation</Link>}
          </Button>
        </div>
      </div>
    </div>
  );
}
