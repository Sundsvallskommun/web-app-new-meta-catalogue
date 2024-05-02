import CsvExporter from '@components/CsvExporter/CsvExporter.component';
import { useAppContext } from '@contexts/app.context';
import { OrganizationResponsibility } from '@data-contracts/backend/data-contracts';
import { responsibilityType } from '@services/mdviewer/data-handlers/responsibility';
import { orgResponsibilityHeaders } from '@services/mdviewer/defaults/responsibility';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useResponsibilityStore } from '@services/mdviewer/responsibility-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Pagination, Tag } from '@sk-web-gui/react';
import { ZebraTable, ZebraTableColumn, ZebraTableHeader } from '@sk-web-gui/table';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useWindowSize } from '@utils/use-window-size.hook';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface IResponsibilityinOrganizationListProps {
  searchQuery;
}

export const ResponsibilityinOrganizationList = (props: IResponsibilityinOrganizationListProps) => {
  const { searchQuery } = props;

  const { highlightedTableRow, setHighlightedTableRow } = useAppContext();

  // organizationstore
  const organization = useOrganizationStore((s) => s.organization);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);

  // responsibilitystore
  const responsibilitiesByOrg = useResponsibilityStore((s) => s.responsibilitiesByOrg);
  const orgResponsibilityFilter = useResponsibilityStore((s) => s.orgResponsibilityFilter);

  // userstore
  const user = useUserStore((s) => s.user);

  const tableRef = useRef(null);
  const [pageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const defaultSort = { idx: 0, sortMode: true };
  const [responsibilityList, setResponsibilityList] = useState<OrganizationResponsibility[]>([]);

  const highlightedItemIndex = useHighlightedTableRow(
    highlightedTableRow,
    setHighlightedTableRow,
    responsibilityList,
    tableRef
  );

  const windowSize = useWindowSize();

  //table header
  const headers: ZebraTableHeader[] = orgResponsibilityHeaders.map((header) => ({
    element: <span className="font-bold">{header.label}</span>,
    screenReaderOnly: header.screenReaderOnly,
    isColumnSortable: header.isColumnSortable,
    isShown: orgResponsibilityFilter.find((f) => f.id === header.filterId).value,
  }));

  const handleShowInOrg = (orgId, orgResponsibilityId) => {
    setSelectedOrganizationId(orgId);
    setHighlightedTableRow({
      property: orgHighlightedTableRowProperty['RESPONSIBILITY'],
      value: orgResponsibilityId,
      clickFingerPrint: new Date(),
    });
  };

  const sortHandler = useCallback((sortColumn: number, sortAscending: boolean) => {
    const asc = sortAscending ? 1 : -1;
    setResponsibilityList((responsibilities) => [
      ...responsibilities.sort(
        (responsibilityA: OrganizationResponsibility, responsibilityB: OrganizationResponsibility) => {
          switch (sortColumn) {
            case 0:
              return columnSort(responsibilityA.responsibilityText, responsibilityB.responsibilityText, asc);
            case 1:
              return columnSort(
                responsibilityType(responsibilityA.orgResponsibilityId).text,
                responsibilityType(responsibilityB.orgResponsibilityId).text,
                asc
              );
            case 2:
              return columnSort(responsibilityA.responsibilityCode, responsibilityB.responsibilityCode, asc);
            case 3:
              return columnSort(responsibilityA.responsibilityValidFrom, responsibilityB.responsibilityValidFrom, asc);
            default:
              return asc;
          }
        }
      ),
    ]);
  }, []);

  const responsibilitySearchFilter = (q: string, obj: OrganizationResponsibility) => {
    if (obj.responsibilityText.toLowerCase().includes(q)) {
      return true; // Titel
    } else if (obj.responsibilityCode.toLowerCase().startsWith(q)) {
      return true; // responsibilityCode
    } else {
      return false;
    }
  };

  const responsibilityListSearchFiltered = responsibilityList.filter(
    searchFilter(searchQuery, responsibilitySearchFilter)
  );
  const startIndex = page * pageSize - pageSize;
  const responsibilityListRendered = responsibilityListSearchFiltered.slice(startIndex, startIndex + pageSize);
  const pages = Math.ceil(responsibilityListSearchFiltered.length / pageSize);

  //table columns n rows
  const rows: ZebraTableColumn[][] = responsibilityListRendered.map((r) => {
    const from = new Date(r.responsibilityValidFrom.toString()).toLocaleDateString('sv-SE');
    const { bg: typeBg, text: typeText, border: border } = responsibilityType(r.typeOfResponsibility);

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
                  onClick={() => handleShowInOrg(r.orgId, r.orgResponsibilityId)}
                >
                  {r.responsibilityText}
                </Button>
              ) : (
                <span>{r.responsibilityText}</span>
              )}
            </span>
          </Fragment>
        ),
        isShown: orgResponsibilityFilter.find((i) => i.id === 0).value,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Ansvarstyp: </span>
            <span>
              <Tag variant="solid" className={`text-body ${typeBg} ${border}`}>
                {typeText}
              </Tag>
            </span>
          </Fragment>
        ),
        isShown: orgResponsibilityFilter.find((i) => i.id === 1).value,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Ansvarskod: </span>
            <span>{r.responsibilityCode}</span>
          </Fragment>
        ),
        isShown: orgResponsibilityFilter.find((i) => i.id === 2).value,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Giltig från: </span>
            <span>{from}</span>
          </Fragment>
        ),
        isShown: orgResponsibilityFilter.find((i) => i.id === 3).value,
      },
    ];
  });

  const responsibilitiesByOrgMemo = useMemo(() => {
    return responsibilitiesByOrg;
  }, [responsibilitiesByOrg]);

  useEffect(() => {
    setResponsibilityList(JSON.parse(JSON.stringify(responsibilitiesByOrgMemo)) || []);
    sortHandler(defaultSort.idx, defaultSort.sortMode);
  }, [responsibilitiesByOrgMemo, sortHandler, defaultSort.idx, defaultSort.sortMode]);

  const csvHeaders = [
    { label: 'Titel', key: 'responsibilityText' },
    { label: 'Ansvarskod', key: 'responsibilityCode' },
    { label: 'Ansvarstyp', key: 'typeOfResponsibility' },
    { label: 'Organisation Id', key: 'orgId' },
    { label: 'Giltig från', key: 'responsibilityValidFrom' },
    { label: 'Organisationsnamn', key: 'orgName' },
    { label: 'Namn organisationsförälder', key: 'orgFromName' },
  ];

  const csvResponsibility = responsibilityListSearchFiltered.map((r) => ({
    description: r.responsibilityText,
    responsibilityCode: r.responsibilityCode,
    orgResponsibilityId: r.orgResponsibilityId,
    orgId: r.orgId,
    responsibilityValidFrom: r.responsibilityValidFrom,
    orgName: r.orgName,
    orgFromName: r.orgFromName,
  }));
  return (
    <div className="bg-white px-0 pb-16 pt-10">
      <div className="lg:flex lg:justify-between mx-8 px-2 border-b-2 border-grey">
        <h2
          id="org-tabs-responsibilities-table-rowsstext"
          aria-label={`${responsibilityListSearchFiltered.length} ansvar i listan`}
          className="table-header text-xl"
        >
          Kopplade ansvar &#40;{responsibilityListSearchFiltered.length}&#41;
        </h2>
        {organization.level === 2 && user.permissions.canViewDrafts && (
          <CsvExporter
            csvData={csvResponsibility}
            csvHeaders={csvHeaders}
            fileName={`ansvar_lista_${organization.abbreviation}${
              searchQuery ? `_containingdata'${searchQuery}'` : ''
            }`}
          />
        )}
      </div>
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
        <div className="mt-sm mx-8 px-2">Inga ansvar att visa.</div>
      )}
    </div>
  );
};
export default ResponsibilityinOrganizationList;
