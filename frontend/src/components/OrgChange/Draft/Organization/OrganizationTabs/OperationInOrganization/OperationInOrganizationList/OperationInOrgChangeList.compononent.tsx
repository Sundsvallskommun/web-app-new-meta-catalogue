import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationOperation, OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { orgChangeOperationHeaders } from '@services/mdbuilder/defaults';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Pagination, useConfirm, useMessage } from '@sk-web-gui/react';
import { ZebraTable, ZebraTableColumn, ZebraTableHeader } from '@sk-web-gui/table';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useWindowSize } from '@utils/use-window-size.hook';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';

interface IOrgChangeOperationInOrgInOrgChangeListProps {
  searchQuery;
}

export const OperationInOrgChangeList = (props: IOrgChangeOperationInOrgInOrgChangeListProps) => {
  const { searchQuery } = props;
  const { showConfirmation } = useConfirm();
  const message = useMessage();

  const { highlightedTableRow, setHighlightedTableRow } = useAppContext();

  // orgchangestore
  const orgChangeOperationFilter = useOrgChangeStore((s) => s.orgChangeOperationFilter);
  const operationsByOrg = useOrgChangeStore((s) => s.operationsByOrg);
  const disconnectOperation = useOrgChangeStore((s) => s.disconnectOperation);

  // organizationstore
  const organization = useOrganizationStore((s) => s.organization) as OrgChangeOrganizationTree;
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);

  // userstore
  const user = useUserStore((s) => s.user);

  const { draftIsReadOnly } = useDraftPhaseState();

  const tableRef = useRef(null);
  const [pageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const defaultSort = { idx: 0, sortMode: true };
  const [operationList, setOperationsList] = useState<OrgChangeOrganizationOperation[]>([]);

  const highlightedItemIndex = useHighlightedTableRow(
    highlightedTableRow,
    setHighlightedTableRow,
    operationList,
    tableRef
  );

  const windowSize = useWindowSize();

  //table header
  const headers: ZebraTableHeader[] = orgChangeOperationHeaders.map((header) => ({
    element: <span className="font-bold">{header.label}</span>,
    screenReaderOnly: header.screenReaderOnly,
    isColumnSortable: header.isColumnSortable,
    isShown: orgChangeOperationFilter.find((f) => f.id === header.filterId).value,
  }));

  const handleShowInOrg = (orgId, organizationOperationId) => {
    setSelectedOrganizationId(orgId);
    setHighlightedTableRow({
      property: orgHighlightedTableRowProperty['OPERATION'],
      value: organizationOperationId,
      clickFingerPrint: new Date(),
    });
  };

  const sortHandler = useCallback((sortColumn: number, sortAscending: boolean) => {
    const asc = sortAscending ? 1 : -1;
    setOperationsList((operations) => [
      ...operations.sort((operationA: OrgChangeOrganizationOperation, operationB: OrgChangeOrganizationOperation) => {
        switch (sortColumn) {
          case 0:
            return columnSort(operationA.description, operationB.description, asc);
          case 1:
            return columnSort(operationA.operationCode, operationB.operationCode, asc);
          default:
            return asc;
        }
      }),
    ]);
  }, []);

  const operationSearchFilter = (q: string, obj: OrgChangeOrganizationOperation) => {
    if (obj.description.toLowerCase().includes(q)) {
      return true; // Titel
    } else if (obj.operationCode.toLowerCase().includes(q)) {
      return true; // operationCode
    } else {
      return false;
    }
  };

  const operationListSearchFiltered = operationList.filter(searchFilter(searchQuery, operationSearchFilter));
  const startIndex = page * pageSize - pageSize;
  const operationListRendered = operationListSearchFiltered.slice(startIndex, startIndex + pageSize);
  const pages = Math.ceil(operationListSearchFiltered.length / pageSize);

  const handleDisconnectOperation = (operation: OrgChangeOrganizationOperation) => () => {
    const title = 'Är du säker på att du vill koppla bort verksamheten?';
    const _message = `Verksamheten (${operation.description}) kommer att kopplas bort från gren ${organization.orgName} (Nivå ${organization.level})`;
    showConfirmation(title, _message, 'Ja, koppla bort', 'Avbryt').then((result) => {
      if (result === true) {
        disconnectOperation({ organizationOperationId: operation.organizationOperationId }).then((res) => {
          if (!res.error) {
            message({
              message: `Verksamheten har kopplats bort`,
              status: 'success',
            });
          } else {
            message({
              message: res?.message,
              status: 'error',
            });
          }
        });
      }
    });
  };

  //table columns n rows
  const rows: ZebraTableColumn[][] = operationListRendered.map((r) => {
    return [
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Titel: </span>
            <span className="lg:min-h-[48px] lg:flex items-center">
              {r.orgId && !organization.isLeafLevel ?
                <Button
                  variant="link"
                  className="text-body text-left"
                  onClick={() => handleShowInOrg(r.orgId, r.organizationOperationId)}
                >
                  {r.description}
                </Button>
              : <span>{r.description}</span>}
            </span>
          </Fragment>
        ),
        isShown: orgChangeOperationFilter.find((i) => i.id === 1).value,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Verksamhetskod: </span>
            <span>{r.operationCode}</span>
          </Fragment>
        ),
        isShown: orgChangeOperationFilter.find((i) => i.id === 2).value,
      },
      organization.structureChangeStatus !== 'DELETED' && {
        element: (
          <Fragment>
            <div className="lg:text-right">
              <Button
                className="text-error border-error hover:border-error hover:bg-error focus-within:bg-error focus-within:text-white"
                size="md"
                variant="outline"
                aria-label={`Koppla bort ${r.description}`}
                onClick={handleDisconnectOperation(r)}
              >
                Koppla bort
              </Button>
            </div>
          </Fragment>
        ),
        isShown:
          orgChangeOperationFilter.find((i) => i.id === 3)?.value &&
          !draftIsReadOnly &&
          user.permissions.canEditOrganization,
      },
    ];
  });

  const operationsByOrgMemo = useMemo(() => {
    return operationsByOrg;
  }, [operationsByOrg]);

  useEffect(() => {
    setOperationsList(JSON.parse(JSON.stringify(operationsByOrgMemo)) || []);
    sortHandler(defaultSort.idx, defaultSort.sortMode);
  }, [operationsByOrgMemo, sortHandler, defaultSort.idx, defaultSort.sortMode]);

  return (
    <div className="bg-white px-0 pb-16 pt-10">
      <h2
        id="orgchange-tabs-operations-table-rowsstext"
        aria-label={`${operationListSearchFiltered.length} verksamheter i listan`}
        className="table-header text-xl mx-8 px-2 border-b-2 border-grey"
      >
        Verksamheter &#40;{operationListSearchFiltered.length}&#41;
      </h2>
      {rows.length > 0 ?
        <div className={'overflow-x-auto custom-scroll'}>
          <ZebraTable
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
      : <div className="mt-sm mx-8 px-2">Inga verksamheter att visa.</div>}
    </div>
  );
};
export default OperationInOrgChangeList;
