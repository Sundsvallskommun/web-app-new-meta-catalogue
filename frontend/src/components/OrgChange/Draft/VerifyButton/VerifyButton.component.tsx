import ShieldIcon from '@mui/icons-material/Shield';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import useVerifyState from '@utils/use-verify-state';

export default function VerifyButton() {
  const runVerify = useOrgChangeStore((s) => s.runVerify);
  const draft = useOrgChangeStore((s) => s.draft);
  const { verifyHasErrors, needsNewVerify } = useVerifyState();
  const { draftIsExportPhase, draftIsApproved } = useDraftPhaseState();

  const handleOnVerify = async () => {
    await runVerify();
  };

  let shieldColor = 'text-info';
  let title = '';
  if (draft.changes === 0) {
    shieldColor = 'text-success';
    title = `Inga ändringar gjorda`;
  } else if (verifyHasErrors) {
    shieldColor = 'text-error';
    title = `${draft.verifyResult?.numberOfValidationErrors} fel i utkastet hittades`;
  } else if (!verifyHasErrors) {
    shieldColor = 'text-success';
    title = `Inga fel i utkastet hittades`;
  }

  if (needsNewVerify) {
    shieldColor = 'text-warning';
    title = `${title ? `${title}, ` : ''}Ny verifiering rekommenderas`;
  }

  if (draft.changes === 0 || draft.changes === null || draftIsExportPhase || draftIsApproved) return <></>;

  return (
    <Button
      disabled={draft.changes === 0}
      className="bg-white text-[#4b4b4b]"
      onClick={handleOnVerify}
      leftIcon={<ShieldIcon className={shieldColor} />}
      title={title && title}
    >
      Verifiera utkastet
    </Button>
  );
}
