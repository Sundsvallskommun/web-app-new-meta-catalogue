import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { X } from 'lucide-react';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, useConfirm, useSnackbar } from '@sk-web-gui/react';

interface IRemoveBranchProps {
  organization: OrgChangeOrganizationTree;
}

export default function RemoveBranchFromDraft(props: IRemoveBranchProps) {
  const { organization } = props;
  const { showConfirmation } = useConfirm();
  const removeNodeFromDraft = useOrgChangeStore((s) => s.removeNodeFromDraft);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const setIsSaving = useSaveStore((s) => s.setIsSaving);
  const message = useSnackbar();

  const CallRemoveFromDraft = () => {
    setIsSaving(true);
    removeNodeFromDraft(organization.id).then((res) => {
      if (!res.error) {
        message({
          message: `Grenen uteslöts från utkastet`,
          status: 'success',
        });
        setSelectedOrganizationId(organization.parentId);
      } else {
        message({
          message: res.message,
          status: 'error',
        });
      }
      setIsSaving(false);
    });
  };

  const onRemoveBranchFromDraft = () => {
    const title = 'Är du säker på att du vill utesluta grenen från utkastet?';
    const message = `Gren ${organization.orgName} kommer att uteslutas från utkastet${
      !organization.isLeafLevel ? ' samt dess underliggande grenstruktur' : ''
    }. Alla förändringar som berör grenen kommer att försvinna.`;
    showConfirmation(title, message, 'Ja, uteslut', 'Avbryt').then((result) => {
      if (result === true) {
        CallRemoveFromDraft();
      }
    });
  };

  return (
    <Button
      aria-haspopup="true"
      onClick={onRemoveBranchFromDraft}
      className="text-base text-red"
      variant="link"
      type="button"
      leftIcon={<X />}
    >
      Uteslut gren från utkast
    </Button>
  );
}
