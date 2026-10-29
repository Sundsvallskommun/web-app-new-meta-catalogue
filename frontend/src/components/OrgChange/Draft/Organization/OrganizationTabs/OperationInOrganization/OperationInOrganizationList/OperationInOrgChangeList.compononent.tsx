import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationOperation, OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { orgChangeOperationHeaders } from '@services/mdbuilder/defaults';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, useConfirm, useSnackbar } from '@sk-web-gui/react';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

interface IOrgChangeOperationInOrgInOrgChangeListProps {
  searchQuery;
}

export const OperationInOrgChangeList = (props: IOrgChangeOperationInOrgInOrgChangeListProps) => {
  const { searchQuery } = props;
  const { showConfirmation } = useConfirm();
  const message = useSnackbar();

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

  //table header
  const headers: DataTableHeader[] = orgChangeOperationHeaders
    .filter((x) => (x.filterId == 3 ? user.permissions.canEditOperation : true))
    .map((header) => ({
      element: header.label,
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
  const rows: DataTableColumn[][] = operationListRendered.map((r) => {
    return [
      {
        element:
          r.orgId && !organization.isLeafLevel ?
            <Button variant="link" onClick={() => handleShowInOrg(r.orgId, r.organizationOperationId)}>
              {r.description}
            </Button>
          : r.description,
        isShown: orgChangeOperationFilter.find((i) => i.id === 1).value,
      },
      {
        element: r.operationCode,
        isShown: orgChangeOperationFilter.find((i) => i.id === 2).value,
      },
      organization.structureChangeStatus !== 'DELETED' && {
        element: (
          <Button
            color="error"
            size="sm"
            variant="tertiary"
            aria-label={`Koppla bort ${r.description}`}
            onClick={handleDisconnectOperation(r)}
          >
            Koppla bort
          </Button>
        ),
        isShown:
          orgChangeOperationFilter.find((i) => i.id === 3)?.value &&
          !draftIsReadOnly &&
          user.permissions.canEditOrganization,
        alignEnd: true,
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
    <div className="bg-background-content px-0 pb-40 pt-24">
      <h2
        id="orgchange-tabs-operations-table-rowsstext"
        aria-label={`${operationListSearchFiltered.length} verksamheter i listan`}
        className="flex items-center min-h-32 text-lead mb-16"
      >
        Verksamheter &#40;{operationListSearchFiltered.length}&#41;
      </h2>
      {rows.length > 0 ?
        <div>
          <DataTable
            ref={tableRef}
            highlightedItemIndex={highlightedItemIndex}
            sortHandler={sortHandler}
            changePage={(page) => {
              setPage(page);
              setHighlightedTableRow({});
            }}
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
      : <div className="mt-sm">Inga verksamheter att visa.</div>}
    </div>
  );
};
export default OperationInOrgChangeList;
