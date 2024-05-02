import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, useConfirm, useMessage } from '@sk-web-gui/react';

interface IRemoveBranchProps {
  organization: OrgChangeOrganizationTree;
}

export default function RemoveBranchFromDraft(props: IRemoveBranchProps) {
  const { organization } = props;
  const { showConfirmation } = useConfirm();
  const removeNodeFromDraft = useOrgChangeStore((s) => s.removeNodeFromDraft);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const setIsSaving = useSaveStore((s) => s.setIsSaving);
  const message = useMessage();

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
      result === true && CallRemoveFromDraft();
    });
  };

  return (
    <Button
      role="menuitem"
      aria-haspopup="true"
      onClick={onRemoveBranchFromDraft}
      className="text-base text-red"
      variant="link"
      type="button"
      leftIcon={<CloseOutlinedIcon className="!text-2xl mr-sm" />}
    >
      Uteslut gren från utkast
    </Button>
  );
}
