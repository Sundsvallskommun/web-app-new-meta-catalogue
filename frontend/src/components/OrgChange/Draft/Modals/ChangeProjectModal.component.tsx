import {
  EmploymentChangeArrayDto,
  OrgChangeOrganizationEmployee,
  OrgChangeProject,
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

interface IChangeProjectProps {
  peopleToHandle: OrgChangeOrganizationEmployee[];
  closeCallback: () => void;
}

export default function ChangeProjectModal(props: IChangeProjectProps) {
  const { closeCallback, peopleToHandle } = props;
  const getProjectsByCompany = useOrgChangeStore((s) => s.getProjectsByCompany);
  const draft = useOrgChangeStore((s) => s.draft);
  const projectsByCompany = useOrgChangeStore((s) => s.projectsByCompany);
  const getEmployeesByOrg = useOrgChangeStore((s) => s.getEmployeesByOrg);
  const organization = useOrganizationStore((s) => s.organization);
  const [errorMessage, setErrorMessage] = useState('');
  const { showConfirmation } = useConfirm();

  const message = useMessage();

  const peopleToHandleWithProjectCode = peopleToHandle.filter((x) => renderNewOrOld(x.newProjectCode, x.projectCode));

  const initialProject: OptionValueType<OrgChangeProject> = peopleToHandle.length === 1 && {
    label: renderNewOrOld(peopleToHandle[0]?.newProjectCode, peopleToHandle[0]?.projectCode),
    data: {
      projectCode: renderNewOrOld(peopleToHandle[0]?.newProjectCode, peopleToHandle[0]?.projectCode),
      description: renderNewOrOld(peopleToHandle[0]?.newProjectName, peopleToHandle[0]?.projectName),
    },
  };

  const [activeProject, setActiveProject] = useState<OptionValueType<OrgChangeProject>>(
    peopleToHandle.length === 1 && initialProject.label ? initialProject : undefined
  );

  const onProjectSelectHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    const value = projectsByCompany.find((x) => x.projectCode === val);
    if (!value) return;
    setActiveProject({
      label: value.projectCode,
      data: value,
    });
  };

  useEffect(() => {
    getProjectsByCompany(draft.companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClose = async () => {
    if (activeProject?.data?.projectId !== initialProject?.data?.projectId && activeProject !== undefined) {
      const shouldClose = await window.confirm(
        'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?'
      );
      if (!shouldClose) return;
    }
    closeCallback();
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (activeProject.data) {
      if (activeProject.data?.projectId !== initialProject?.data?.projectId) {
        const dataBody: EmploymentChangeArrayDto['people'] = peopleToHandle.map((x) => ({
          personId: x.personId,
          orgId: x.orgId,
          newProjectId: activeProject.data.projectId,
        }));

        changeEmployment(dataBody).then((res) => {
          if (!res.error) {
            getEmployeesByOrg(organization.id);
            message({
              message: `Ändringar på projekt sparas`,
              status: 'success',
            });
            setActiveProject(initialProject);
            closeCallback();
          } else {
            setErrorMessage(res.message);
            message({
              message: `Ändringar på projekt gick inte att spara`,
              status: 'error',
            });
          }
        });
      }
    }
  };

  const handleDisconnectProject = () => {
    const title = 'Är du säker på att du vill koppla bort alla projekt för de valda personerna?';
    showConfirmation(title, '', 'Ja, koppla bort', 'Avbryt').then((result) => {
      if (result === true) {
        const dataBody: EmploymentChangeArrayDto['people'] = peopleToHandle.map((x) => ({
          personId: x.personId,
          orgId: x.orgId,
          newProjectId: null,
        }));

        changeEmployment(dataBody).then((res) => {
          if (!res.error) {
            getEmployeesByOrg(organization.id);
            message({
              message: `Ändringar på projekt sparas`,
              status: 'success',
            });
            setActiveProject(initialProject);
            closeCallback();
          } else {
            setErrorMessage(res.message);
            message({
              message: `Ändringar på projekt gick inte att spara`,
              status: 'error',
            });
          }
        });
      }
    });
  };

  const resetPa = () => {
    setActiveProject(initialProject);
  };

  const labelHeading = (
    <div>
      <h1 className="text-xl">
        <label id="search-project">Sök och välj projekt</label>
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
      aria-label={`Återställ projekt`}
      leftIcon={<UndoIcon className="material-icon !text-2xl" aria-hidden="true" />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="max-w-[900px]" show onClose={handleOnClose} label={labelHeading}>
      <FormControl id="project-edit-dropdown">
        <Combobox
          className="w-full"
          id="project-edit-dropdown"
          placeholder="Sök på projektkod eller beskrivning"
          onChange={onProjectSelectHandler}
          value={activeProject?.label ?? []}
          defaultValue={activeProject?.label ?? []}
        >
          <Combobox.List>
            {projectsByCompany.map((item, index) => (
              <Combobox.Option key={`item-${index}`} value={item.projectCode}>
                {`${item.projectCode.trim()} - ${item.description.trim()}`}
              </Combobox.Option>
            ))}
          </Combobox.List>
        </Combobox>
      </FormControl>
      <form onSubmit={onSubmit}>
        {activeProject &&
          activeProject?.data?.projectId !== initialProject?.data?.projectId &&
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
              header: 'Projekt',
              element: (p) => (
                <Fragment>
                  <span className="inline font-bold lg:hidden">Projekt: </span>
                  <span className="lg:float-left">
                    <span className="lg:font-bold lg:text-sm lg:float-left">
                      {renderNewOrOld(p.newProjectCode, p.projectCode)}
                    </span>
                    <br />
                    <span className="inline font-bold lg:hidden">Projekt-namn: </span>
                    <span>{renderNewOrOld(p.newProjectName, p.projectName)}</span>
                  </span>
                </Fragment>
              ),
            }}
          />
        )}
        {peopleToHandleWithProjectCode.length > 0 && (
          <div className="mt-lg gap-sm">
            <Button
              className="text-error border-error hover:border-error hover:bg-error focus-within:bg-error focus-within:text-white"
              size="sm"
              variant="outline"
              aria-describedby="project-modal-disconnect-text"
              onClick={handleDisconnectProject}
            >
              Koppla bort nuvarande projekt
            </Button>
            {peopleToHandle.length > 1 ?
              <p id="project-modal-disconnect-text">{`Väljer du att koppla bort nuvarande projekt kommer inget projekt finnas knutet till valda personer.`}</p>
            : <p id="project-modal-disconnect-text">{`Väljer du att koppla bort nuvarande projekt ${initialProject.data.description} ${initialProject.data.projectCode} kommer inget projekt finnas knutet till den valda personen.`}</p>
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
            aria-disabled={!activeProject?.data?.projectId ? 'true' : undefined}
          >
            Spara
          </Button>
        </LeadButtons>
      </form>
    </Modal>
  );
}
