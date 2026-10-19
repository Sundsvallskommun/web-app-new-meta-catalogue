import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Organization, OrgnodeAddDto } from '@data-contracts/backend/data-contracts';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, FormControl, FormLabel, Modal, useSnackbar, Combobox } from '@sk-web-gui/react';
import { useState } from 'react';

export default function ChooseBranchToChangeModal(props) {
  const { onClose } = props;
  const addExistingNodeToTree = useOrgChangeStore((s) => s.addExistingNodeToTree);
  const draft = useOrgChangeStore((s) => s.draft);
  const companyOrganizations = useOrganizationStore((s) => s.companyOrganizations);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const setIsSaving = useSaveStore((s) => s.setIsSaving);
  const [activeOrganization, setActiveOrganization] = useState<{ label: string; data: Organization } | undefined>();

  const message = useSnackbar();

  const onOrganizationSelectHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    const value = companyOrganizations.find((x) => x.id.toString() === val);
    if (!value) return;
    setActiveOrganization({
      label: value.label,
      data: value,
    });
  };

  const onChooseOrganization = () => {
    const dataBody: OrgnodeAddDto = {
      ...activeOrganization.data,
      orgId: activeOrganization.data.id,
      draftId: draft.draftId,
    };
    setIsSaving(true);
    addExistingNodeToTree(dataBody).then((res) => {
      if (!res.error) {
        onClose();
        message({
          message: `Grenen valdes`,
          status: 'success',
        });
        setSelectedOrganizationId(activeOrganization.data.id);
      } else {
        message({
          message: res.message,
          status: 'error',
        });
      }
      setIsSaving(false);
    });
  };

  return (
    <Modal className="max-w-[800px]" show={true} onClose={onClose} label={'Välj gren att ändra'}>
      <div className="flex flex-col gap-16">
        <p className="text-small text-dark-secondary">Bolag: {draft && draft.companyName}</p>
        <FormControl id="orgchange-choosebranch-searchnode" className="w-full">
          <FormLabel>Gren</FormLabel>
          <Combobox
            className="w-full"
            id="orgchange-choosebranch-searchnode"
            onChange={onOrganizationSelectHandler}
            value={activeOrganization?.data?.id?.toString() ?? undefined}
            defaultValue={activeOrganization?.data?.id?.toString() ?? undefined}
          >
            <Combobox.Input
              data-cy="orgchange-choosebranch-searchnode"
              className="w-full"
              placeholder="Sök och välj gren med namn, förkortning, tillhörande ansvarskod..."
            />
            <Combobox.List>
              {companyOrganizations.map((item, index) => (
                <Combobox.Option key={`item-${index}`} value={item.id.toString()}>
                  {`${item.label.trim()} ${
                    item.concatAbbreviation || item.abbreviation ?
                      `(${item.concatAbbreviation ? `${item.concatAbbreviation}` : ''}${
                        item.abbreviation ?
                          item.concatAbbreviation ?
                            ` ${item.abbreviation}`
                          : `${item.abbreviation}`
                        : ''
                      })`
                    : ''
                  } - ${item.level === 2 ? 'Förvaltning' : `Nivå ${item.level}`} `}
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
          onClick={onChooseOrganization}
          color="primary"
          loadingText="Sparar"
          type="button"
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
