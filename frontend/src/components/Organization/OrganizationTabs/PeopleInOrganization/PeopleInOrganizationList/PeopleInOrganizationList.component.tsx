import PersonEditor from '@components/Organization/OrganizationTabs/PeopleInOrganization/PersonEditor/PersonEditor.component';
import { useAppContext } from '@contexts/app.context';
import { MDVEmployee } from '@data-contracts/backend/data-contracts';
import { ListCollapse } from 'lucide-react';
import { getEmployeeDetails } from '@services/mdviewer/api-calls/employment';
import { employeeHeaders } from '@services/mdviewer/defaults/employment';
import { useEmployeesStore } from '@services/mdviewer/employment-service';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button } from '@sk-web-gui/react';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

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
  const headers: DataTableHeader[] = employeeHeaders
    // persondetaljer
    .filter((x) => (x.filterId == 4 ? user.permissions.canViewEmployeeDetails : true))
    .map((header) => ({
      element: header.label,
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
      employees.length > 0 ?
        [
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
  const rows: DataTableColumn[][] = employeeListRendered.map((p) => {
    const getADName = (loginname) => {
      const split = loginname.split('\\');
      return split[split.length - 1];
    };

    const openEditModal = (p) => {
      openEditModalHandler(p);
    };

    return [
      {
        element:
          p.orgId !== undefined && p.orgId !== null && !organization.isLeafLevel ?
            <Button variant="link" onClick={() => handleShowInOrgAndPerson(p.orgId, p.personId)}>
              {p.givenname} {p.lastname}
            </Button>
          : `${p.givenname} ${p.lastname}`,
        isShown: orgEmployeeFilter.find((i) => i.id === 0).value,
      },
      {
        element: p.personNumber,
        isShown: orgEmployeeFilter.find((i) => i.id === 1).value,
      },
      {
        element: p.title,
        isShown: orgEmployeeFilter.find((i) => i.id === 2).value,
      },
      {
        element: getADName(p.loginname),
        isShown: orgEmployeeFilter.find((i) => i.id === 3).value,
      },
      {
        element: (
          <Button
            iconButton
            variant="tertiary"
            size="sm"
            title="Öppna persondetaljer"
            aria-label={`Öppna persondetaljer för ${p.givenname} ${p.lastname}`}
            onClick={() => openEditModal(p)}
          >
            <ListCollapse />
          </Button>
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
    <div className="w-full bg-background-content px-0 pb-40 pt-24">
      <h2
        id="org-tabs-people-table-rowsstext"
        aria-label={`${employeeListSearchFiltered.length} personer i listan`}
        className="text-lead mb-16"
        data-cy="table-header"
      >
        Personer &#40;{employeeListSearchFiltered.length}&#41;
      </h2>
      {rows.length > 0 ?
        <div>
          <DataTable
            ref={tableRef}
            highlightedItemIndex={highlightedItemIndex}
            sortHandler={sortHandler}
            pages={pages}
            page={page}
            changePage={(page) => {
              setPage(page);
              setHighlightedTableRow({});
            }}
            pageSize={pageSize}
            defaultSort={defaultSort}
            captionBody=""
            captionTitle=""
            headers={headers}
            rows={rows}
            tableSortable={true}
            summary=""
          />
        </div>
      : <div className="mt-sm">Inga personer att visa.</div>}
      {isOpen && selectedEmployeeDetails && user.permissions.canViewEmployeeDetails && (
        <PersonEditor isOpen={isOpen} closeCallback={closeModal} employeeDetails={selectedEmployeeDetails} />
      )}
    </div>
  );
};

export default PeopleInOrganizationList;
