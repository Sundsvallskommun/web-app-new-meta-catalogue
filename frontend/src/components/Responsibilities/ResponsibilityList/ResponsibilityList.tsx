import { ColumnFilter } from '@components/ColumnFilter/ColumnFilter.component';
import CsvExporter from '@components/CsvExporter/CsvExporter.component';
import { useAppContext } from '@contexts/app.context';
import { OrganizationResponsibility } from '@data-contracts/backend/data-contracts';
import { responsibilityType } from '@services/mdviewer/data-handlers/responsibility';
import { responsibilityHeaders } from '@services/mdviewer/defaults/responsibility';
import { orgHighlightedTableRowProperty, orgTabIndex } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useResponsibilityStore } from '@services/mdviewer/responsibility-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Spinner, Label } from '@sk-web-gui/react';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface IResponsibilityListProps {
  isEdit?;
  setIsEdit?;
  searchQuery?;
}

export const ResponsibilityList = (props: IResponsibilityListProps) => {
  const router = useRouter();
  const { searchQuery } = props;

  const { highlightedTableRow, setHighlightedTableRow } = useAppContext();
  const { responsibilities, responsibilitiesIsLoading, responsibilityFilter, setResponsibilityFilter } =
    useResponsibilityStore();
  const { user } = useUserStore();
  const { setSelectedOrganizationId, setOrganizationTabIndex } = useOrganizationStore();

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
  const headers: DataTableHeader[] = responsibilityHeaders
    .filter((x) => (x.filterId == 8 ? user.permissions.canEditResponsibility : true))
    .map((header) => ({
      element: header.label,
      screenReaderOnly: header.screenReaderOnly,
      isColumnSortable: header.isColumnSortable,
      isShown: responsibilityFilter.find((f) => f.id === header.filterId).value,
    }));

  const handleShowInOrg = (orgId, orgResponsibilityId) => {
    router
      .push('/')
      .then(() => {
        setSelectedOrganizationId(orgId);
      })
      .then(() => {
        setOrganizationTabIndex(orgTabIndex['RESPONSIBILITY']);
      })
      .then(() => {
        setHighlightedTableRow({
          property: orgHighlightedTableRowProperty['RESPONSIBILITY'],
          value: orgResponsibilityId,
          clickFingerPrint: new Date(),
        });
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
              return columnSort(responsibilityA.orgName, responsibilityB.orgName, asc);
            case 2:
              return columnSort(
                responsibilityType(responsibilityA.typeOfResponsibility).text,
                responsibilityType(responsibilityB.typeOfResponsibility).text,
                asc
              );
            case 3:
              return columnSort(responsibilityA.responsibilityCode, responsibilityB.responsibilityCode, asc);
            case 4:
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
    } else if (obj.orgName.toLowerCase().includes(q)) {
      return true; // orgName
    } else if (responsibilityType(obj.typeOfResponsibility).text.toLowerCase().includes(q)) {
      return true; // typeOfResponsibility
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
    const from = new Date(r.responsibilityValidFrom as string).toLocaleDateString('sv-SE');
    const { text: typeText, color: typeColor } = responsibilityType(r.typeOfResponsibility);
    return [
      {
        element: (
          <Button variant="link" onClick={() => handleShowInOrg(r.orgId, r.orgResponsibilityId)}>
            {r.responsibilityText}
          </Button>
        ),
        isShown: responsibilityFilter.filter((i) => i.id === 0)[0].value,
      },
      {
        element: (
          <>
            {r.orgName ? r.orgName : '-'}
            <br />
            {r.orgFromName ? r.orgFromName : '-'}
          </>
        ),
        isShown: responsibilityFilter.find((i) => i.id === 1).value,
      },
      {
        element: (
          <Label color={typeColor} rounded inverted className="whitespace-nowrap">
            {typeText}
          </Label>
        ),
        isShown: responsibilityFilter.find((i) => i.id === 2).value,
      },
      {
        element: r.responsibilityCode,
        isShown: responsibilityFilter.filter((i) => i.id === 3)[0].value,
      },
      {
        element: from,
        isShown: responsibilityFilter.filter((i) => i.id === 4)[0].value,
      },
    ];
  });

  const responsibilitiesMemo = useMemo(() => {
    return responsibilities;
  }, [responsibilities]);

  useEffect(() => {
    setResponsibilityList(JSON.parse(JSON.stringify(responsibilitiesMemo)) || []);
    sortHandler(defaultSort.idx, defaultSort.sortMode);
  }, [responsibilitiesMemo, sortHandler, defaultSort.idx, defaultSort.sortMode]);

  const csvHeaders: {
    label: string;
    key: keyof OrganizationResponsibility;
  }[] = [
    { label: 'Titel', key: 'responsibilityText' },
    { label: 'Ansvarskod', key: 'responsibilityCode' },
    { label: 'Ansvarstyp', key: 'typeOfResponsibility' },
    { label: 'Organisation Id', key: 'orgId' },
    { label: 'Giltig från', key: 'responsibilityValidFrom' },
    { label: 'Organisationsnamn', key: 'orgName' },
    { label: 'Namn organisationsförälder', key: 'orgFromName' },
  ];

  const csvAllResponsibility = responsibilityListSearchFiltered.map((r) => ({
    responsibilityText: r.responsibilityText,
    responsibilityCode: r.responsibilityCode,
    typeOfResponsibility: r.typeOfResponsibility,
    orgId: r.orgId,
    responsibilityValidFrom: r.responsibilityValidFrom,
    orgName: r.orgName,
    orgFromName: r.orgFromName,
  }));

  return (
    <div className="bg-background-content px-0 pb-40 pt-28">
      <div className="flex flex-wrap justify-between items-end gap-16 mb-24">
        <CsvExporter
          csvData={csvAllResponsibility}
          csvHeaders={csvHeaders}
          fileName={`allaAnsvar${searchQuery ? `_containingdata'${searchQuery}'` : ''}`}
        />
        <ColumnFilter
          label="Visa/dölj kolumner i ansvar"
          filterData={responsibilityFilter.map((x) =>
            x.id == 8 ? { ...x, isShown: user.permissions.canEditResponsibility } : x
          )}
          onFilterChange={setResponsibilityFilter}
        />
      </div>
      <h2 className="text-lead mb-16">Ansvar &#40;{responsibilityListSearchFiltered.length}&#41;</h2>
      {responsibilitiesIsLoading ?
        <div className="flex justify-center pt-lg ">
          <Spinner size={3} aria-label="Laddar ansvar" />
        </div>
      : <div>
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
      }
      {!responsibilitiesIsLoading && rows.length == 0 && (
        <div className="mt-sm">
          <span>Inga ansvar att visa.</span>
        </div>
      )}
    </div>
  );
};
export default ResponsibilityList;
