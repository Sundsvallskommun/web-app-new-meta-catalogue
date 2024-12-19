import { useAppContext } from '@contexts/app.context';
import { Draft } from '@data-contracts/backend/data-contracts';
import { draftHeaders } from '@services/mdbuilder/defaults';
import { Spinner } from '@sk-web-gui/react';
import { ZebraTable, ZebraTableColumn, ZebraTableHeader } from '@sk-web-gui/table';
import { columnSort } from '@utils/columnSort';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useWindowSize } from '@utils/use-window-size.hook';
import dayjs from 'dayjs';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DraftContextMenu from '../../DraftContextMenu.component';
import DraftListEntryPhaseMessage from '../DraftListEntryPhaseMessage.component';
import DraftListEntryPhaseState from '../DraftListEntryPhaseState.component';
import DraftListEntryPhaseTitle from '../DraftListEntryPhaseTitle.component';

interface DraftDataListProps {
  draftData: Draft[];
  draftsIsLoading: boolean;
}

export const DraftList = (props: DraftDataListProps) => {
  const { draftData, draftsIsLoading } = props;

  const { highlightedTableRow, setHighlightedTableRow } = useAppContext();

  const tableRef = useRef(null);
  const [pageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const defaultSort = { idx: 1, sortMode: true };
  const [draftList, setDraftList] = useState<Draft[]>([]);

  const windowSize = useWindowSize();

  const highlightedItemIndex = useHighlightedTableRow(highlightedTableRow, setHighlightedTableRow, draftList, tableRef);

  //table header
  const headers: ZebraTableHeader[] = draftHeaders.map((header) => ({
    element: <span className="font-bold">{header.label}</span>,
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
  const rows: ZebraTableColumn[][] = draftList.map((d) => {
    return [
      {
        element: (
          <Fragment>
            <span className="inline-flex w-full flex-row-reverse lg:flex-row lg:items-center">
              <span className="ml-[-10px] mr-md relative">
                {!d.isArchived && <DraftContextMenu menuSide={windowSize.lg ? 'left' : 'right'} dense draft={d} />}
              </span>
              <h2 className="mt-sm text-lg leading-lg w-full flex flex-col gap-y-[.4rem]">
                <DraftListEntryPhaseTitle draft={d} />
                <div className="font-[Arial] w-full leading-[2rem] font-normal text-sm">Skapad av {d.loginname}</div>
              </h2>
            </span>
          </Fragment>
        ),
        isShown: true,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Brytdatum: </span>
            <span>{dayjs(d.cutOffDate).format('DD MMM YYYY')}</span>
          </Fragment>
        ),
        isShown: true,
      },
      {
        element: (
          <Fragment>
            <span className="lg:block lg:w-[30rem]">
              <span className="inline font-bold lg:hidden">Berör organisation: </span>
              <span>{d.nodes.length > 0 && `${d.nodes.join(', ')}, under ${d.companyName}`}</span>
            </span>
          </Fragment>
        ),
        isShown: true,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Antal ändringar: </span>
            <span>{d.changes >= 1 ? d.changes : 'Inga ändringar'}</span>
          </Fragment>
        ),
        isShown: true,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Fas: </span>
            <span>
              <DraftListEntryPhaseState draft={d} />
            </span>
          </Fragment>
        ),
        isShown: true,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Fas-status: </span>
            <DraftListEntryPhaseMessage draft={d} />
          </Fragment>
        ),
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
          <Spinner size="xl" aria-label="Hämtar Utkast" />
        </div>
      : <div className="min-h-[400px]">
          <ZebraTable
            ref={tableRef}
            highlightedItemIndex={highlightedItemIndex}
            sortHandler={sortHandler}
            changePage={(page) => setPage(page)}
            page={page}
            pages={Math.ceil(rows.length / pageSize)}
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
