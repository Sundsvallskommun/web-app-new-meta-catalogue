import { OrgnodeCreateDto } from '@data-contracts/backend/data-contracts';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, useConfirm, useMessage } from '@sk-web-gui/react';

export default function CreateNewBranchFormModal() {
  const { showConfirmation } = useConfirm();
  const createNode = useOrgChangeStore((s) => s.createNode);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const draft = useOrgChangeStore((s) => s.draft);
  const organization = useOrganizationStore((s) => s.organization);
  const setIsSaving = useSaveStore((s) => s.setIsSaving);
  const message = useMessage();

  const CallCreateBranch = () => {
    const dataBody: OrgnodeCreateDto = {
      name: 'Ny gren',
      abbreviation: '',
      shortName: 'Ny gren',
      parentId: organization.id,
    };
    setIsSaving(true);
    createNode(dataBody).then((res) => {
      if (!res.error) {
        message({
          message: `Ny gren nivå ${organization.level + 1} läggs till under ${organization.orgName} nivå ${
            organization.level
          }`,
          status: 'success',
        });
        setSelectedOrganizationId(res.data);
      } else {
        message({
          message: res.message,
          status: 'error',
        });
      }
      setIsSaving(false);
    });
  };

  const NodeOnSubmit = () => {
    const title = `Skapa ny gren nivå ${organization.level + 1}`;
    const message = `En ny gren nivå ${organization.level + 1} kommer att skapas under ${organization.orgName} nivå ${
      organization.level
    }`;
    showConfirmation(title, message, 'Ja skapa gren', 'Avbryt', undefined, undefined, 'h2').then((result) => {
      if (result) {
        CallCreateBranch();
      }
    });
  };

  return (
    <Button
      role="menuitem"
      aria-haspopup="true"
      data-cy="orgchange-sidemenu-createnode"
      onClick={!draft.draftId || !organization?.id ? undefined : NodeOnSubmit}
      aria-disabled={!draft.draftId || !organization?.id ? 'true' : undefined}
      variant="link"
      className="flex text-white hover:text-white hover:no-underline focus-visible:ring-white"
      leftIcon={<NoteAddOutlinedIcon className="!text-2xl !mr-[4px]" />}
    >
      Skapa ny gren
    </Button>
  );
}
