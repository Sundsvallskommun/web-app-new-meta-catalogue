import { Button, FormLabel, Modal, ZebraTable, ZebraTableColumn, ZebraTableHeader } from '@sk-web-gui/react';
import Image from 'next/image';
import NextLink from 'next/link';
import { Fragment } from 'react';

// icons
import { MDVEmployee } from '@data-contracts/backend/data-contracts';
import LeadButtons from '@layouts/ButtonGroup/LeadButtons';
import OutlinedFlagIcon from '@mui/icons-material/OutlinedFlag';
import { emptyPersonEditor } from '@services/mdviewer/defaults/employment';
import { apiURL } from '@utils/api-url';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

interface EmployeeEditorProps {
  isOpen: boolean;
  closeCallback: () => void;
  employeeDetails: MDVEmployee;
}

const PersonEditor = (props: EmployeeEditorProps) => {
  const { isOpen = false, closeCallback, employeeDetails = emptyPersonEditor } = props;

  const router = useRouter();

  const handleOnClose = async () => {
    closeCallback();
  };

  const userHeaders: ZebraTableHeader[] = [
    {
      element: <span className="font-bold">Användarnamn</span>,
      isShown: true,
      isColumnSortable: false,
      screenReaderOnly: false,
    },
    {
      element: <span className="font-bold">Visningsnamn</span>,
      isShown: true,
      isColumnSortable: false,
      screenReaderOnly: false,
    },
  ];

  const userRows: ZebraTableColumn[][] =
    employeeDetails?.logins?.map((login) => {
      return [
        {
          element: (
            <Fragment>
              <span className="inline font-bold lg:hidden">Användarnamn: </span>
              <span>{login?.loginname}</span>
            </Fragment>
          ),
          isShown: true,
        },
        {
          element: (
            <Fragment>
              <span className="inline font-bold lg:hidden">Visningsnamn: </span>
              <span>{login.displayname}</span>
            </Fragment>
          ),
          isShown: true,
        },
      ];
    }) || [];

  const emailHeaders: ZebraTableHeader[] = [
    {
      element: <p className="font-bold">E-post</p>,
      isShown: true,
      isColumnSortable: false,
      screenReaderOnly: false,
    },
    {
      element: <p className="font-bold">Typ av konto</p>,
      isShown: true,
      isColumnSortable: false,
      screenReaderOnly: false,
    },
  ];

  const emailRows: ZebraTableColumn[][] =
    employeeDetails?.emails?.map((email) => {
      return [
        {
          element: (
            <Fragment>
              <span className="inline font-bold lg:hidden">E-post: </span>
              <span className="break-all">{email.smtpAddress}</span>
            </Fragment>
          ),
          isShown: true,
        },
        {
          element: (
            <Fragment>
              <span className="inline font-bold lg:hidden">Kontotyp: </span>
              <span>{email.emailSystem}</span>
            </Fragment>
          ),
          isShown: true,
        },
      ];
    }) || [];

  const employHeaders: ZebraTableHeader[] = [
    {
      element: <p className="font-bold">Titel</p>,
      isShown: true,
      isColumnSortable: false,
      screenReaderOnly: false,
    },
    {
      element: <p className="font-bold">Giltig från</p>,
      isShown: true,
      isColumnSortable: false,
      screenReaderOnly: false,
    },
    {
      element: <p className="font-bold">Giltig till</p>,
      isShown: true,
      isColumnSortable: false,
      screenReaderOnly: false,
    },
    {
      element: <p className="font-bold">Avdelning</p>,
      isShown: true,
      isColumnSortable: false,
      screenReaderOnly: false,
    },
    {
      element: <p className="font-bold">Överordnad chef</p>,
      isShown: true,
      isColumnSortable: false,
      screenReaderOnly: false,
    },
  ];

  const employRows: ZebraTableColumn[][] =
    employeeDetails?.employments?.map((e) => {
      return [
        {
          element: (
            <Fragment>
              <span className="inline font-bold lg:hidden">Titel: </span>
              <span>{e?.title}</span>
            </Fragment>
          ),
          isShown: true,
        },
        {
          element: (
            <Fragment>
              <span className="inline font-bold lg:hidden">Giltig från: </span>
              <span>{e?.hireDate ? dayjs(e?.hireDate).format('YYYY-MM-DD') : '-'}</span>
            </Fragment>
          ),
          isShown: true,
        },
        {
          element: (
            <Fragment>
              <span className="inline font-bold lg:hidden">Giltig till: </span>
              <span>{e?.retireDate ? dayjs(e?.retireDate).format('YYYY-MM-DD') : '-'}</span>
            </Fragment>
          ),
          isShown: true,
        },
        {
          element: (
            <Fragment>
              <span className="inline font-bold lg:hidden">Avdelning: </span>
              <span>{e.department}</span>
            </Fragment>
          ),
          isShown: true,
        },
        {
          element: (
            <Fragment>
              <span className="inline font-bold lg:hidden">Överordnad chef: </span>
              <span className="text-left">{e?.managerName ? e?.managerName : ''}</span>
            </Fragment>
          ),
          isShown: true,
        },
      ];
    }) || [];

  return (
    <Modal show={isOpen} className="max-w-screen-xl" onClose={handleOnClose}>
      {employeeDetails && employeeDetails.personId && (
        <div className="PersonEditor">
          <div className="lg:flex lg:justify-center lg:items-center lg:space-x-10 mt-[-20px]">
            <div className="w-[130px] text-center">
              <div className="w-[130px] h-[130px] relative items-start rounded-full border-2 border-primary flex justify-center overflow-hidden mb-md">
                <Image
                  unoptimized
                  src={`${apiURL(`/employee/${employeeDetails.personId}/personimage`)}`}
                  width={130}
                  height={130}
                  alt="Bild på user"
                  className="w-full justify-self-center"
                />
              </div>
            </div>
            <div className="max-w-[900px] w-full">
              <div className="mb-md">
                <h4 className="text-xl">
                  {employeeDetails?.givenname} {employeeDetails?.lastname}
                </h4>
                <span>{employeeDetails.personNumber}</span>
              </div>

              <div className="grid grid-cols-[repeat(2,max-content)] grid-flow-row-dense gap-8">
                <div>
                  <FormLabel className="m-0">
                    <strong>Arbetsmobil</strong>
                  </FormLabel>
                  {employeeDetails.workMobile ?
                    <span>{employeeDetails.workMobile}</span>
                  : <span> Inga uppgifter </span>}
                </div>
                <div>
                  <FormLabel className="m-0">
                    <strong>Registrerat tilltalsnamn</strong>
                  </FormLabel>
                  {employeeDetails.friendlyGivenname ?
                    <span>{employeeDetails.friendlyGivenname}</span>
                  : <span> Inga uppgifter </span>}
                </div>
                <div>
                  <FormLabel className="m-0">
                    <strong>Arbetstelefon</strong>
                  </FormLabel>
                  {employeeDetails.workPhone ?
                    <span>{employeeDetails.workPhone}</span>
                  : <span> Inga uppgifter </span>}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:flex lg:justify-between mt-lg lg:space-x-[20px]">
            <div className="w-full">
              <h4 className="text-xl ml-sm">Användarinfo</h4>
              <div className="last-th-right border-t border-gray-stroke rounded-sm mt-sm [&_.sk-zebratable-bottomwrapper]:px-sm">
                <ZebraTable
                  headers={userHeaders}
                  rows={userRows}
                  pageSize={2}
                  captionBody=""
                  captionTitle=""
                  summary=""
                />
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-xl ml-sm">E-postadresser</h4>
              <div className="last-th-right border-t border-gray-stroke rounded-sm mt-sm [&_.sk-zebratable-bottomwrapper]:px-sm">
                <ZebraTable
                  headers={emailHeaders}
                  rows={emailRows}
                  pageSize={2}
                  captionBody=""
                  captionTitle=""
                  summary=""
                />
              </div>
            </div>
          </div>
          <div className="w-full mt-lg">
            <h4 className="text-xl ml-sm pb-2 border-b border-gray-stroke">
              Anställning ({employeeDetails?.employments?.length})
            </h4>
            <div className="min-h-[100px]">
              <ZebraTable headers={employHeaders} rows={employRows} captionBody="" captionTitle="" summary="" />
            </div>
            <NextLink
              legacyBehavior
              href={{
                query: { ...router.query, feedback: 'PERSONDETAILS' },
              }}
              shallow
              replace
            >
              <Button
                type="button"
                variant="link"
                className="mt-lg w-fit h-fit text-gray"
                leftIcon={<OutlinedFlagIcon />}
              >
                Rapportera fel
              </Button>
            </NextLink>
          </div>

          <LeadButtons className="!mt-sm">
            <Button
              variant="solid"
              color="primary"
              size="lg"
              onClick={handleOnClose}
              className="my-sm sm:my-6 w-full"
              type="button"
            >
              Stäng
            </Button>
          </LeadButtons>
        </div>
      )}
    </Modal>
  );
};

export default PersonEditor;
