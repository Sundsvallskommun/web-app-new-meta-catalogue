import { RunbookStepsStateEnum } from '@data-contracts/backend/data-contracts';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, useSnackbar } from '@sk-web-gui/react';
import { useEffect } from 'react';
import ExportMessages from './ExportMessages.component';
import { repeater } from '@utils/repeater';

const runbookIntervals = {};
export default function ExportPhaseInfo() {
  const lockedView = useOrgChangeStore((s) => s.lockedView);
  const setLockedView = useOrgChangeStore((s) => s.setLockedView);
  const getRunbook = useOrgChangeStore((s) => s.getRunbook);
  const runbook = useOrgChangeStore((s) => s.runbook);
  const message = useSnackbar();

  let severityBackground = 'bg-vattjom-background-100';
  if (runbook?.currentStep > 0) {
    const state = runbook.runner[runbook.currentStep - 1].state;
    if (state === RunbookStepsStateEnum.Completed) {
      severityBackground = 'bg-gronsta-background-100';
    }
    if (state === RunbookStepsStateEnum.Waiting) {
      severityBackground = 'bg-warning-background-100';
    }
    if (state === RunbookStepsStateEnum.Fail) {
      severityBackground = 'bg-error-background-100';
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
    <div className={`px-md md:px-lg ${severityBackground}`}>
      <div className="container flex flex-col-reverse lg:flex-row gap-md py-md">
        <h2 className="sr-only">Exportflöde</h2>
        <div className="flex flex-col flex-grow justify-center min-h-32">
          <ExportMessages />
        </div>
        <div className="shrink-0">
          <Button
            onClick={handleExpand}
            size="sm"
            aria-label={
              lockedView ?
                'Dölj exportinformation, lås upp visningsläge av utkastet'
              : 'Visa exportinformation, lås visningsläge av utkastet'
            }
            variant="tertiary"
          >
            {lockedView ? 'Dölj exportinformation' : 'Visa exportinformation'}
          </Button>
        </div>
      </div>
    </div>
  );
}
