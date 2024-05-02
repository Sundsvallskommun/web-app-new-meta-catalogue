import { Badge, Checkbox, Pagination, ZebraTable, ZebraTableColumn, ZebraTableHeader } from '@sk-web-gui/react';
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationEmployee, OrgChangePersonEmployeeDetail } from '@data-contracts/backend/data-contracts';
import ReadMoreOutlinedIcon from '@mui/icons-material/ReadMoreOutlined';
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
import { useWindowSize } from '@utils/use-window-size.hook';
import HandleMarkedContextMenu from './HandleMarkedContextMenu.component';
import PersonEditor from './PersonEditor/PersonEditor.OrgChange.component';

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

  const windowSize = useWindowSize();

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
  const headers: ZebraTableHeader[] = employeeOrgChangeHeaders
    .filter((x) => (x.filterId == 9 ? user.permissions.canEditOrganization : true))
    .filter((x) => (x.filterId == 10 ? user.permissions.canEditOrganization : true))
    .map((header) => ({
      element: <span className="font-bold">{header.label}</span>,
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
  const rows: ZebraTableColumn[][] = employeeListRendered.map((p) => {
    const openEditModal = (p) => {
      openPersonEditorModal(p);
    };

    const { mustEdit, showFocus } = shouldEditEmployee(p);

    return [
      {
        element: (
          <Fragment>
            <div className="lg:w-[170px] break-words ">
              <span className="inline font-bold lg:hidden">Namn: </span>
              <span className="min-h-[48px] inline-flex items-center">
                {p.orgId !== undefined && p.orgId !== null && !organization.isLeafLevel ?
                  <Button
                    variant="link"
                    className="text-body text-left"
                    onClick={() => handleShowInOrgAndPerson(p.orgId, p.personId)}
                  >
                    {p.givenname} {p.lastname}
                  </Button>
                : <span>
                    {p.givenname} {p.lastname}
                  </span>
                }
              </span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 0).value,
      },
      {
        element: (
          <Fragment>
            <div className="lg:w-[95px] break-words">
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
            <div className="lg:w-[180px] break-words">
              <span className="inline font-bold lg:hidden">Anställning: </span>
              <span>{p.title}</span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 2).value,
      },
      {
        element: (
          <Fragment>
            <div className="lg:w-[115px]">
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
            <div className="lg:w-[200px]">
              <span className="inline font-bold lg:hidden">PA-Team: </span>
              <span className="lg:font-bold lg:text-sm">{renderNewOrOld(p.newPATeam, p.paTeam)}</span>
              <br />
              <span className="inline font-bold lg:hidden">PA-Team-namn: </span>
              <span className="">{renderNewOrOld(p.newPATeamName, p.paTeamName)}</span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 4)?.value,
      },
      {
        element: (
          <Fragment>
            <div>
              <span className="inline font-bold lg:hidden">Verksamhet: </span>
              <span className="lg:font-bold lg:text-sm">{renderNewOrOld(p.newOperationCode, p.operationCode)}</span>
              <br />
              <span className="inline font-bold lg:hidden">Verksamhets-namn: </span>
              <span className="">{renderNewOrOld(p.newOperationName, p.operationName)}</span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 5)?.value,
      },
      {
        element: (
          <Fragment>
            <div>
              <span className="inline font-bold lg:hidden">Objekt: </span>
              <span className="lg:font-bold lg:text-sm">{renderNewOrOld(p.newObjectCode, p.objectCode)}</span>
              <br />
              <span className="inline font-bold lg:hidden">Objekts-namn: </span>
              <span className="">{renderNewOrOld(p.newObjectName, p.objectName)}</span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 8)?.value,
      },
      {
        element: (
          <Fragment>
            <div>
              <span className="inline font-bold lg:hidden">Aktivitet: </span>
              <span className="lg:font-bold lg:text-sm">{renderNewOrOld(p.newActivityCode, p.activityCode)}</span>
              <br />
              <span className="inline font-bold lg:hidden">Aktivitets-namn: </span>
              <span className="">{renderNewOrOld(p.newActivityName, p.activityName)}</span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 9)?.value,
      },
      {
        element: (
          <Fragment>
            <div>
              <span className="inline font-bold lg:hidden">Projekt: </span>
              <span className="lg:font-bold lg:text-sm">{renderNewOrOld(p.newProjectCode, p.projectCode)}</span>
              <br />
              <span className="inline font-bold lg:hidden">Projekts-namn: </span>
              <span className="">{renderNewOrOld(p.newProjectName, p.projectName)}</span>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 10)?.value,
      },
      {
        element: (
          <Fragment>
            <div className="lg:w-[50px]">
              <Button
                variant={windowSize.lg ? 'outline' : 'solid'}
                color={`primary`}
                className="border-0"
                iconButton={windowSize.lg || undefined}
                size="md"
                title={`Öppna persondetaljer${mustEdit ? ', justeringar behövs' : ''}`}
                aria-label={`${p.givenname} ${p.lastname}`}
                onClick={() => openEditModal(p)}
                leftIcon={
                  <span className="relative">
                    <ReadMoreOutlinedIcon className="material-icon !text-2xl" aria-hidden="true" />
                    {!draftIsReadOnly && showFocus && (
                      <Badge
                        className="absolute -right-[0.5rem] top-[0.15rem]"
                        size="sm"
                        variant="solid"
                        color={mustEdit ? 'error' : 'primary'}
                        position={'super-overlap'}
                      />
                    )}
                  </span>
                }
              >
                <span className="lg:hidden">Öppna persondetaljer</span>
              </Button>
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 6)?.value && user.permissions.canEditOrganization,
      },
      !draftIsReadOnly && {
        element: (
          <Fragment>
            <div className="flex items-center justify-end">
              <span className="lg:sr-only mr-sm lg:mr-0">Välj person:</span>
              <Checkbox
                aria-live="polite"
                aria-controls="move-people-button"
                aria-label={`${p.givenname} ${p.lastname}`}
                checked={peopleToHandle.find((x) => x.personId == p.personId) ? true : false}
                onChange={choosePersonHandler(p)}
              />
            </div>
          </Fragment>
        ),
        isShown: orgEmployeeFilter.find((i) => i.id === 7)?.value && user.permissions.canEditOrganization,
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
      <div className="lg:flex lg:justify-between mx-8 px-2 border-b-2 border-grey">
        <h2
          id="orgchange-tabs-people-table-rowsstext"
          aria-label={`${employeeListSearchFiltered.length} personer i listan`}
          className="table-header text-xl"
        >
          Personer &#40;{employeeListSearchFiltered.length}&#41;
        </h2>
        {!draftIsReadOnly &&
          organization.level === 6 &&
          user.permissions.canEditOrganization &&
          employeeListSearchFiltered.length > 0 && (
            <div className="flex items-right">
              <HandleMarkedContextMenu peopleToHandle={peopleToHandle} />
              <Checkbox aria-label="Välj alla personer" onChange={toggleChooseAllPeopleHandler} />
            </div>
          )}
      </div>
      {rows.length > 0 ?
        <div className="overflow-x-auto custom-scroll">
          <ZebraTable
            id="orgchange-tabs-people-table"
            ref={tableRef}
            highlightedItemIndex={highlightedItemIndex}
            sortHandler={sortHandler}
            changePage={(page) => setPage(page)}
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
      : <div className="mt-sm mx-8 px-2">Inga personer att visa.</div>}

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
