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
    <div className="px-md md:px-lg pt-lg">
      <section className="container flex flex-col gap-md p-24 bg-background-content border-1 border-divider rounded-cards">
        <div className="flex flex-wrap items-center justify-between gap-md">
          <h2 className="text-lead">Exportflöde</h2>
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
        <ExportMessages />
      </section>
    </div>
  );
}
