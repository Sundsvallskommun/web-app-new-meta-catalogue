import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Organization, OrgnodeAddDto } from '@data-contracts/backend/data-contracts';
import { useSaveStore } from '@services/save-service/save-service';
import { Combobox } from '@sk-web-gui/forms';
import { Button, FormLabel, Modal, useMessage } from '@sk-web-gui/react';
import { useState } from 'react';

export default function ChooseBranchToChangeModal(props) {
  const { onClose } = props;
  const addExistingNodeToTree = useOrgChangeStore((s) => s.addExistingNodeToTree);
  const draft = useOrgChangeStore((s) => s.draft);
  const companyOrganizations = useOrganizationStore((s) => s.companyOrganizations);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const setIsSaving = useSaveStore((s) => s.setIsSaving);
  const [activeOrganization, setActiveOrganization] = useState<{ label: string; data: Organization } | undefined>();

  const message = useMessage();

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
    <Modal labelAs="h2" className="max-w-[800px]" show={true} onClose={onClose} label={'Välj gren att ändra'}>
      <div>
        <div className="pb-md">
          <span>Bolag: {draft && draft.companyName}</span>
        </div>

        <FormLabel id="choosebranch">
          <strong>Gren</strong>
        </FormLabel>
        <Combobox
          data-cy="orgchange-choosebranch-searchnode"
          className="w-full"
          id="orgchange-choosebranch-searchnode"
          aria-labelledby="choosebranch"
          placeholder="Välj gren"
          onChange={onOrganizationSelectHandler}
          value={activeOrganization?.data?.id?.toString() ?? undefined}
          defaultValue={activeOrganization?.data?.id?.toString() ?? undefined}
        >
          <Combobox.List>
            {companyOrganizations.map((item, index) => (
              <Combobox.Option key={`item-${index}`} value={item.id.toString()}>
                {`${item.label.trim()} - ${item.level === 2 ? 'Förvaltning' : `Nivå ${item.level}`}`}
              </Combobox.Option>
            ))}
          </Combobox.List>
        </Combobox>
        <div className="mt-16 flex flex-col sm:flex-row sm:grid sm:grid-cols-2 sm:gap-10">
          <Button variant="solid" size="lg" className="my-sm sm:my-6 w-full" type="button" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            variant="solid"
            onClick={onChooseOrganization}
            size="lg"
            color="primary"
            className="my-sm sm:my-6 w-full"
            loadingText="Sparar"
            type="button"
          >
            Spara
          </Button>
        </div>
      </div>
    </Modal>
  );
}
