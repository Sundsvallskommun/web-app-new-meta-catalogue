import { useAppContext } from '@contexts/app.context';
import { Draft } from '@data-contracts/backend/data-contracts';
import { draftHeaders } from '@services/mdbuilder/defaults';
import { Spinner } from '@sk-web-gui/react';
import { columnSort } from '@utils/columnSort';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DraftContextMenu from '../../DraftContextMenu.component';
import DraftListEntryPhaseMessage from '../DraftListEntryPhaseMessage.component';
import DraftListEntryPhaseState from '../DraftListEntryPhaseState.component';
import DraftListEntryPhaseTitle from '../DraftListEntryPhaseTitle.component';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

interface DraftDataListProps {
  draftData: Draft[];
  draftsIsLoading: boolean;
}

export const DraftList = (props: DraftDataListProps) => {
  const { draftData, draftsIsLoading } = props;

  const { highlightedTableRow, setHighlightedTableRow } = useAppContext();

  const tableRef = useRef(null);
  const [pageSize] = useState<number>(10);
  const defaultSort = { idx: 1, sortMode: true };
  const [draftList, setDraftList] = useState<Draft[]>([]);

  const highlightedItemIndex = useHighlightedTableRow(highlightedTableRow, setHighlightedTableRow, draftList, tableRef);

  //table header
  const headers: DataTableHeader[] = draftHeaders.map((header) => ({
    element: <span className="whitespace-nowrap">{header.label}</span>,
    screenReaderOnly: header.screenReaderOnly,
    isColumnSortable: header.isColumnSortable,
    isShown: true,
  }));

  const sortHandler = useCallback((sortColumn: number, sortAscending: boolean) => {
    const asc = sortAscending ? 1 : -1;
    setDraftList((draftData) => [
      ...draftData.sort((draftA: Draft, draftB: Draft) => {
        switch (sortColumn) {
          case 0:
            return columnSort(draftA.name, draftB.name, asc);
          case 1:
            return columnSort(draftA.cutOffDate, draftB.cutOffDate, asc);
          case 2:
            return columnSort(draftA.nodes[0], draftB.nodes[0], asc);
          case 3:
            return columnSort(draftA.changes, draftB.changes, asc);
          case 4:
            return columnSort(draftA.phase, draftB.phase, asc);
          default:
            return asc;
        }
      }),
    ]);
  }, []);

  //table columns n rows
  const rows: DataTableColumn[][] = draftList.map((d) => {
    return [
      {
        element: (
          <div>
            <DraftListEntryPhaseTitle draft={d} />
            <div className="text-small">Skapad av {d.loginname}</div>
          </div>
        ),
        isShown: true,
      },
      {
        element: dayjs(d.cutOffDate).format('DD MMM YYYY'),
        isShown: true,
      },
      {
        element: d.nodes.length > 0 && `${d.nodes.join(', ')}, under ${d.companyName}`,
        isShown: true,
      },
      {
        element: d.changes >= 1 ? d.changes : 'Inga ändringar',
        isShown: true,
      },
      {
        element: <DraftListEntryPhaseState draft={d} />,
        isShown: true,
      },
      {
        element: <DraftListEntryPhaseMessage draft={d} />,
        isShown: true,
      },
      {
        element: !d.isArchived && <DraftContextMenu dense draft={d} />,
        isShown: true,
      },
    ];
  });

  const draftDataMemo = useMemo(() => {
    return draftData;
  }, [draftData]);

  useEffect(() => {
    setDraftList(JSON.parse(JSON.stringify(draftDataMemo)) || []);
  }, [draftDataMemo, sortHandler, defaultSort.idx, defaultSort.sortMode]);

  return (
    <div>
      {draftsIsLoading ?
        <div className="flex w-full min-h-[400px] justify-center align-middle items-center">
          <Spinner size={3} aria-label="Hämtar Utkast" />
        </div>
      : <div className="min-h-[400px]">
          <DataTable
            ref={tableRef}
            highlightedItemIndex={highlightedItemIndex}
            sortHandler={sortHandler}
            pageSize={pageSize}
            defaultSort={defaultSort}
            captionBody=""
            headers={headers}
            rows={rows}
            tableSortable={true}
            summary=""
          />
        </div>
      }
    </div>
  );
};
export default DraftList;
