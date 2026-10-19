import {
  EmploymentChangeArrayDto,
  OrgChangeObject,
  OrgChangeOrganizationEmployee,
} from '@data-contracts/backend/data-contracts';
import { Undo2 } from 'lucide-react';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { changeEmployment } from '@services/mdbuilder/api-calls/employment';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  useConfirm,
  useSnackbar,
  Combobox,
} from '@sk-web-gui/react';
import { OptionValueType } from '@interfaces/option-value';
import { renderNewOrOld } from '@utils/render-new-or-old';
import { FormEvent, useEffect, useState } from 'react';
import { MarkedPeopleList } from './components/MarkedPeopleList.component';

interface IChangeObjectProps {
  peopleToHandle: OrgChangeOrganizationEmployee[];
  closeCallback: () => void;
}

export default function ChangeObjectModal(props: IChangeObjectProps) {
  const { closeCallback, peopleToHandle } = props;
  const getObjectsByCompany = useOrgChangeStore((s) => s.getObjectsByCompany);
  const draft = useOrgChangeStore((s) => s.draft);
  const objectsByCompany = useOrgChangeStore((s) => s.objectsByCompany);
  const getEmployeesByOrg = useOrgChangeStore((s) => s.getEmployeesByOrg);
  const organization = useOrganizationStore((s) => s.organization);
  const [errorMessage, setErrorMessage] = useState('');
  const { showConfirmation } = useConfirm();

  const message = useSnackbar();

  const peopleToHandleWithObjectCode = peopleToHandle.filter((x) => renderNewOrOld(x.newObjectCode, x.objectCode));

  const initialObject: OptionValueType<OrgChangeObject> = peopleToHandle.length === 1 && {
    label: renderNewOrOld(peopleToHandle[0]?.newObjectCode, peopleToHandle[0]?.objectCode),
    data: {
      objectCode: renderNewOrOld(peopleToHandle[0]?.newObjectCode, peopleToHandle[0]?.objectCode),
      description: renderNewOrOld(peopleToHandle[0]?.newObjectName, peopleToHandle[0]?.objectName),
    },
  };

  const [activeObject, setActiveObject] = useState<OptionValueType<OrgChangeObject>>(
    peopleToHandle.length === 1 && initialObject.label ? initialObject : undefined
  );

  const onObjectSelectHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    const value = objectsByCompany.find((x) => x.objectCode === val);
    if (!value) return;
    setActiveObject({
      label: value.objectCode,
      data: value,
    });
  };

  useEffect(() => {
    getObjectsByCompany(draft.companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClose = async () => {
    if (activeObject?.data?.objectId !== initialObject?.data?.objectId && activeObject !== undefined) {
      const shouldClose = await window.confirm(
        'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?'
      );
      if (!shouldClose) return;
    }
    closeCallback();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (activeObject.data) {
      if (activeObject.data?.objectId !== initialObject?.data?.objectId) {
        const dataBody: EmploymentChangeArrayDto['people'] = peopleToHandle.map((x) => ({
          personId: x.personId,
          orgId: x.orgId,
          newObjectId: activeObject.data.objectId,
        }));

        changeEmployment(dataBody).then((res) => {
          if (!res.error) {
            getEmployeesByOrg(organization.id);
            message({
              message: `Ändringar på objekt sparas`,
              status: 'success',
            });
            setActiveObject(initialObject);
            closeCallback();
          } else {
            setErrorMessage(res.message);
            message({
              message: `Ändringar på objekt gick inte att spara`,
              status: 'error',
            });
          }
        });
      }
    }
  };

  const handleDisconnectObject = () => {
    const title = 'Är du säker på att du vill koppla bort alla objekt för de valda personerna?';
    showConfirmation(title, '', 'Ja, koppla bort', 'Avbryt').then((result) => {
      if (result === true) {
        const dataBody: EmploymentChangeArrayDto['people'] = peopleToHandle.map((x) => ({
          personId: x.personId,
          orgId: x.orgId,
          newObjectId: null,
        }));

        changeEmployment(dataBody).then((res) => {
          if (!res.error) {
            getEmployeesByOrg(organization.id);
            message({
              message: `Ändringar på objekt sparas`,
              status: 'success',
            });
            setActiveObject(initialObject);
            closeCallback();
          } else {
            setErrorMessage(res.message);
            message({
              message: `Ändringar på objekt gick inte att spara`,
              status: 'error',
            });
          }
        });
      }
    });
  };

  const resetPa = () => {
    setActiveObject(initialObject);
  };

  const resetButton = (
    <Button
      type="button"
      size="sm"
      variant="tertiary"
      onClick={resetPa}
      aria-label={`Återställ objekt`}
      leftIcon={<Undo2 />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="w-full max-w-[900px]" show onClose={handleOnClose} label="Ändra objekt">
      <form id="change-object-modal-form" onSubmit={onSubmit} className="flex flex-col gap-16">
        <p className="text-small text-dark-secondary">
          För {`${peopleToHandle.length} personer`} under gren {organization.orgName} nivå 6
        </p>
        <FormControl id="object-edit-dropdown" className="w-full">
          <FormLabel>Objekt</FormLabel>
          <Combobox
            className="w-full"
            id="object-edit-dropdown"
            onChange={onObjectSelectHandler}
            value={activeObject?.label ?? []}
            defaultValue={activeObject?.label ?? []}
          >
            <Combobox.Input className="w-full" placeholder="Sök på objektkod eller beskrivning" />
            <Combobox.List>
              {objectsByCompany.map((item, index) => (
                <Combobox.Option key={`item-${index}`} value={item.objectCode}>
                  {`${item.objectCode.trim()} - ${item.description.trim()}`}
                </Combobox.Option>
              ))}
            </Combobox.List>
          </Combobox>
        </FormControl>
        {activeObject &&
          activeObject?.data?.objectId !== initialObject?.data?.objectId &&
          peopleToHandle.length === 1 && <div>{resetButton}</div>}
        {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        {peopleToHandle.length !== 0 && (
          <MarkedPeopleList
            peopleToHandle={peopleToHandle}
            contextColumn={{
              header: 'Objekt',
              element: (p) => (
                <>
                  {renderNewOrOld(p.newObjectCode, p.objectCode)}
                  <br />
                  {renderNewOrOld(p.newObjectName, p.objectName)}
                </>
              ),
            }}
          />
        )}
        {peopleToHandleWithObjectCode.length > 0 && (
          <div className="flex flex-col items-start gap-8">
            <Button
              type="button"
              color="error"
              size="sm"
              variant="tertiary"
              aria-describedby="object-modal-disconnect-text"
              onClick={handleDisconnectObject}
            >
              Koppla bort nuvarande objekt
            </Button>
            {peopleToHandle.length > 1 ?
              <p
                id="object-modal-disconnect-text"
                className="text-small"
              >{`Väljer du att koppla bort nuvarande objekt kommer inget objekt finnas knutet till valda personer.`}</p>
            : <p
                id="object-modal-disconnect-text"
                className="text-small"
              >{`Väljer du att koppla bort nuvarande objekt ${initialObject.data.description} ${initialObject.data.objectCode} kommer inget objekt finnas knutet till den valda personen.`}</p>
            }
          </div>
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
          form="change-object-modal-form"
          color="primary"
          aria-disabled={!activeObject?.data?.objectId ? 'true' : undefined}
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
