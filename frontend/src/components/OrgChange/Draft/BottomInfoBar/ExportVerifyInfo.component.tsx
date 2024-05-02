import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, Link } from '@sk-web-gui/react';
import useVerifyState from '@utils/use-verify-state';
import { useEffect, useState } from 'react';
import VerifyResult from './VerifyResults.component';

export default function ExportVerifyInfo() {
  const draft = useOrgChangeStore((s) => s.draft);
  const { verifyHasErrors, needsNewVerify } = useVerifyState();
  const [showResults, setShowResults] = useState(verifyHasErrors);

  let severityBackground = 'bg-info-light';
  if (verifyHasErrors) {
    severityBackground = 'bg-error-light';
  }
  if (!verifyHasErrors) {
    severityBackground = 'bg-success-light';
  }

  if (needsNewVerify) {
    severityBackground = 'bg-warning-light';
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
        className={`transition-height bg-opacity-75 ${
          !showResults ? 'min-h-md' : ' min-h-40'
        } duration-300 ${severityBackground}`}
      >
        <div className="max-width-content transition-all mx-auto flex flex-col-reverse lg:flex-row w-full">
          <h2 className="sr-only">Verifikationsresultat</h2>
          <div className="flex flex-col flex-grow gap-md p-md">
            {verifyHasErrors ?
              <>
                <span>
                  <ErrorIcon className="!text-2xl text-error mr-sm" />
                  {`Senaste verifiering hittade fel..${needsNewVerify ? ' (Ny verifiering rekommenderas)' : ''}`}
                </span>
                {showResults && <div className="ml-[2em]">{draft.verifyResult && <VerifyResult />}</div>}
              </>
            : <span>
                <CheckCircleOutlineIcon className="text-success mr-sm !text-2xl" />
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
