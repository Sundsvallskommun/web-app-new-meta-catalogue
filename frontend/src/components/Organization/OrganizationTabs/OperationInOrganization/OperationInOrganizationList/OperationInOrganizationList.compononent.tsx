import { useAppContext } from '@contexts/app.context';
import { OrgOperation } from '@data-contracts/backend/data-contracts';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { orgOperationHeaders } from '@services/mdviewer/defaults/operation';
import { useOperationStore } from '@services/mdviewer/operation-service';
import { Button } from '@sk-web-gui/react';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

interface IOperationInOrganizationListProps {
  searchQuery;
}

export const OperationInOrgChangeList = (props: IOperationInOrganizationListProps) => {
  const { searchQuery } = props;

  const { highlightedTableRow, setHighlightedTableRow } = useAppContext();

  // operationstore
  const operationsByOrg = useOperationStore((s) => s.operationsByOrg);
  const orgOperationFilter = useOperationStore((s) => s.orgOperationFilter);

  // organizationstore
  const organization = useOrganizationStore((s) => s.organization);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);

  const tableRef = useRef(null);
  const [pageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const defaultSort = { idx: 0, sortMode: true };
  const [operationList, setOperationsList] = useState<OrgOperation[]>([]);

  const highlightedItemIndex = useHighlightedTableRow(
    highlightedTableRow,
    setHighlightedTableRow,
    operationList,
    tableRef
  );

  //table header
  const headers: DataTableHeader[] = orgOperationHeaders.map((header) => ({
    element: header.label,
    screenReaderOnly: header.screenReaderOnly,
    isColumnSortable: header.isColumnSortable,
    isShown: orgOperationFilter.find((f) => f.id === header.filterId).value,
  }));

  const handleShowInOrg = (orgId, orgOperationId) => {
    setSelectedOrganizationId(orgId);
    setHighlightedTableRow({
      property: orgHighlightedTableRowProperty['OPERATION'],
      value: orgOperationId,
      clickFingerPrint: new Date(),
    });
  };

  const sortHandler = useCallback((sortColumn: number, sortAscending: boolean) => {
    const asc = sortAscending ? 1 : -1;
    setOperationsList((operations) => [
      ...operations.sort((operationA: OrgOperation, operationB: OrgOperation) => {
        switch (sortColumn) {
          case 0:
            return columnSort(operationA.operationDescription, operationB.operationDescription, asc);
          case 1:
            return columnSort(operationA.operationCode, operationB.operationCode, asc);
          default:
            return asc;
        }
      }),
    ]);
  }, []);

  const operationSearchFilter = (q: string, obj: OrgOperation) => {
    if (obj.operationDescription.toLowerCase().includes(q)) {
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

  //table columns n rows
  const rows: DataTableColumn[][] = operationListRendered.map((r) => {
    return [
      {
        element:
          r.orgId && !organization.isLeafLevel ?
            <Button variant="link" onClick={() => handleShowInOrg(r.orgId, r.orgOperationId)}>
              {r.operationDescription}
            </Button>
          : r.operationDescription,
        isShown: orgOperationFilter.find((i) => i.id === 1).value,
      },
      {
        element: r.operationCode,
        isShown: orgOperationFilter.find((i) => i.id === 2).value,
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
        id="org-tabs-operations-table-rowsstext"
        aria-label={`${operationListSearchFiltered.length} verksamheter i listan`}
        className="flex items-center min-h-32 text-lead mb-16"
        data-cy="table-header"
      >
        Verksamheter &#40;{operationListSearchFiltered.length}&#41;
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
      : <div className="mt-sm">Inga verksamheter att visa.</div>}
    </div>
  );
};
export default OperationInOrgChangeList;
