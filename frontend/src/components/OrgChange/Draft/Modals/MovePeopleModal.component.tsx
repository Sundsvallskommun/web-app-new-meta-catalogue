import {
  EmploymentChangeArrayDto,
  OrgChangeOrganizationEmployee,
  OrgChangeOrganizationTree,
} from '@data-contracts/backend/data-contracts';
import { DraftTreeOrganization } from '@interfaces/orgchange';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { changeEmployment } from '@services/mdbuilder/api-calls/employment';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useSaveStore } from '@services/save-service/save-service';
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  useConfirm,
  useSnackbar,
  Combobox,
} from '@sk-web-gui/react';
import { shouldEditEmployees } from '@utils/shouldeditemployees';
import { useState } from 'react';
import { MarkedPeopleList } from './components/MarkedPeopleList.component';

interface IMovePeopleModal {
  peopleToHandle: OrgChangeOrganizationEmployee[];
  closeCallback: () => void;
}

export default function MovePeopleModal(props: IMovePeopleModal) {
  const { peopleToHandle, closeCallback } = props;
  const { showConfirmation } = useConfirm();
  const getEmployeesByOrg = useOrgChangeStore((s) => s.getEmployeesByOrg);
  const terminateNode = useOrgChangeStore((s) => s.terminateNode);
  const employeesByOrg = useOrgChangeStore((s) => s.employeesByOrg);
  const organization = useOrganizationStore((s) => s.organization) as OrgChangeOrganizationTree;
  const orgTreeOrganizations = useOrgChangeStore((s) => s.orgTreeOrganizations);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const setIsSaving = useSaveStore((s) => s.setIsSaving);

  const [newOrganization, setNewOrganization] = useState<DraftTreeOrganization>({
    orgFromName: null,
    nodeChangeId: null,
    id: organization.id,
    label: organization.label,
    level: organization.level,
  });
  const [terminateChecked, setTerminateChecked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isDirty = organization.id === newOrganization.id;
  const message = useSnackbar();

  const onOrganizationSelectHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    const value = orgTreeOrganizations.find((x) => x.id.toString() === val);
    if (!value) return;
    setNewOrganization(value);
  };

  const onHandleChecked = (e) => {
    setTerminateChecked(e.target.checked);
  };

  const handleOnClose = () => {
    setNewOrganization(null);
    closeCallback();
  };

  const onMovePeople = async () => {
    if (isDirty) return false;

    const peopleToChange: EmploymentChangeArrayDto['people'] = [];

    peopleToHandle.forEach((person) => {
      peopleToChange.push({
        personId: person.personId,
        orgId: organization.id,
        newOrgId: newOrganization.id,
      });
    });

    const moveMessage = `flyttas från gren ${organization.label} nivå ${organization.level} till ${newOrganization.label} nivå ${newOrganization.level}`;

    changeEmployment(peopleToChange)
      .then(async () => {
        await setSelectedOrganizationId(newOrganization.id);
        await getEmployeesByOrg(newOrganization.id);
        const { mustEditPaTeam, mustEditOperation } = shouldEditEmployees();
        message({
          message:
            peopleToHandle.length > 1 ?
              `${peopleToHandle.length} personer ${moveMessage}`
            : `${peopleToHandle[0].givenname} ${peopleToHandle[0].lastname} ${moveMessage}`,
          status: 'success',
          duration: 30000,
        });

        message({
          message: `Verksamhet på flyttade personer ${
            mustEditOperation ? 'måste' : 'kan'
          } ändras i Persondetaljer under Personerlistan`,
          status: `${mustEditOperation ? 'error' : 'info'}`,
          duration: 30000,
        });
        message({
          message: `PA-Team på flyttade personer ${
            mustEditPaTeam ? 'måste' : 'kan'
          } ändras i Persondetaljer under Personerlistan`,
          status: `${mustEditPaTeam ? 'error' : 'info'}`,
          duration: 30000,
        });

        closeCallback();
        return true;
      })
      .catch(() => {
        // err
        setErrorMessage('Ett problem uppstod vid flytt av person');
        return false;
      });

    if (terminateChecked) {
      await terminateNode(organization.id)
        .then(() => {
          message({
            message: `Gren ${organization.orgName} (Nivå ${organization.level}) stängas i samband med personalflytt`,
            status: 'success',
          });
          return true;
        })
        .catch(() => {
          // err
          setErrorMessage('Ett problem uppstod vid stängning av gren');
          return false;
        });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showConfirmation(
      `Är du säker på att flytta ${peopleToHandle.length} personer?`,
      `Personerna kommer att flyttas från ${organization.orgName} (Nivå ${organization.level}) till ${newOrganization.label} (Nivå ${newOrganization.level})
        `,
      'Ja, Flytta',
      'Avbryt'
    ).then(async (result) => {
      if (result === true) {
        setIsSaving(true);
        await onMovePeople();
        setIsSaving(false);
      }
    });
  };

  return (
    <Modal className="w-full max-w-[900px]" show={true} onClose={handleOnClose} label="Flytta till annan gren">
      <form id="move-people-modal-form" onSubmit={onSubmit} className="flex flex-col gap-16">
        <p className="text-small text-dark-secondary">
          För {`${peopleToHandle.length} personer`} under gren {organization.orgName} nivå {organization.level}
        </p>
        <FormControl id="move-people-org-dropdown" className="w-full">
          <FormLabel>Till gren</FormLabel>
          <Combobox
            className="w-full"
            id="move-people-org-dropdown"
            aria-labelledby="move-people-org-dropdown-label"
            onChange={onOrganizationSelectHandler}
            value={!isDirty ? newOrganization?.id?.toString() : undefined}
            defaultValue={newOrganization?.id?.toString() ?? undefined}
          >
            <Combobox.Input className="w-full" placeholder="Sök och välj" />
            <Combobox.List>
              {orgTreeOrganizations
                .filter((x) => x.level === 6)
                .map((item, index) => (
                  <Combobox.Option key={`item-${index}`} value={item.id.toString()}>
                    {`${item.label.trim()} - Nivå ${item.level}${
                      item.orgFromName ? ` under ${item.orgFromName.trim()}` : ''
                    }`}
                  </Combobox.Option>
                ))}
            </Combobox.List>
          </Combobox>
        </FormControl>
        {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        {peopleToHandle?.length !== 0 && <MarkedPeopleList peopleToHandle={peopleToHandle} />}
        {employeesByOrg.length === peopleToHandle.length &&
          newOrganization.id !== organization.id &&
          organization.structureChangeStatus !== 'DELETED' && (
            <FormControl id="terminade-node-checkbox" className="mb-16">
              <FormLabel>
                Ingen personal kommer att finnas kvar i gren {`${organization.orgName} (Nivå ${organization.level})`}.
                Vill du stänga grenen i och med personalflytten?
              </FormLabel>
              <Checkbox onChange={onHandleChecked} aria-labelledby="terminade-node-checkbox">
                Stäng gren
              </Checkbox>
            </FormControl>
          )}
      </form>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={handleOnClose}>
          Avbryt
        </Button>
        <Button
          className="ml-auto"
          variant="primary"
          type="submit"
          form="move-people-modal-form"
          color="primary"
          disabled={isDirty}
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
