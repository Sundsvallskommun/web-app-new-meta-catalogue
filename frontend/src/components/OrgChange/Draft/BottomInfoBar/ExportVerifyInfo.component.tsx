import { CircleAlert, CircleCheck } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, Icon } from '@sk-web-gui/react';
import useVerifyState from '@utils/use-verify-state';
import { useEffect, useState } from 'react';
import VerifyResult from './VerifyResults.component';

export default function ExportVerifyInfo() {
  const draft = useOrgChangeStore((s) => s.draft);
  const { verifyHasErrors, needsNewVerify } = useVerifyState();
  const [showResults, setShowResults] = useState(verifyHasErrors);

  let severityBackground = 'bg-info-background-200';
  if (verifyHasErrors) {
    severityBackground = 'bg-error-background-200';
  }
  if (!verifyHasErrors) {
    severityBackground = 'bg-success-background-200';
  }

  if (needsNewVerify) {
    severityBackground = 'bg-warning-background-200';
  }

  const handleExpand = () => {
    setShowResults((open) => !open);
  };

  useEffect(() => {
    setShowResults(verifyHasErrors);
  }, [verifyHasErrors]);

  return (
    <div className="relative flex flex-col justify-end">
      <div
        className={`bg-opacity-75 ${!showResults ? 'min-h-md' : ' min-h-100'} duration-300 px-md md:px-lg ${severityBackground}`}
      >
        <div className="container transition-all flex flex-col-reverse lg:flex-row gap-md py-md">
          <h2 className="sr-only">Verifikationsresultat</h2>
          <div className="flex flex-col flex-grow gap-md">
            {verifyHasErrors ?
              <>
                <span className="flex items-center gap-sm min-h-32">
                  <Icon color="error" icon={<CircleAlert />} />
                  {`Senaste verifiering hittade fel${needsNewVerify ? ' (Ny verifiering rekommenderas)' : ''}`}
                </span>
                {showResults && <div className="ml-[2em]">{draft.verifyResult && <VerifyResult />}</div>}
              </>
            : <span className="flex items-center gap-sm min-h-32">
                <Icon color="success" icon={<CircleCheck />} />
                {`Senaste verifiering hittade inga fel${needsNewVerify ? ' (Ny verifiering rekommenderas)' : ''}`}
              </span>
            }
          </div>
          {verifyHasErrors && (
            <div className="shrink-0">
              <Button
                onClick={handleExpand}
                size="sm"
                aria-label={
                  showResults ?
                    'Dölj verifikationsresultat, lås upp visningsläge av utkastet'
                  : 'Visa verifikationsresultat, lås visningsläge av utkastet'
                }
                variant="tertiary"
              >
                {showResults ? 'Dölj verifikationsresultat' : 'Visa verifikationsresultat'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
