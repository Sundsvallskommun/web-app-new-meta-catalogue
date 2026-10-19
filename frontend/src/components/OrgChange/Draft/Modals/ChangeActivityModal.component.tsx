import {
  EmploymentChangeArrayDto,
  OrgChangeActivity,
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

  const message = useSnackbar();

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

  const resetButton = (
    <Button
      type="button"
      size="sm"
      variant="tertiary"
      onClick={resetPa}
      aria-label={`Återställ aktivitet`}
      leftIcon={<Undo2 />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="w-full max-w-[900px]" show onClose={handleOnClose} label="Ändra aktivitet">
      <form id="change-activity-modal-form" onSubmit={onSubmit} className="flex flex-col gap-16">
        <p className="text-small text-dark-secondary">
          För {`${peopleToHandle.length} personer`} under gren {organization.orgName} nivå 6
        </p>
        <FormControl id="activity-edit-dropdown" className="w-full">
          <FormLabel>Aktivitet</FormLabel>
          <Combobox
            className="w-full"
            id="activity-edit-dropdown"
            onChange={onActivitySelectHandler}
            value={activeActivity?.label ?? []}
            defaultValue={activeActivity?.label ?? []}
          >
            <Combobox.Input className="w-full" placeholder="Sök på aktivitetkod eller beskrivning" />
            <Combobox.List>
              {activitiesByCompany.map((item, index) => (
                <Combobox.Option key={`item-${index}`} value={item.activityCode}>
                  {`${item.activityCode.trim()} - ${item.description.trim()}`}
                </Combobox.Option>
              ))}
            </Combobox.List>
          </Combobox>
        </FormControl>
        {activeActivity &&
          activeActivity?.data?.activityId !== initialActivity?.data?.activityId &&
          peopleToHandle.length === 1 && <div>{resetButton}</div>}
        {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        {peopleToHandle.length !== 0 && (
          <MarkedPeopleList
            peopleToHandle={peopleToHandle}
            contextColumn={{
              header: 'Aktivitet',
              element: (p) => (
                <>
                  {renderNewOrOld(p.newActivityCode, p.activityCode)}
                  <br />
                  {renderNewOrOld(p.newActivityName, p.activityName)}
                </>
              ),
            }}
          />
        )}
        {peopleToHandleWithActivityCode.length > 0 && (
          <div className="flex flex-col items-start gap-8">
            <Button
              type="button"
              color="error"
              size="sm"
              variant="tertiary"
              aria-describedby="activity-modal-disconnect-text"
              onClick={handleDisconnectActivity}
            >
              Koppla bort nuvarande aktivitet
            </Button>
            {peopleToHandle.length > 1 ?
              <p
                id="activity-modal-disconnect-text"
                className="text-small"
              >{`Väljer du att koppla bort nuvarande aktivitet kommer inget aktivitet finnas knutet till valda personer.`}</p>
            : <p
                id="activity-modal-disconnect-text"
                className="text-small"
              >{`Väljer du att koppla bort nuvarande aktivitet ${initialActivity.data.description} ${initialActivity.data.activityCode} kommer inget aktivitet finnas knutet till den valda personen.`}</p>
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
          form="change-activity-modal-form"
          color="primary"
          aria-disabled={!activeActivity?.data?.activityId ? 'true' : undefined}
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
