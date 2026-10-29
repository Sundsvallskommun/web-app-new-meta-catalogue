import { Pagination, SortMode, Table, cx } from '@sk-web-gui/react';
import React, { forwardRef, useEffect, useState } from 'react';

export interface DataTableHeader {
  element: React.ReactNode;
  isColumnSortable?: boolean;
  isShown?: boolean;
  screenReaderOnly?: boolean;
}

export interface DataTableColumn {
  element: React.ReactNode;
  isShown?: boolean;
  /** Lets a popup in the cell (e.g. a row menu in the last column) open outside the table instead of being clipped */
  allowOverflow?: boolean;
  /** Places the cell content at the right edge of the cell */
  alignEnd?: boolean;
}

interface DataTableProps extends React.ComponentPropsWithoutRef<'table'> {
  headers: DataTableHeader[];
  rows: DataTableColumn[][];
  tableSortable?: boolean;
  sortHandler?: (sortIndex: number, sortAscending: boolean) => void;
  defaultSort?: { idx: number; sortMode: boolean };
  /** @default 5 */
  pageSize?: number;
  /** Current page */
  page?: number;
  /** Page count when the parent paginates `rows` itself and controls `page` */
  pages?: number;
  changePage?: (page: number) => void;
  /** Called only when the user picks a page, not when the table jumps to the highlighted row */
  onPageClick?: (page: number) => void;
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
    onPageClick,
    captionTitle,
    captionBody,
    highlightedItemIndex,
    ...rest
  } = props;

  const externalPagination = pages !== undefined;
  const [sortIndex, setSortIndex] = useState(defaultSort.idx);
  const [sortAscending, setSortAscending] = useState(defaultSort.sortMode);
  const [internalPage, setInternalPage] = useState(page);

  const currentPage = externalPagination ? page : internalPage;
  const pageCount = externalPagination ? pages : Math.max(1, Math.ceil(rows.length / pageSize));
  const activePage = Math.min(currentPage, Math.max(1, pageCount));
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
    onPageClick?.(newPage);
  };

  const handleSort = (idx: number) => {
    setSortAscending(sortIndex === idx ? !sortAscending : true);
    setSortIndex(idx);
  };

  const getAriaSort = (idx: number) => {
    if (sortIndex !== idx) return 'none';
    return sortAscending ? 'ascending' : 'descending';
  };

  const getHeaderContent = ({ element, isColumnSortable = true, screenReaderOnly }: DataTableHeader, idx: number) => {
    if (tableSortable && isColumnSortable) {
      return (
        <Table.SortButton
          isActive={sortIndex === idx}
          sortOrder={sortAscending ? SortMode.ASC : SortMode.DESC}
          onClick={() => handleSort(idx)}
        >
          {element}
        </Table.SortButton>
      );
    }
    return screenReaderOnly ? <span className="sr-only">{element}</span> : element;
  };

  const isHighlighted = (rowIndex: number) =>
    highlightedItemIndex !== undefined &&
    Math.floor(highlightedItemIndex / pageSize) + 1 === activePage &&
    highlightedItemIndex % pageSize === rowIndex;

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table ref={ref} background scrollable="x" {...rest}>
      {captionTitle && (
        <caption className="sr-only">
          {captionTitle}, sida {activePage} av {pageCount}.{captionBody && ` ${captionBody}`}
        </caption>
      )}
      <Table.Header>
        {headers.map((header, idx) =>
          (header.isShown ?? true) ?
            // relative keeps sr-only text inside the horizontal scroll instead of widening the page
            <Table.HeaderColumn key={`header-${idx}`} className="relative" aria-sort={getAriaSort(idx)}>
              {getHeaderContent(header, idx)}
            </Table.HeaderColumn>
          : null
        )}
      </Table.Header>
      <Table.Body>
        {shownRows.map((cols, rowIndex) => (
          <Table.Row
            key={`row-${rowIndex}`}
            className={isHighlighted(rowIndex) ? 'bg-vattjom-background-200' : undefined}
          >
            {cols.map(({ element, isShown = true, allowOverflow = false, alignEnd = false }, colIndex) =>
              isShown ?
                <Table.Column
                  key={`col-${colIndex}`}
                  className={cx(!allowOverflow && 'relative', alignEnd && 'justify-end')}
                >
                  {element}
                </Table.Column>
              : null
            )}
          </Table.Row>
        ))}
      </Table.Body>
      {pageCount > 1 && (
        <Table.Footer>
          <div className="sk-table-bottom-section-spacer"></div>
          <div className="sk-table-paginationwrapper">
            <Pagination
              className="sk-table-pagination"
              pagesBefore={1}
              pagesAfter={1}
              pages={pageCount}
              activePage={activePage}
              changePage={handleChangePage}
              showConstantPages
              fitContainer
            />
          </div>
          <div className="sk-table-bottom-section-spacer"></div>
        </Table.Footer>
      )}
    </Table>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
