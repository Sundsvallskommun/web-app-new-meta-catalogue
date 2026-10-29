import { Button, Modal } from '@sk-web-gui/react';
import { Flag } from 'lucide-react';

// icons
import { MDVEmployee } from '@data-contracts/backend/data-contracts';
import { PersonHeader } from '@components/PersonHeader/PersonHeader.component';
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

  const contactDetails = [
    { label: 'Arbetsmobil', value: employeeDetails?.workMobile },
    { label: 'Arbetstelefon', value: employeeDetails?.workPhone },
    { label: 'Registrerat tilltalsnamn', value: employeeDetails?.friendlyGivenname },
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
    <Modal show={isOpen} className="w-[calc(100%-32px)] max-w-screen-xl my-16" onClose={handleOnClose}>
      {employeeDetails && employeeDetails.personId && (
        <>
          <div className="flex flex-col gap-32" data-cy="person-editor">
            <PersonHeader
              personId={employeeDetails.personId}
              givenname={employeeDetails.givenname}
              lastname={employeeDetails.lastname}
              personNumber={employeeDetails.personNumber}
              details={contactDetails}
            />
            {(userRows.length > 0 || emailRows.length > 0) && (
              <div className="flex flex-col lg:flex-row lg:items-start gap-32">
                {userRows.length > 0 && (
                  <section className="flex flex-col gap-8 w-full">
                    <h4 className="text-lead">Användarinfo</h4>
                    <DataTable headers={userHeaders} rows={userRows} captionBody="" captionTitle="" summary="" />
                  </section>
                )}
                {emailRows.length > 0 && (
                  <section className="flex flex-col gap-8 w-full">
                    <h4 className="text-lead">E-postadresser</h4>
                    <DataTable headers={emailHeaders} rows={emailRows} captionBody="" captionTitle="" summary="" />
                  </section>
                )}
              </div>
            )}
            {employRows.length > 0 && (
              <section className="flex flex-col gap-8">
                <h4 className="text-lead">Anställning ({employeeDetails?.employments?.length})</h4>
                <DataTable headers={employHeaders} rows={employRows} captionBody="" captionTitle="" summary="" />
              </section>
            )}
          </div>
          <div className="mt-lg">
            <Button
              variant="link"
              size="sm"
              leftIcon={<Flag />}
              onClick={() =>
                router.replace({ query: { ...router.query, feedback: 'PERSONDETAILS' } }, undefined, { shallow: true })
              }
            >
              Rapportera fel
            </Button>
          </div>
          <Modal.Footer>
            <Button variant="primary" className="w-full" onClick={handleOnClose} type="button">
              Stäng
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default PersonEditor;
