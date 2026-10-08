import { Pagination, SortMode, Table } from '@sk-web-gui/react';
import React, { forwardRef, useEffect, useState } from 'react';

export interface DataTableHeader {
  element: React.JSX.Element;
  isColumnSortable?: boolean;
  isShown?: boolean;
  screenReaderOnly?: boolean;
}

export interface DataTableColumn {
  element: React.JSX.Element;
  isShown?: boolean;
}

interface DataTableProps extends React.ComponentPropsWithoutRef<'table'> {
  headers: DataTableHeader[];
  rows: DataTableColumn[][];
  tableSortable?: boolean;
  sortHandler?: (sortIndex: number, sortAscending: boolean) => void;
  defaultSort?: { idx: number; sortMode: boolean };
  /** @default 5 */
  pageSize?: number;
  /** Current page. With `pages={0}` the parent paginates `rows` itself and controls `page`. */
  page?: number;
  pages?: number;
  changePage?: (page: number) => void;
  captionTitle?: string;
  captionBody?: string;
  /** Index in the whole (unpaginated) list */
  highlightedItemIndex?: number;
}

export const DataTable = forwardRef<HTMLTableElement, DataTableProps>((props, ref) => {
  const {
    headers,
    rows,
    tableSortable = true,
    sortHandler,
    defaultSort = { idx: 0, sortMode: true },
    pageSize = 5,
    page = 1,
    pages,
    changePage,
    captionTitle,
    captionBody,
    highlightedItemIndex,
    ...rest
  } = props;

  const externalPagination = pages === 0;
  const [sortIndex, setSortIndex] = useState(defaultSort.idx);
  const [sortAscending, setSortAscending] = useState(defaultSort.sortMode);
  const [internalPage, setInternalPage] = useState(page);

  const currentPage = externalPagination ? page : internalPage;
  const pageCount = externalPagination ? 1 : Math.max(1, Math.ceil(rows.length / pageSize));
  const activePage = Math.min(currentPage, pageCount);
  const shownRows = externalPagination ? rows : rows.slice((activePage - 1) * pageSize, activePage * pageSize);

  useEffect(() => {
    sortHandler?.(sortIndex, sortAscending);
  }, [sortIndex, sortAscending, sortHandler]);

  useEffect(() => {
    setInternalPage(page);
  }, [page]);

  useEffect(() => {
    if (highlightedItemIndex !== undefined) {
      const itemPage = Math.floor(highlightedItemIndex / pageSize) + 1;
      if (externalPagination) {
        changePage?.(itemPage);
      } else {
        setInternalPage(itemPage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedItemIndex]);

  const handleChangePage = (newPage: number) => {
    setInternalPage(newPage);
    changePage?.(newPage);
  };

  const handleSort = (idx: number) => {
    setSortAscending(sortIndex === idx ? !sortAscending : true);
    setSortIndex(idx);
  };

  const isHighlighted = (rowIndex: number) =>
    highlightedItemIndex !== undefined &&
    Math.floor(highlightedItemIndex / pageSize) + 1 === activePage &&
    highlightedItemIndex % pageSize === rowIndex;

  if (rows.length === 0) {
    return null;
  }

  return (
    <>
      <Table ref={ref} {...rest}>
        {captionTitle && (
          <caption className="text-left">
            {captionTitle}, sida {activePage} av {pageCount}.
            {captionBody && (
              <>
                <br />
                <small>{captionBody}</small>
              </>
            )}
          </caption>
        )}
        <Table.Header>
          {headers.map(({ element, isColumnSortable = true, isShown = true, screenReaderOnly }, idx) =>
            isShown ?
              <Table.HeaderColumn
                key={`header-${idx}`}
                scope="col"
                aria-sort={
                  sortIndex === idx ?
                    sortAscending ?
                      'ascending'
                    : 'descending'
                  : 'none'
                }
              >
                {tableSortable && isColumnSortable ?
                  <Table.SortButton
                    isActive={sortIndex === idx}
                    sortOrder={sortAscending ? SortMode.ASC : SortMode.DESC}
                    aria-description={sortIndex === idx ? undefined : 'sortera'}
                    onClick={() => handleSort(idx)}
                  >
                    {element}
                  </Table.SortButton>
                : <span className={screenReaderOnly ? 'sr-only' : undefined}>{element}</span>}
              </Table.HeaderColumn>
            : null
          )}
        </Table.Header>
        <Table.Body>
          {shownRows.map((cols, rowIndex) => (
            <Table.Row key={`row-${rowIndex}`} className={isHighlighted(rowIndex) ? 'highlighted' : undefined}>
              {cols.map(({ element, isShown = true }, colIndex) =>
                isShown ? <Table.Column key={`col-${colIndex}`}>{element}</Table.Column> : null
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {!externalPagination && pageCount > 1 && (
        <Pagination pages={pageCount} activePage={activePage} changePage={handleChangePage} />
      )}
    </>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
