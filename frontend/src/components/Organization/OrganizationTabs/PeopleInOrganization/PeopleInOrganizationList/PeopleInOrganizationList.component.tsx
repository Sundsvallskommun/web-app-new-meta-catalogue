import PersonEditor from '@components/Organization/OrganizationTabs/PeopleInOrganization/PersonEditor/PersonEditor.component';
import { useAppContext } from '@contexts/app.context';
import { MDVEmployee } from '@data-contracts/backend/data-contracts';
import ReadMoreOutlinedIcon from '@mui/icons-material/ReadMoreOutlined';
import { getEmployeeDetails } from '@services/mdviewer/api-calls/employment';
import { employeeHeaders } from '@services/mdviewer/defaults/employment';
import { useEmployeesStore } from '@services/mdviewer/employment-service';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Pagination, ZebraTable, ZebraTableColumn, ZebraTableHeader } from '@sk-web-gui/react';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useWindowSize } from '@utils/use-window-size.hook';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface IPeopleInOrganization {
  searchQuery?;
  setSearchQuery?;
}

export const PeopleInOrganizationList = (props: IPeopleInOrganization) => {
  const { searchQuery } = props;

  const { highlightedTableRow, setHighlightedTableRow } = useAppContext();

  // userstore
  const user = useUserStore((s) => s.user);

  // employeestore
  const orgEmployeeFilter = useEmployeesStore((s) => s.orgEmployeeFilter);
  const employeesByOrg = useEmployeesStore((s) => s.employeesByOrg);

  // organizationstore
  const organization = useOrganizationStore((s) => s.organization);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);

  const tableRef = useRef(null);
  const [pageSize] = useState<number>(10);
  const defaultSort = { idx: 0, sortMode: true };
  const [employeeList, setEmployeeList] = useState<MDVEmployee[]>([]);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<MDVEmployee>();

  const [isOpen, setIsOpen] = useState(false);

  const highlightedItemIndex = useHighlightedTableRow(
    highlightedTableRow,
    setHighlightedTableRow,
    employeeList,
    tableRef
  );

  const windowSize = useWindowSize();

  const [page, setPage] = useState<number>(highlightedItemIndex ? Math.floor(highlightedItemIndex / pageSize) : 1);

  const handleSetSelectedPerson = (person: MDVEmployee) => {
    getEmployeeDetails(person.personId).then((res) => {
      if (!res.error) {
        setSelectedEmployeeDetails(res.data);
      }
    });
  };

  const openEditModalHandler = (person) => {
    handleSetSelectedPerson(person);
    setIsOpen(true);
  };

  //setup close modal
  const closeModal = () => {
    setIsOpen(false);
    setHighlightedTableRow({});
  };

  useEffect(() => {
    if (
      highlightedTableRow.property == 'personId' &&
      highlightedItemIndex !== undefined &&
      highlightedTableRow.showPersonDetails
    ) {
      handleSetSelectedPerson(employeeList[highlightedItemIndex]);
      setIsOpen(true);
    }
    if (highlightedItemIndex !== undefined) {
      setPage(Math.floor(highlightedItemIndex / pageSize) + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedItemIndex, highlightedTableRow.clickFingerPrint]);

  //table header
  const headers: ZebraTableHeader[] = employeeHeaders
    // persondetaljer
    .filter((x) => (x.filterId == 4 ? user.permissions.canViewEmployeeDetails : true))
    .map((header) => ({
      element: <span className="font-bold">{header.label}</span>,
      screenReaderOnly: header.screenReaderOnly,
      isColumnSortable: header.isColumnSortable,
      isShown: orgEmployeeFilter.find((f) => f.id === header.filterId)?.value,
    }));

  const employeeSearchFilter = (q: string, obj: MDVEmployee) => {
    const qSplit = q.split(' ');
    if (
      q.includes(' ') &&
      obj.givenname.toLowerCase().includes(qSplit[0]) &&
      obj.lastname.toLowerCase().includes(qSplit[1])
    ) {
      return true; // Full name
    } else if (obj.givenname.toLowerCase().includes(q) || obj.lastname.toLowerCase().includes(q)) {
      return true; // Given name or lastname
    } else if (obj.loginname.toLowerCase().includes(q)) {
      return true; // loginname
    } else if (obj.personNumber.toLowerCase().includes(q)) {
      return true; // personNumber
    } else if (obj.title.toLowerCase().includes(q)) {
      return true; // title (jobb-titel)
    } else {
      return false;
    }
  };

  const handleShowInOrgAndPerson = (orgId, personId) => {
    setSelectedOrganizationId(orgId);
    setHighlightedTableRow({
      property: orgHighlightedTableRowProperty['PERSON'],
      value: personId,
      showPersonDetails: false,
      clickFingerPrint: new Date(),
    });
  };

  const sortHandler = useCallback((sortColumn: number, sortAscending: boolean) => {
    const asc = sortAscending ? 1 : -1;
    setEmployeeList((employees) =>
      employees.length > 0
        ? [
            ...employees.sort((employeeA: MDVEmployee, employeeB: MDVEmployee) => {
              switch (sortColumn) {
                case 0:
                  return columnSort(
                    employeeA.givenname + employeeA.lastname,
                    employeeB.givenname + employeeB.lastname,
                    asc
                  );
                case 1:
                  return columnSort(employeeA.personNumber, employeeB.personNumber, asc);
                case 2:
                  return columnSort(employeeA.title, employeeB.title, asc);
                case 3:
                  return columnSort(employeeA.loginname, employeeB.loginname, asc);
                default:
                  return asc;
              }
            }),
          ]
        : []
    );
  }, []);

  const employeeListSearchFiltered = employeeList.filter(searchFilter(searchQuery, employeeSearchFilter));
  const startIndex = page * pageSize - pageSize;
  const employeeListRendered = employeeListSearchFiltered.slice(startIndex, startIndex + pageSize);
  const pages = Math.ceil(employeeListSearchFiltered.length / pageSize);

  //table columns n rows
  const rows: ZebraTableColumn[][] = employeeListRendered.map((p) => {
    const getADName = (loginname) => {
      const split = loginname.split('\\');
      return split[split.length - 1];
    };

    const openEditModal = (p) => {
      openEditModalHandler(p);
    };

    return [
      {
        element: (
          <Fragment>
            <div className="lg:w-[170px] break-words pr-2.5">
              <span className="inline font-bold lg:hidden">Namn: </span>
              <span className="lg:min-h-[48px] lg:flex lg:items-center">
                {p.orgId !== undefined && p.orgId !== null && !organization.isLeafLevel ? (
                  <Button
                    variant="link"
                    className="text-body text-left"
                    onClick={() => handleShowInOrgAndPerson(p.orgId, p.personId)}
                  >
                    {p.givenname} {p.lastname}
                  </Button>
                ) : (
                  <span>
                    {p.givenname} {p.lastname}
                  </span>
                )}
              </span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 0).value,
      },
      {
        element: (
          <Fragment>
            <div className="lg:w-[100px] break-words pr-2.5">
              <span className="inline font-bold lg:hidden">Personnummer: </span>
              <span>{p.personNumber}</span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 1).value,
      },
      {
        element: (
          <Fragment>
            <div className="lg:w-[180px] break-words pr-2.5">
              <span className="inline font-bold lg:hidden">Anställning: </span>
              <span className="inline">{p.title}</span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 2).value,
      },
      {
        element: (
          <Fragment>
            <div className="lg:w-[140px] pr-2.5">
              <span className="inline font-bold lg:hidden">Användarnamn: </span>
              <span>{getADName(p.loginname)}</span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 3).value,
      },
      {
        element: (
          <Fragment>
            <div className="mt-4 lg:mt-0 relative">
              <Button
                variant={windowSize.lg ? 'outline' : 'solid'}
                color={`primary`}
                className="border-0"
                iconButton={windowSize.lg || undefined}
                title="Öppna persondetaljer"
                aria-label={`${p.givenname} ${p.lastname}`}
                size="md"
                onClick={() => openEditModal(p)}
                leftIcon={<ReadMoreOutlinedIcon className="material-icon !text-2xl" aria-hidden="true" />}
              >
                <span className="lg:hidden">Öppna persondetaljer</span>
              </Button>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 4)?.value && user.permissions.canViewEmployeeDetails,
      },
    ];
  });

  const employeesByOrgMemo = useMemo(() => {
    return employeesByOrg;
  }, [employeesByOrg]);

  useEffect(() => {
    setEmployeeList(JSON.parse(JSON.stringify(employeesByOrgMemo)) || []);
    sortHandler(defaultSort.idx, defaultSort.sortMode);
  }, [employeesByOrgMemo, sortHandler, defaultSort.idx, defaultSort.sortMode]);

  return (
    <div className="w-full bg-white px-0 pb-16 pt-10">
      <h2
        id="org-tabs-people-table-rowsstext"
        aria-label={`${employeeListSearchFiltered.length} personer i listan`}
        className="table-header text-xl mx-8 px-2 border-b-2 border-grey"
      >
        Personer &#40;{employeeListSearchFiltered.length}&#41;
      </h2>
      {rows.length > 0 ? (
        <div className={'overflow-x-auto custom-scroll'}>
          <ZebraTable
            ref={tableRef}
            highlightedItemIndex={highlightedItemIndex !== undefined ? highlightedItemIndex % pageSize : undefined}
            sortHandler={sortHandler}
            pages={0}
            pageSize={pageSize}
            defaultSort={defaultSort}
            captionBody=""
            captionTitle=""
            headers={headers}
            rows={rows}
            tableSortable={true}
            summary=""
          />
          {pages > 1 && (
            <Pagination
              className="mt-lg px-lg"
              pages={pages}
              activePage={page}
              pagesBefore={!windowSize.lg ? 0 : undefined}
              pagesAfter={!windowSize.lg ? 0 : undefined}
              changePage={(page) => {
                setPage(page);
                setHighlightedTableRow({});
              }}
            />
          )}
        </div>
      ) : (
        <div className="mt-sm mx-8 px-2">Inga personer att visa.</div>
      )}
      {isOpen && selectedEmployeeDetails && user.permissions.canViewEmployeeDetails && (
        <PersonEditor isOpen={isOpen} closeCallback={closeModal} employeeDetails={selectedEmployeeDetails} />
      )}
    </div>
  );
};

export default PeopleInOrganizationList;
