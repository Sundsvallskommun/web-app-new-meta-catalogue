import { ColumnFilter } from '@components/ColumnFilter/ColumnFilter.component';
import CsvExporter from '@components/CsvExporter/CsvExporter.component';
import { useAppContext } from '@contexts/app.context';
import { OrganizationResponsibility } from '@data-contracts/backend/data-contracts';
import { responsibilityType } from '@services/mdviewer/data-handlers/responsibility';
import { orgResponsibilityHeaders } from '@services/mdviewer/defaults/responsibility';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useResponsibilityStore } from '@services/mdviewer/responsibility-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Label } from '@sk-web-gui/react';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

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
  const setOrgResponsibilityFilter = useResponsibilityStore((s) => s.setOrgResponsibilityFilter);

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

  //table header
  const headers: DataTableHeader[] = orgResponsibilityHeaders.map((header) => ({
    element: header.label,
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
                responsibilityType(responsibilityA.typeOfResponsibility).text,
                responsibilityType(responsibilityB.typeOfResponsibility).text,
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
  const rows: DataTableColumn[][] = responsibilityListRendered.map((r) => {
    const from = new Date(r.responsibilityValidFrom.toString()).toLocaleDateString('sv-SE');
    const { text: typeText, color: typeColor } = responsibilityType(r.typeOfResponsibility);

    return [
      {
        element:
          r.orgId && !organization.isLeafLevel ?
            <Button variant="link" onClick={() => handleShowInOrg(r.orgId, r.orgResponsibilityId)}>
              {r.responsibilityText}
            </Button>
          : r.responsibilityText,
        isShown: orgResponsibilityFilter.find((i) => i.id === 0).value,
      },
      {
        element: (
          <Label color={typeColor} rounded inverted className="whitespace-nowrap">
            {typeText}
          </Label>
        ),
        isShown: orgResponsibilityFilter.find((i) => i.id === 1).value,
      },
      {
        element: r.responsibilityCode,
        isShown: orgResponsibilityFilter.find((i) => i.id === 2).value,
      },
      {
        element: from,
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
    <div className="bg-background-content px-0 pb-40 pt-28">
      <div className="flex mb-24">
        <ColumnFilter
          label="Visa/dölj kolumner i ansvar"
          filterData={orgResponsibilityFilter}
          onFilterChange={setOrgResponsibilityFilter}
        />
      </div>
      <div className="flex flex-wrap justify-between items-center gap-16 min-h-32 mb-16">
        <h2
          id="org-tabs-responsibilities-table-rowsstext"
          aria-label={`${responsibilityListSearchFiltered.length} ansvar i listan`}
          className="text-lead"
          data-cy="table-header"
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
      : <div className="mt-sm">Inga ansvar att visa.</div>}
    </div>
  );
};
export default ResponsibilityinOrganizationList;
