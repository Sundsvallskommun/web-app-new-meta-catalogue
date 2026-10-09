import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, useConfirm, useSnackbar } from '@sk-web-gui/react';
import { Undo2 } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';

export default function UndoTerminatedNode() {
  const undoOrgNodeTerminate = useOrgChangeStore((s) => s.undoOrgNodeTerminate);
  const organization = useOrganizationStore((s) => s.organization);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const { showConfirmation } = useConfirm();
  const message = useSnackbar(); //FIX ME: Needs api call function for undo
  const setIsSaving = useSaveStore((s) => s.setIsSaving);

  const onUndoTerminateBranch = () => {
    showConfirmation(
      'Är du säker på att du vill ångra grenens stängning?',
      `Gren ${organization.orgName} kommer att åter vara en befintlig gren`,
      'Ja, ångra',
      'Avbryt'
    ).then((result) => {
      if (result === true) {
        setIsSaving(true);
        undoOrgNodeTerminate(organization.id).then((t) => {
          if (!t.error) {
            message({
              message: `Ändringar på grenen sparas`,
              status: 'success',
            });
          } else {
            message({
              message: `Det gick inte att ångra`,
              status: 'error',
            });
          }

          setIsSaving(false);
          setSelectedOrganizationId(organization.id);
        });
      }
    });
  };

  return (
    <Button
      onClick={onUndoTerminateBranch}
      variant="link"
      leftIcon={<Undo2 />}
      className="text-primary border-primary"
    >
      Ångra stäng gren
    </Button>
  );
}
