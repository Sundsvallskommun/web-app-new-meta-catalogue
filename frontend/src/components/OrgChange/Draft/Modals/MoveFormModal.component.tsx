import { OrgnodeMoveDto } from '@data-contracts/backend/data-contracts';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { DraftTreeOrganization } from '@interfaces/orgchange';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, FormControl, FormLabel, Modal, useConfirm, useSnackbar, Combobox } from '@sk-web-gui/react';
import { OptionValueType } from '@interfaces/option-value';
import { useEffect } from 'react';

interface IMoveFormProps {
  onClose;
  moveBranch;
  organization;
  buttonName: string;
  activeOrganization: OptionValueType<DraftTreeOrganization>;
  setActiveOrganization: React.Dispatch<React.SetStateAction<OptionValueType<DraftTreeOrganization>>>;
}
export default function MoveFormModal(props: IMoveFormProps) {
  const { onClose, moveBranch, organization, buttonName, activeOrganization, setActiveOrganization } = props;
  const { showConfirmation } = useConfirm();

  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const { moveNode } = useOrgChangeStore();
  const orgTreeOrganizations = useOrgChangeStore((s) => s.orgTreeOrganizations);

  const onOrganizationSelectHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    const value = orgTreeOrganizations.find((x) => x.id.toString() === val);
    if (!value) return;
    setActiveOrganization({
      label: value.label,
      data: value,
    });
  };

  const setIsSaving = useSaveStore((s) => s.setIsSaving);

  const message = useSnackbar();

  const onChooseOrganization = () => {
    let title, message, confirmLabel;
    if (moveBranch) {
      title = 'Är du säker på att flytta grenen?';
      message = `Gren ${organization.orgName} kommer att flyttas och placeras under ${activeOrganization?.data.orgName}.`;
      confirmLabel = 'Ja, flytta gren';
    }
    showConfirmation(title, message, confirmLabel, 'Avbryt').then((result) => {
      if (result === true) {
        onSubmit();
      }
    });
  };

  const onSubmit = () => {
    setSelectedOrganizationId(organization.id);
    const moveBranchBody: OrgnodeMoveDto = {
      orgId: organization.id,
      newParentId: activeOrganization.data.id,
    };
    setIsSaving(true);
    if (moveBranch) {
      moveNode(moveBranchBody).then((res) => {
        if (!res.error) {
          message({
            message: `Grenen flyttas från ${organization.label} nivå ${organization.level} till ${activeOrganization.data.label} nivå ${activeOrganization.data.level}`,
            status: 'success',
          });
          setSelectedOrganizationId(organization.id);
        } else {
          message({
            message: res.message,
            status: 'error',
          });
        }
        setIsSaving(false);
        onClose();
      });
    }
  };

  const moveFilterFunction = (x) => {
    if (moveBranch) {
      if (x.id !== organization.id && x.level === organization.level - 1) return true;
    }
    return false;
  };

  useEffect(() => {
    return () => {
      setActiveOrganization(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal className="max-w-[800px]" show onClose={onClose} label={moveBranch && 'Flytta gren'}>
      <div className="flex flex-col gap-16">
        <FormControl id="orgchange-move-branch" className="w-full">
          <FormLabel>{moveBranch && 'Flytta gren under'}</FormLabel>
          <Combobox
            className="w-full"
            id="orgchange-move-branch"
            onChange={onOrganizationSelectHandler}
            value={activeOrganization?.data?.id?.toString() ?? undefined}
            defaultValue={activeOrganization?.data?.id.toString() ?? undefined}
          >
            <Combobox.Input className="w-full" placeholder="Sök och välj" />
            <Combobox.List>
              {orgTreeOrganizations.filter(moveFilterFunction).map((item, index) => (
                <Combobox.Option key={`item-${index}`} value={item.id.toString()}>
                  {`${item.label.trim()} Nivå ${item.level.toString().trim()}${
                    item.orgFromName ? ` under ${item.orgFromName?.trim()}` : ''
                  }`}
                </Combobox.Option>
              ))}
            </Combobox.List>
          </Combobox>
        </FormControl>
      </div>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={onClose}>
          Avbryt
        </Button>
        <Button
          className="ml-auto"
          variant="primary"
          color="primary"
          loadingText="Sparar"
          type="button"
          disabled={!activeOrganization}
          onClick={onChooseOrganization}
        >
          {buttonName}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
