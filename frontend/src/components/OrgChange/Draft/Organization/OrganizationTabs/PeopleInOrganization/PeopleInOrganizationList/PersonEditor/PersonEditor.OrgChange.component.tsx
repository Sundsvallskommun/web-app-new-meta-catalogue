import EmploymentContextMenu from '@components/OrgChange/Draft/Organization/OrganizationTabs/PeopleInOrganization/PeopleInOrganizationList/PersonEditor/EmploymentContextMenu.component';
import { OrgChangePersonEmployeeDetail } from '@data-contracts/backend/data-contracts';
import { PersonHeader } from '@components/PersonHeader/PersonHeader.component';
import { Flag } from 'lucide-react';
import { emptyPersonEditor } from '@services/mdbuilder/defaults';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Modal } from '@sk-web-gui/react';
import { renderNewOrOld } from '@utils/render-new-or-old';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

interface EmployeeEditorProps {
  isOpen: boolean;
  closeCallback: () => void;
  employeeDetails: OrgChangePersonEmployeeDetail;
}

const header = (label: string): DataTableHeader => ({ element: label, isColumnSortable: false });

const PersonEditor = (props: EmployeeEditorProps) => {
  const { isOpen = false, closeCallback, employeeDetails = emptyPersonEditor } = props;

  // userstore
  const user = useUserStore((s) => s.user);

  const router = useRouter();
  const { draftIsReadOnly } = useDraftPhaseState();

  const handleOnClose = async () => {
    closeCallback();
  };

  const contactHeaders = [
    header('Arbetsmobil'),
    header('Arbetstelefon'),
    header('Registrerat tilltalsnamn'),
    header('Mellannamn'),
  ];

  const contactRows: DataTableColumn[][] = [
    [
      { element: employeeDetails?.workMobile || 'Inga uppgifter' },
      { element: employeeDetails?.workPhone || 'Inga uppgifter' },
      { element: employeeDetails?.friendlyGivenname || 'Inga uppgifter' },
      { element: employeeDetails?.middlename || 'Inga uppgifter' },
    ],
  ];

  const userHeaders = [header('Användarnamn'), header('Visningsnamn')];

  const userRows: DataTableColumn[][] =
    employeeDetails?.logins?.map((login) => [{ element: login?.loginname }, { element: login.displayname }]) || [];

  const emailHeaders = [header('E-post'), header('Typ av konto')];

  const emailRows: DataTableColumn[][] =
    employeeDetails?.emails?.map((email) => [{ element: email.smtpAddress }, { element: email.emailSystem }]) || [];

  const canEditEmployment = user.permissions.canEditOrganization && !draftIsReadOnly;

  const employOrgChangeHeaders: DataTableHeader[] = [
    header('Titel'),
    header('Giltig från'),
    header('Giltig till'),
    header('Avdelning'),
    header('PA-Team'),
    header('Verksamhet'),
    { ...header('Redigera anställning'), screenReaderOnly: true, isShown: canEditEmployment },
  ];

  const employRows: DataTableColumn[][] =
    employeeDetails?.employments?.map((e) => [
      { element: e?.title },
      { element: e?.hireDate ? dayjs(e?.hireDate).format('YYYY-MM-DD') : '-' },
      { element: e?.retireDate ? dayjs(e?.retireDate).format('YYYY-MM-DD') : '-' },
      { element: e.department },
      {
        element: (
          <span className="flex flex-col">
            <span>{renderNewOrOld(e.newPATeam, e.paTeam)}</span>
            <span>{renderNewOrOld(e.newPATeamName, e.paTeamName)}</span>
          </span>
        ),
      },
      {
        element: (
          <span className="flex flex-col">
            <span>{renderNewOrOld(e.newOperationCode, e.operationCode)}</span>
            <span>{renderNewOrOld(e.newOperationName, e.operationName)}</span>
          </span>
        ),
      },
      {
        element: <EmploymentContextMenu employeeDetails={employeeDetails} selectedEmploymentDetails={e} />,
        isShown: canEditEmployment,
      },
    ]) || [];

  return (
    <Modal show={isOpen} className="max-w-screen-xl" onClose={handleOnClose}>
      {employeeDetails && employeeDetails.personId && (
        <>
          <div className="flex flex-col gap-32" data-cy="person-editor">
            <PersonHeader
              personId={employeeDetails.personId}
              givenname={employeeDetails.givenname}
              lastname={employeeDetails.lastname}
              personNumber={employeeDetails.personNumber}
            />
            <section className="flex flex-col gap-16">
              <h4 className="text-lead">Kontaktuppgifter</h4>
              <DataTable headers={contactHeaders} rows={contactRows} captionBody="" captionTitle="" summary="" />
            </section>
            <div className="flex flex-col lg:flex-row gap-32">
              <section className="flex flex-col gap-16 w-full">
                <h4 className="text-lead">Användarinfo</h4>
                <DataTable
                  headers={userHeaders}
                  rows={userRows}
                  pageSize={2}
                  captionBody=""
                  captionTitle=""
                  summary=""
                />
              </section>
              <section className="flex flex-col gap-16 w-full">
                <h4 className="text-lead">E-postadresser</h4>
                <DataTable
                  headers={emailHeaders}
                  rows={emailRows}
                  pageSize={2}
                  captionBody=""
                  captionTitle=""
                  summary=""
                />
              </section>
            </div>
            <section className="flex flex-col gap-16">
              <h4 className="text-lead">Anställning ({employeeDetails?.employments?.length})</h4>
              <DataTable headers={employOrgChangeHeaders} rows={employRows} captionBody="" captionTitle="" summary="" />
            </section>
            <NextLink
              legacyBehavior
              href={{
                query: { ...router.query, feedback: 'PERSONDETAILS' },
              }}
              shallow
              replace
            >
              <Button type="button" variant="link" leftIcon={<Flag />}>
                Rapportera fel
              </Button>
            </NextLink>
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleOnClose} type="button">
              Stäng
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default PersonEditor;
