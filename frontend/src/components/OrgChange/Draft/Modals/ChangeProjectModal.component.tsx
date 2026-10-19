import {
  EmploymentChangeArrayDto,
  OrgChangeOrganizationEmployee,
  OrgChangeProject,
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

  const message = useSnackbar();

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

  const resetButton = (
    <Button
      type="button"
      size="sm"
      variant="tertiary"
      onClick={resetPa}
      aria-label={`Återställ projekt`}
      leftIcon={<Undo2 />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="w-full max-w-[900px]" show onClose={handleOnClose} label="Ändra projekt">
      <form id="change-project-modal-form" onSubmit={onSubmit} className="flex flex-col gap-16">
        <p className="text-small text-dark-secondary">
          För {`${peopleToHandle.length} personer`} under gren {organization.orgName} nivå 6
        </p>
        <FormControl id="project-edit-dropdown" className="w-full">
          <FormLabel>Projekt</FormLabel>
          <Combobox
            className="w-full"
            id="project-edit-dropdown"
            onChange={onProjectSelectHandler}
            value={activeProject?.label ?? []}
            defaultValue={activeProject?.label ?? []}
          >
            <Combobox.Input className="w-full" placeholder="Sök på projektkod eller beskrivning" />
            <Combobox.List>
              {projectsByCompany.map((item, index) => (
                <Combobox.Option key={`item-${index}`} value={item.projectCode}>
                  {`${item.projectCode.trim()} - ${item.description.trim()}`}
                </Combobox.Option>
              ))}
            </Combobox.List>
          </Combobox>
        </FormControl>
        {activeProject &&
          activeProject?.data?.projectId !== initialProject?.data?.projectId &&
          peopleToHandle.length === 1 && <div>{resetButton}</div>}
        {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        {peopleToHandle.length !== 0 && (
          <MarkedPeopleList
            peopleToHandle={peopleToHandle}
            contextColumn={{
              header: 'Projekt',
              element: (p) => (
                <>
                  {renderNewOrOld(p.newProjectCode, p.projectCode)}
                  <br />
                  {renderNewOrOld(p.newProjectName, p.projectName)}
                </>
              ),
            }}
          />
        )}
        {peopleToHandleWithProjectCode.length > 0 && (
          <div className="flex flex-col items-start gap-8">
            <Button
              type="button"
              color="error"
              size="sm"
              variant="tertiary"
              aria-describedby="project-modal-disconnect-text"
              onClick={handleDisconnectProject}
            >
              Koppla bort nuvarande projekt
            </Button>
            {peopleToHandle.length > 1 ?
              <p
                id="project-modal-disconnect-text"
                className="text-small"
              >{`Väljer du att koppla bort nuvarande projekt kommer inget projekt finnas knutet till valda personer.`}</p>
            : <p
                id="project-modal-disconnect-text"
                className="text-small"
              >{`Väljer du att koppla bort nuvarande projekt ${initialProject.data.description} ${initialProject.data.projectCode} kommer inget projekt finnas knutet till den valda personen.`}</p>
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
          form="change-project-modal-form"
          color="primary"
          aria-disabled={!activeProject?.data?.projectId ? 'true' : undefined}
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
