import {
  EmploymentChangeArrayDto,
  OrgChangeObject,
  OrgChangeOrganizationEmployee,
} from '@data-contracts/backend/data-contracts';
import LeadButtons from '@layouts/ButtonGroup/LeadButtons';
import UndoIcon from '@mui/icons-material/Undo';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { changeEmployment } from '@services/mdbuilder/api-calls/employment';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Combobox } from '@sk-web-gui/forms';
import {
  Button,
  FormControl,
  FormErrorMessage,
  Modal,
  OptionValueType,
  useConfirm,
  useMessage,
} from '@sk-web-gui/react';
import { renderNewOrOld } from '@utils/render-new-or-old';
import { FormEvent, Fragment, useEffect, useState } from 'react';
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

  const message = useMessage();

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

  const labelHeading = (
    <div>
      <h1 className="text-xl">
        <label id="search-object">Sök och välj objekt</label>
      </h1>
      <h2 className=" block font-normal text-lg leading-tight">
        {' '}
        För {`${peopleToHandle.length} personer`} under gren {organization.orgName} nivå 6
      </h2>
    </div>
  );

  const resetButton = (
    <Button
      className="border-0 float-right"
      type="button"
      size="md"
      variant="link"
      onClick={resetPa}
      aria-label={`Återställ objekt`}
      leftIcon={<UndoIcon className="material-icon !text-2xl" aria-hidden="true" />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="max-w-[900px]" show onClose={handleOnClose} label={labelHeading}>
      <FormControl id="object-edit-dropdown">
        <Combobox
          className="w-full"
          id="object-edit-dropdown"
          placeholder="Sök på objektkod eller beskrivning"
          onChange={onObjectSelectHandler}
          value={activeObject?.label ?? []}
          defaultValue={activeObject?.label ?? []}
        >
          <Combobox.List>
            {objectsByCompany.map((item, index) => (
              <Combobox.Option key={`item-${index}`} value={item.objectCode}>
                {`${item.objectCode.trim()} - ${item.description.trim()}`}
              </Combobox.Option>
            ))}
          </Combobox.List>
        </Combobox>
      </FormControl>
      <form onSubmit={onSubmit}>
        {activeObject &&
          activeObject?.data?.objectId !== initialObject?.data?.objectId &&
          peopleToHandle.length === 1 && <div className="w-full py-sm">{resetButton}</div>}
        {errorMessage && (
          <div className="w-full flex justify-between space-x-2 my-lg">
            <FormErrorMessage>
              <span>{errorMessage ? errorMessage : 'Det gick inte att spara åtgärd'}</span>
            </FormErrorMessage>
          </div>
        )}
        {peopleToHandle.length !== 0 && (
          <MarkedPeopleList
            peopleToHandle={peopleToHandle}
            contextColumn={{
              header: 'Objekt',
              element: (p) => (
                <Fragment>
                  <span className="inline font-bold lg:hidden">Objekt: </span>
                  <span className="lg:float-left">
                    <span className="lg:font-bold lg:text-sm lg:float-left">
                      {renderNewOrOld(p.newObjectCode, p.objectCode)}
                    </span>
                    <br />
                    <span className="inline font-bold lg:hidden">Objekt-namn: </span>
                    <span>{renderNewOrOld(p.newObjectName, p.objectName)}</span>
                  </span>
                </Fragment>
              ),
            }}
          />
        )}
        {peopleToHandleWithObjectCode.length > 0 && (
          <div className="mt-lg gap-sm">
            <Button
              className="text-error border-error hover:border-error hover:bg-error focus-within:bg-error focus-within:text-white"
              size="sm"
              variant="outline"
              aria-describedby="object-modal-disconnect-text"
              onClick={handleDisconnectObject}
            >
              Koppla bort nuvarande objekt
            </Button>
            {peopleToHandle.length > 1 ?
              <p id="object-modal-disconnect-text">{`Väljer du att koppla bort nuvarande objekt kommer inget objekt finnas knutet till valda personer.`}</p>
            : <p id="object-modal-disconnect-text">{`Väljer du att koppla bort nuvarande objekt ${initialObject.data.description} ${initialObject.data.objectCode} kommer inget objekt finnas knutet till den valda personen.`}</p>
            }
          </div>
        )}
        <LeadButtons>
          <Button type="button" onClick={handleOnClose}>
            Stäng
          </Button>
          <Button
            variant="solid"
            type="submit"
            color="primary"
            aria-disabled={!activeObject?.data?.objectId ? 'true' : undefined}
          >
            Spara
          </Button>
        </LeadButtons>
      </form>
    </Modal>
  );
}
