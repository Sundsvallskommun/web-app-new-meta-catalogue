import CsvExporter from '@components/CsvExporter/CsvExporter.component';
import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationTree, OrgChangeResponsibility } from '@data-contracts/backend/data-contracts';
import { Pencil } from 'lucide-react';
import { getAccountStatus } from '@services/mdbuilder/data-handlers/responsibility';
import { orgChangeResponsibilityHeaders } from '@services/mdbuilder/defaults';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { responsibilityType } from '@services/mdviewer/data-handlers/responsibility';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Badge, Button, Label } from '@sk-web-gui/react';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ResponsibilityEditModal from '../ResponsibilityEditor/ResponsibilityEditModal.component';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

interface IResponsibilityinOrgChangeListProps {
  searchQuery;
}

export const ResponsibilityinOrgChangeList = (props: IResponsibilityinOrgChangeListProps) => {
  const { searchQuery } = props;

  const { highlightedTableRow, setHighlightedTableRow } = useAppContext();
  const organization = useOrganizationStore((s) => s.organization) as OrgChangeOrganizationTree;
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);

  const orgChangeResponsibilityFilter = useOrgChangeStore((s) => s.orgChangeResponsibilityFilter);
  const responsibilitiesByOrg = useOrgChangeStore((s) => s.responsibilitiesByOrg);
  const { draftIsReadOnly } = useDraftPhaseState();

  const user = useUserStore((s) => s.user);

  const tableRef = useRef(null);
  const [pageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const defaultSort = { idx: 0, sortMode: true };
  const [responsibilityList, setResponsibilityList] = useState<OrgChangeResponsibility[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedResp, setSelectedResp] = useState<OrgChangeResponsibility>();

  const highlightedItemIndex = useHighlightedTableRow(
    highlightedTableRow,
    setHighlightedTableRow,
    responsibilityList,
    tableRef
  );

  const openEditModalHandler = (resp) => () => {
    setSelectedResp(resp);
    setIsOpen(true);
  };

  const onCloseHandler = () => {
    setIsOpen(false);
  };

  //table header
  const headers: DataTableHeader[] = orgChangeResponsibilityHeaders
    .filter((x) => (x.filterId == 7 ? user.permissions.canEditResponsibility : true))
    .map((header) => ({
      element: header.label,
      screenReaderOnly: header.screenReaderOnly,
      isColumnSortable: header.isColumnSortable,
      isShown: orgChangeResponsibilityFilter.find((f) => f.id === header.filterId).value,
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
      ...responsibilities.sort((responsibilityA: OrgChangeResponsibility, responsibilityB: OrgChangeResponsibility) => {
        switch (sortColumn) {
          case 0:
            return columnSort(responsibilityA.description, responsibilityB.description, asc);
          case 1:
            return columnSort(
              responsibilityType(responsibilityA.responsibilityTypeId).text,
              responsibilityType(responsibilityB.responsibilityTypeId).text,
              asc
            );
          case 2:
            return columnSort(responsibilityA.responsibilityCode, responsibilityB.responsibilityCode, asc);
          case 3:
            return columnSort(responsibilityA.responsibilityFromDate, responsibilityB.responsibilityFromDate, asc);
          case 4:
            return columnSort(responsibilityA.responsibilityToDate, responsibilityB.responsibilityToDate, asc);
          case 5:
            return columnSort(
              getAccountStatus(
                responsibilityA.responsibilityFromDate,
                responsibilityA.responsibilityToDate,
                responsibilityA.responsibilityPassive
              ).status,
              getAccountStatus(
                responsibilityB.responsibilityFromDate,
                responsibilityB.responsibilityToDate,
                responsibilityB.responsibilityPassive
              ).status,
              asc
            );
          default:
            return asc;
        }
      }),
    ]);
  }, []);

  const noEditWhenInactive = (r: OrgChangeResponsibility) => {
    const validTo = r.responsibilityToDate.toString();
    const today = new Date().toLocaleDateString('sv-SE');
    const date = new Date(validTo).toLocaleDateString('sv-SE');
    if ((date >= today && !draftIsReadOnly) || organization.structureChangeStatus !== 'DELETED') {
      return (
        <Button
          iconButton
          variant="tertiary"
          size="sm"
          title="Öppna ansvaret"
          aria-label={`Öppna ansvaret ${r.description}`}
          onClick={openEditModalHandler(r)}
        >
          <Pencil />
        </Button>
      );
    }
    return null;
  };

  const responsibilitySearchFilter = (q: string, obj: OrgChangeResponsibility) => {
    if (obj.description.toLowerCase().includes(q)) {
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
    const from = new Date(r.responsibilityFromDate.toString()).toLocaleDateString('sv-SE');
    const to = new Date(r.responsibilityToDate.toString()).toLocaleDateString('sv-SE');
    const { status, dot } = getAccountStatus(r.responsibilityFromDate, r.responsibilityToDate, r.responsibilityPassive);
    const { text: typeText, color: typeColor } = responsibilityType(r.responsibilityTypeId);

    return [
      {
        element:
          r.orgId && !organization.isLeafLevel ?
            <Button variant="link" onClick={() => handleShowInOrg(r.orgId, r.responsibilityId)}>
              {r.description}
            </Button>
          : r.description,
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 1).value,
      },
      {
        element: (
          <Label color={typeColor} rounded inverted>
            {typeText}
          </Label>
        ),
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 2).value,
      },
      {
        element: r.responsibilityCode,
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 3).value,
      },
      {
        element: from,
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 4).value,
      },
      {
        element: to,
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 5).value,
      },
      {
        element: (
          <>
            <Badge size="sm" color={dot} /> {status}
          </>
        ),
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 6).value,
      },
      {
        element: noEditWhenInactive(r),
        isShown:
          orgChangeResponsibilityFilter.find((i) => i.id === 7).value &&
          !draftIsReadOnly &&
          user.permissions.canEditResponsibility,
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

  const csvHeaders: {
    label: string;
    key: keyof OrgChangeResponsibility;
  }[] = [
    { label: 'Titel', key: 'description' },
    { label: 'Ansvarskod', key: 'responsibilityCode' },
    { label: 'Ansvarstyp', key: 'responsibilityTypeId' },
    { label: 'Organisation Id', key: 'orgId' },
    { label: 'Giltig från', key: 'responsibilityFromDate' },
    { label: 'Giltig till', key: 'responsibilityToDate' },
    { label: 'Passiv', key: 'responsibilityPassive' },
  ];

  const csvResponsibility = responsibilityListSearchFiltered.map((r) => ({
    description: r.description,
    responsibilityCode: r.responsibilityCode,
    responsibilityTypeId: r.responsibilityTypeId,
    orgId: r.orgId,
    responsibilityFromDate: r.responsibilityFromDate,
    responsibilityToDate: r.responsibilityToDate,
    responsibilityPassive: r.responsibilityPassive,
  }));
  return (
    <div className="bg-background-content px-0 pb-40 pt-24">
      <div className="flex justify-between mx-20 mb-16">
        <h2
          id="orgchange-tabs-responsibilities-table-rowsstext"
          aria-label={`${responsibilityListSearchFiltered.length} ansvar i listan`}
          className="text-lead"
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
        <div className="mx-20">
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
      : <div className="mt-sm mx-20 px-5">Inga ansvar att visa.</div>}

      {isOpen && <ResponsibilityEditModal onClose={onCloseHandler} responsibility={selectedResp} />}
    </div>
  );
};
export default ResponsibilityinOrgChangeList;
