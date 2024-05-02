import {
  EmploymentChangeArrayDto,
  OrgChangeActivity,
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

interface IChangeActivityProps {
  peopleToHandle: OrgChangeOrganizationEmployee[];
  closeCallback: () => void;
}

export default function ChangeActivityModal(props: IChangeActivityProps) {
  const { closeCallback, peopleToHandle } = props;
  const getActivitiesByCompany = useOrgChangeStore((s) => s.getActivitiesByCompany);
  const draft = useOrgChangeStore((s) => s.draft);
  const activitiesByCompany = useOrgChangeStore((s) => s.activitiesByCompany);
  const getEmployeesByOrg = useOrgChangeStore((s) => s.getEmployeesByOrg);
  const organization = useOrganizationStore((s) => s.organization);
  const [errorMessage, setErrorMessage] = useState('');
  const { showConfirmation } = useConfirm();

  const message = useMessage();

  const peopleToHandleWithActivityCode = peopleToHandle.filter((x) =>
    renderNewOrOld(x.newActivityCode, x.activityCode)
  );

  const initialActivity: OptionValueType<OrgChangeActivity> = peopleToHandle.length === 1 && {
    label: renderNewOrOld(peopleToHandle[0]?.newActivityCode, peopleToHandle[0]?.activityCode),
    data: {
      activityCode: renderNewOrOld(peopleToHandle[0]?.newActivityCode, peopleToHandle[0]?.activityCode),
      description: renderNewOrOld(peopleToHandle[0]?.newActivityName, peopleToHandle[0]?.activityName),
    },
  };

  const [activeActivity, setActiveActivity] = useState<OptionValueType<OrgChangeActivity>>(
    peopleToHandle.length === 1 && initialActivity.label ? initialActivity : undefined
  );

  const onActivitySelectHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    const value = activitiesByCompany.find((x) => x.activityCode === val);
    if (!value) return;
    setActiveActivity({
      label: value.activityCode,
      data: value,
    });
  };

  useEffect(() => {
    getActivitiesByCompany(draft.companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClose = async () => {
    if (activeActivity?.data?.activityId !== initialActivity?.data?.activityId && activeActivity !== undefined) {
      const shouldClose = await window.confirm(
        'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?'
      );
      if (!shouldClose) return;
    }
    closeCallback();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (activeActivity.data) {
      if (activeActivity.data?.activityId !== initialActivity?.data?.activityId) {
        const dataBody: EmploymentChangeArrayDto['people'] = peopleToHandle.map((x) => ({
          personId: x.personId,
          orgId: x.orgId,
          newActivityId: activeActivity.data.activityId,
        }));

        changeEmployment(dataBody).then((res) => {
          if (!res.error) {
            getEmployeesByOrg(organization.id);
            message({
              message: `Ändringar på aktivitet sparas`,
              status: 'success',
            });
            setActiveActivity(initialActivity);
            closeCallback();
          } else {
            setErrorMessage(res.message);
            message({
              message: `Ändringar på aktivitet gick inte att spara`,
              status: 'error',
            });
          }
        });
      }
    }
  };

  const handleDisconnectActivity = () => {
    const title = 'Är du säker på att du vill koppla bort alla aktiviteter för de valda personerna?';
    showConfirmation(title, '', 'Ja, koppla bort', 'Avbryt').then((result) => {
      if (result === true) {
        const dataBody: EmploymentChangeArrayDto['people'] = peopleToHandle.map((x) => ({
          personId: x.personId,
          orgId: x.orgId,
          newActivityId: null,
        }));

        changeEmployment(dataBody).then((res) => {
          if (!res.error) {
            getEmployeesByOrg(organization.id);
            message({
              message: `Ändringar på aktivitet sparas`,
              status: 'success',
            });
            setActiveActivity(initialActivity);
            closeCallback();
          } else {
            setErrorMessage(res.message);
            message({
              message: `Ändringar på aktivitet gick inte att spara`,
              status: 'error',
            });
          }
        });
      }
    });
  };

  const resetPa = () => {
    setActiveActivity(initialActivity);
  };

  const labelHeading = (
    <div>
      <h1 className="text-xl">
        <label id="search-activity">Sök och välj aktivitet</label>
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
      aria-label={`Återställ aktivitet`}
      leftIcon={<UndoIcon className="material-icon !text-2xl" aria-hidden="true" />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="max-w-[900px]" show onClose={handleOnClose} label={labelHeading}>
      <FormControl id="activity-edit-dropdown">
        <Combobox
          className="w-full"
          id="activity-edit-dropdown"
          placeholder="Sök på aktivitetkod eller beskrivning"
          onChange={onActivitySelectHandler}
          value={activeActivity?.label ?? []}
          defaultValue={activeActivity?.label ?? []}
        >
          <Combobox.List>
            {activitiesByCompany.map((item, index) => (
              <Combobox.Option key={`item-${index}`} value={item.activityCode}>
                {`${item.activityCode.trim()} - ${item.description.trim()}`}
              </Combobox.Option>
            ))}
          </Combobox.List>
        </Combobox>
      </FormControl>
      <form onSubmit={onSubmit}>
        {activeActivity &&
          activeActivity?.data?.activityId !== initialActivity?.data?.activityId &&
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
              header: 'Aktivitet',
              element: (p) => (
                <Fragment>
                  <span className="inline font-bold lg:hidden">Aktivitet: </span>
                  <span className="lg:float-left">
                    <span className="lg:font-bold lg:text-sm lg:float-left">
                      {renderNewOrOld(p.newActivityCode, p.activityCode)}
                    </span>
                    <br />
                    <span className="inline font-bold lg:hidden">Aktivitet-namn: </span>
                    <span>{renderNewOrOld(p.newActivityName, p.activityName)}</span>
                  </span>
                </Fragment>
              ),
            }}
          />
        )}
        {peopleToHandleWithActivityCode.length > 0 && (
          <div className="mt-lg gap-sm">
            <Button
              className="text-error border-error hover:border-error hover:bg-error focus-within:bg-error focus-within:text-white"
              size="sm"
              variant="outline"
              aria-describedby="activity-modal-disconnect-text"
              onClick={handleDisconnectActivity}
            >
              Koppla bort nuvarande aktivitet
            </Button>
            {peopleToHandle.length > 1 ?
              <p id="activity-modal-disconnect-text">{`Väljer du att koppla bort nuvarande aktivitet kommer inget aktivitet finnas knutet till valda personer.`}</p>
            : <p id="activity-modal-disconnect-text">{`Väljer du att koppla bort nuvarande aktivitet ${initialActivity.data.description} ${initialActivity.data.activityCode} kommer inget aktivitet finnas knutet till den valda personen.`}</p>
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
            aria-disabled={!activeActivity?.data?.activityId ? 'true' : undefined}
          >
            Spara
          </Button>
        </LeadButtons>
      </form>
    </Modal>
  );
}
