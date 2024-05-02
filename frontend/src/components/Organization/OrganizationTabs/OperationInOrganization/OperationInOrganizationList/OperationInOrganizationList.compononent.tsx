import { useAppContext } from '@contexts/app.context';
import { OrgOperation } from '@data-contracts/backend/data-contracts';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { orgOperationHeaders } from '@services/mdviewer/defaults/operation';
import { useOperationStore } from '@services/mdviewer/operation-service';
import { Button, Pagination } from '@sk-web-gui/react';
import { ZebraTable, ZebraTableColumn, ZebraTableHeader } from '@sk-web-gui/table';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useWindowSize } from '@utils/use-window-size.hook';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

  const windowSize = useWindowSize();

  //table header
  const headers: ZebraTableHeader[] = orgOperationHeaders.map((header) => ({
    element: <span className="font-bold">{header.label}</span>,
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
  const rows: ZebraTableColumn[][] = operationListRendered.map((r) => {
    return [
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Titel: </span>
            <span className="lg:min-h-[48px] lg:flex items-center">
              {r.orgId && !organization.isLeafLevel ? (
                <Button
                  variant="link"
                  className="text-body text-left"
                  onClick={() => handleShowInOrg(r.orgId, r.orgOperationId)}
                >
                  {r.operationDescription}
                </Button>
              ) : (
                <span>{r.operationDescription}</span>
              )}
            </span>
          </Fragment>
        ),
        isShown: orgOperationFilter.find((i) => i.id === 1).value,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Verksamhetskod: </span>
            <span>{r.operationCode}</span>
          </Fragment>
        ),
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
    <div className="bg-white px-0 pb-16 pt-10">
      <h2
        id="org-tabs-operations-table-rowsstext"
        aria-label={`${operationListSearchFiltered.length} verksamheter i listan`}
        className="table-header text-xl mx-8 px-2 border-b-2 border-grey"
      >
        Verksamheter &#40;{operationListSearchFiltered.length}&#41;
      </h2>
      {rows.length > 0 ? (
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
      ) : (
        <div className="mt-sm mx-8 px-2">Inga verksamheter att visa.</div>
      )}
    </div>
  );
};
export default OperationInOrgChangeList;
