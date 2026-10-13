import { Button, Modal } from '@sk-web-gui/react';
import NextLink from 'next/link';

// icons
import { MDVEmployee } from '@data-contracts/backend/data-contracts';
import { PersonHeader } from '@components/PersonHeader/PersonHeader.component';
import { Flag } from 'lucide-react';
import { emptyPersonEditor } from '@services/mdviewer/defaults/employment';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

interface EmployeeEditorProps {
  isOpen: boolean;
  closeCallback: () => void;
  employeeDetails: MDVEmployee;
}

const header = (label: string): DataTableHeader => ({ element: label, isColumnSortable: false });

const PersonEditor = (props: EmployeeEditorProps) => {
  const { isOpen = false, closeCallback, employeeDetails = emptyPersonEditor } = props;

  const router = useRouter();

  const handleOnClose = async () => {
    closeCallback();
  };

  const contactHeaders = [header('Arbetsmobil'), header('Arbetstelefon'), header('Registrerat tilltalsnamn')];

  const contactRows: DataTableColumn[][] = [
    [
      { element: employeeDetails?.workMobile || 'Inga uppgifter' },
      { element: employeeDetails?.workPhone || 'Inga uppgifter' },
      { element: employeeDetails?.friendlyGivenname || 'Inga uppgifter' },
    ],
  ];

  const userHeaders = [header('Användarnamn'), header('Visningsnamn')];

  const userRows: DataTableColumn[][] =
    employeeDetails?.logins?.map((login) => [{ element: login?.loginname }, { element: login.displayname }]) || [];

  const emailHeaders = [header('E-post'), header('Typ av konto')];

  const emailRows: DataTableColumn[][] =
    employeeDetails?.emails?.map((email) => [{ element: email.smtpAddress }, { element: email.emailSystem }]) || [];

  const employHeaders = [
    header('Titel'),
    header('Giltig från'),
    header('Giltig till'),
    header('Avdelning'),
    header('Överordnad chef'),
  ];

  const employRows: DataTableColumn[][] =
    employeeDetails?.employments?.map((e) => [
      { element: e?.title },
      { element: e?.hireDate ? dayjs(e?.hireDate).format('YYYY-MM-DD') : '-' },
      { element: e?.retireDate ? dayjs(e?.retireDate).format('YYYY-MM-DD') : '-' },
      { element: e.department },
      { element: e?.managerName || '' },
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
              <DataTable headers={employHeaders} rows={employRows} captionBody="" captionTitle="" summary="" />
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
