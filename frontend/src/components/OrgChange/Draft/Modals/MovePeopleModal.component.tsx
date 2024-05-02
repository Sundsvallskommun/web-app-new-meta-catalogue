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
import { Combobox } from '@sk-web-gui/forms';
import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  useConfirm,
  useMessage,
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
  const message = useMessage();

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

  const label = (
    <div>
      <h3>{`Flytta ${peopleToHandle.length} personer till annan gren`}</h3>
      <h4 className="font-normal">
        Från {organization.orgName} &#40;Nivå {organization.level}&#41;
      </h4>
    </div>
  );

  return (
    <Modal className="max-w-[900px]" show={true} onClose={handleOnClose} label={label}>
      <form onSubmit={onSubmit}>
        <FormControl id="move-people-org-dropdown">
          <FormLabel>
            <strong>Till gren</strong>
          </FormLabel>
          <Combobox
            className="w-full"
            id="move-people-org-dropdown"
            aria-labelledby="move-people-org-dropdown-label"
            placeholder="Sök och välj..."
            onChange={onOrganizationSelectHandler}
            value={!isDirty ? newOrganization?.id?.toString() : undefined}
            defaultValue={newOrganization?.id?.toString() ?? undefined}
          >
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
        {errorMessage && (
          <div className="w-full flex justify-between space-x-2 my-lg">
            <FormErrorMessage>
              <span>{errorMessage ? errorMessage : 'Det gick inte att spara åtgärd'}</span>
            </FormErrorMessage>
          </div>
        )}
        {peopleToHandle?.length !== 0 && <MarkedPeopleList peopleToHandle={peopleToHandle} />}
        {employeesByOrg.length === peopleToHandle.length &&
          newOrganization.id !== organization.id &&
          organization.structureChangeStatus !== 'DELETED' && (
            <FormControl className="mt-md" id="terminade-node-checkbox">
              <FormLabel className="text-base mb-md">
                <strong>
                  Ingen personal kommer att finnas kvar i gren {`${organization.orgName} (Nivå ${organization.level})`}.
                  Vill du stänga grenen i och med personalflytten?
                </strong>
              </FormLabel>
              <Checkbox onChange={onHandleChecked} size="lg" aria-labelledby="terminade-node-checkbox">
                Stäng gren
              </Checkbox>
            </FormControl>
          )}
        <div className="mt-16 flex flex-col sm:flex-row sm:grid sm:grid-cols-2 sm:gap-10">
          <Button type="button" onClick={handleOnClose}>
            Stäng
          </Button>
          <Button variant="solid" type="submit" color="primary" disabled={isDirty}>
            Spara
          </Button>
        </div>
      </form>
    </Modal>
  );
}
