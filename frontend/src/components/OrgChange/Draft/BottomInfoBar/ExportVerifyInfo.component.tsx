import { CircleAlert, CircleCheck } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, Link, Icon } from '@sk-web-gui/react';
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
      <div className={`bg-opacity-75 ${!showResults ? 'min-h-md' : ' min-h-100'} duration-300 ${severityBackground}`}>
        <div className="max-width-content transition-all mx-auto flex flex-col-reverse lg:flex-row w-full">
          <h2 className="sr-only">Verifikationsresultat</h2>
          <div className="flex flex-col flex-grow gap-md p-md">
            {verifyHasErrors ?
              <>
                <span>
                  <Icon color="error" className="mr-sm" icon={<CircleAlert />} />
                  {`Senaste verifiering hittade fel..${needsNewVerify ? ' (Ny verifiering rekommenderas)' : ''}`}
                </span>
                {showResults && <div className="ml-[2em]">{draft.verifyResult && <VerifyResult />}</div>}
              </>
            : <span>
                <Icon color="success" className="mr-sm" icon={<CircleCheck />} />
                {`Senaste verifiering hittade inga fel${needsNewVerify ? ' (Ny verifiering rekommenderas)' : ''}`}
              </span>
            }
          </div>
          {verifyHasErrors && (
            <Button
              onClick={handleExpand}
              size="lg"
              aria-label={
                showResults ?
                  'Dölj verifikationsresultat, lås upp visningsläge av utkastet'
                : 'Visa verifikationsresultat, lås visningsläge av utkastet'
              }
              variant="ghost"
              className="px-0 max-h-fit h-fit py-md"
            >
              {showResults ?
                <Link as="span">Dölj verifikationsresultat</Link>
              : <Link as="span">Visa verifikationsresultat</Link>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
