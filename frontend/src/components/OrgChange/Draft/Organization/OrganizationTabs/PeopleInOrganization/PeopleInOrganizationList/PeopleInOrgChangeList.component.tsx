import { Checkbox } from '@sk-web-gui/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationEmployee, OrgChangePersonEmployeeDetail } from '@data-contracts/backend/data-contracts';
import { ListCollapse } from 'lucide-react';
import { getEmployeeDetails } from '@services/mdbuilder/api-calls/employment';
import { employeeOrgChangeHeaders } from '@services/mdbuilder/defaults';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { getADName } from '@services/mdviewer/data-handlers/employment';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button } from '@sk-web-gui/react';
import { columnSort } from '@utils/columnSort';
import { renderNewOrOld } from '@utils/render-new-or-old';
import { searchFilter } from '@utils/search';
import { shouldEditEmployee } from '@utils/shouldeditemployee';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import HandleMarkedContextMenu from './HandleMarkedContextMenu.component';
import PersonEditor from './PersonEditor/PersonEditor.OrgChange.component';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

interface IPeopleInOrgChange {
  searchQuery?;
}

export const PeopleInOrgChangeList = (props: IPeopleInOrgChange) => {
  const { searchQuery } = props;
  const { highlightedTableRow, setHighlightedTableRow } = useAppContext();
  const user = useUserStore((s) => s.user);

  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const { draftIsReadOnly } = useDraftPhaseState();

  const organization = useOrganizationStore((s) => s.organization);
  const orgEmployeeFilter = useOrgChangeStore((s) => s.orgChangeEmployeeFilter);
  const employeesByOrg = useOrgChangeStore((s) => s.employeesByOrg);

  const tableRef = useRef(null);
  const [pageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const defaultSort = { idx: 0, sortMode: true };
  const [employeeList, setEmployeeList] = useState<OrgChangeOrganizationEmployee[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<OrgChangeOrganizationEmployee>();
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<OrgChangePersonEmployeeDetail>();

  const [peopleToHandle, setPeopleToHandle] = useState<OrgChangeOrganizationEmployee[]>([]);

  const [personEditorIsOpen, setPersonEditorIsOpen] = useState(false);

  const highlightedItemIndex = useHighlightedTableRow(
    highlightedTableRow,
    setHighlightedTableRow,
    employeeList,
    tableRef
  );

  const toggleChoosePerson = (employee: OrgChangeOrganizationEmployee, shouldAdd) => {
    if (shouldAdd) {
      setPeopleToHandle((people) => people.filter((x) => x.personId !== employee.personId));
    } else {
      setPeopleToHandle((people) => people.concat([employee]));
    }
  };

  const choosePersonHandler = (employee: OrgChangeOrganizationEmployee) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    toggleChoosePerson(employee, !isChecked);
  };

  const toggleChooseAllPeopleHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    employeeList.forEach((employee) => {
      toggleChoosePerson(employee, !isChecked);
    });
  };

  const handleSetSelectedPerson = (person: OrgChangeOrganizationEmployee) => {
    setSelectedPerson(person);
  };

  useEffect(() => {
    if (selectedPerson?.personId) {
      getEmployeeDetails(selectedPerson.personId).then((res) => {
        if (!res.error) {
          setSelectedEmployeeDetails(res.data);
        }
      });
    }
  }, [employeesByOrg, selectedPerson]);

  const openPersonEditorModal = (person) => {
    handleSetSelectedPerson(person);
    setPersonEditorIsOpen(true);
  };

  const closePersonEditorModal = () => {
    setPersonEditorIsOpen(false);
    setHighlightedTableRow({});
  };

  useEffect(() => {
    if (
      highlightedTableRow.property == 'personId' &&
      highlightedItemIndex !== undefined &&
      highlightedTableRow.showPersonDetails
    ) {
      handleSetSelectedPerson(employeeList[highlightedItemIndex]);
      setPersonEditorIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedItemIndex, highlightedTableRow.clickFingerPrint]);

  //table header
  const headers: DataTableHeader[] = employeeOrgChangeHeaders
    .filter((x) => (x.filterId == 8 ? user.permissions.canViewEmployeeDetails : true))
    .filter((x) => (x.filterId == 9 ? user.permissions.canViewEmployeeDetails : true))
    .filter((x) => (x.filterId == 10 ? user.permissions.canViewEmployeeDetails : true))
    .filter((x) => (x.filterId == 6 ? user.permissions.canViewEmployeeDetails : true))
    .filter((x) => (x.filterId == 7 ? user.permissions.canEditEmployeeDetails : true))
    .map((header) => ({
      element: header.label,
      screenReaderOnly: header.screenReaderOnly,
      isColumnSortable: header.isColumnSortable,
      isShown: orgEmployeeFilter.find((f) => f.id === header.filterId)?.value,
    }));

  const employeeSearchFilter = (q: string, obj: OrgChangeOrganizationEmployee) => {
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
    setEmployeeList((employees) => [
      ...employees.sort((employeeA: OrgChangeOrganizationEmployee, employeeB: OrgChangeOrganizationEmployee) => {
        switch (sortColumn) {
          case 0:
            return columnSort(employeeA.givenname + employeeA.lastname, employeeB.givenname + employeeB.lastname, asc);
          case 1:
            return columnSort(employeeA.personNumber, employeeB.personNumber, asc);
          case 2:
            return columnSort(employeeA.title, employeeB.title, asc);
          case 3:
            return columnSort(employeeA.loginname, employeeB.loginname, asc);
          case 4:
            return columnSort(employeeA.newPATeam || employeeA.paTeam, employeeB.newPATeam || employeeB.paTeam, asc);
          case 5:
            return columnSort(
              employeeA.newOperationCode || employeeA.operationCode,
              employeeB.newOperationCode || employeeB.operationCode,
              asc
            );
          case 6:
            return columnSort(
              employeeA.newObjectCode || employeeA.objectCode,
              employeeB.newObjectCode || employeeB.objectCode,
              asc
            );
          case 7:
            return columnSort(
              employeeA.newActivityCode || employeeA.activityCode,
              employeeB.newActivityCode || employeeB.activityCode,
              asc
            );
          case 8:
            return columnSort(
              employeeA.newProjectCode || employeeA.projectCode,
              employeeB.newProjectCode || employeeB.projectCode,
              asc
            );
          default:
            return asc;
        }
      }),
    ]);
  }, []);

  const employeeListSearchFiltered = employeeList.filter(searchFilter(searchQuery, employeeSearchFilter));
  const startIndex = page * pageSize - pageSize;
  const employeeListRendered = employeeListSearchFiltered.slice(startIndex, startIndex + pageSize);
  const pages = Math.ceil(employeeListSearchFiltered.length / pageSize);

  //table columns n rows
  const rows: DataTableColumn[][] = employeeListRendered.map((p) => {
    const openEditModal = (p) => {
      openPersonEditorModal(p);
    };

    const { mustEdit, showFocus } = shouldEditEmployee(p);
    const focusColor = mustEdit ? 'error' : 'vattjom';

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
          <>
            {renderNewOrOld(p.newPATeam, p.paTeam)}
            <br />
            {renderNewOrOld(p.newPATeamName, p.paTeamName)}
          </>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 4)?.value,
      },
      {
        element: (
          <>
            {renderNewOrOld(p.newOperationCode, p.operationCode)}
            <br />
            {renderNewOrOld(p.newOperationName, p.operationName)}
          </>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 5)?.value,
      },
      {
        element: (
          <>
            {renderNewOrOld(p.newObjectCode, p.objectCode)}
            <br />
            {renderNewOrOld(p.newObjectName, p.objectName)}
          </>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 8)?.value,
      },
      {
        element: (
          <>
            {renderNewOrOld(p.newActivityCode, p.activityCode)}
            <br />
            {renderNewOrOld(p.newActivityName, p.activityName)}
          </>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 9)?.value,
      },
      {
        element: (
          <>
            {renderNewOrOld(p.newProjectCode, p.projectCode)}
            <br />
            {renderNewOrOld(p.newProjectName, p.projectName)}
          </>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 10)?.value,
      },
      {
        element: (
          <Button
            iconButton
            variant={!draftIsReadOnly && showFocus ? 'primary' : 'tertiary'}
            size="sm"
            color={!draftIsReadOnly && showFocus ? focusColor : undefined}
            title={`Öppna persondetaljer${mustEdit ? ', justeringar behövs' : ''}`}
            aria-label={`Öppna persondetaljer för ${p.givenname} ${p.lastname}`}
            onClick={() => openEditModal(p)}
          >
            <ListCollapse />
          </Button>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 6)?.value && user.permissions.canViewEmployeeDetails,
      },
      !draftIsReadOnly && {
        element: (
          <Checkbox
            aria-live="polite"
            aria-controls="move-people-button"
            aria-label={`${p.givenname} ${p.lastname}`}
            checked={peopleToHandle.find((x) => x.personId == p.personId) ? true : false}
            onChange={choosePersonHandler(p)}
          />
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 7)?.value && user.permissions.canEditEmployeeDetails,
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
      <div className="flex flex-wrap items-center justify-between gap-md min-h-32 mb-16">
        <h2
          id="orgchange-tabs-people-table-rowsstext"
          aria-label={`${employeeListSearchFiltered.length} personer i listan`}
          className="text-lead"
        >
          Personer &#40;{employeeListSearchFiltered.length}&#41;
        </h2>
        {!draftIsReadOnly &&
          organization.level === 6 &&
          user.permissions.canEditOrganization &&
          employeeListSearchFiltered.length > 0 && (
            <div className="flex items-center gap-8">
              <HandleMarkedContextMenu peopleToHandle={peopleToHandle} />
              <Checkbox aria-label="Välj alla personer" onChange={toggleChooseAllPeopleHandler} />
            </div>
          )}
      </div>
      {rows.length > 0 ?
        <div>
          <DataTable
            id="orgchange-tabs-people-table"
            ref={tableRef}
            highlightedItemIndex={highlightedItemIndex}
            sortHandler={sortHandler}
            changePage={setPage}
            onPageClick={() => setHighlightedTableRow({})}
            pages={pages}
            page={page}
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

      {personEditorIsOpen && selectedEmployeeDetails && user.permissions.canViewEmployeeDetails && (
        <PersonEditor
          isOpen={personEditorIsOpen}
          closeCallback={closePersonEditorModal}
          employeeDetails={selectedEmployeeDetails}
        />
      )}
    </div>
  );
};

export default PeopleInOrgChangeList;
