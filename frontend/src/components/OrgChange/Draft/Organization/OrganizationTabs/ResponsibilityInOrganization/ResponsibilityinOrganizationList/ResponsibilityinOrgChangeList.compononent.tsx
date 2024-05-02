import CsvExporter from '@components/CsvExporter/CsvExporter.component';
import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationTree, OrgChangeResponsibility } from '@data-contracts/backend/data-contracts';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import { getAccountStatus } from '@services/mdbuilder/data-handlers/responsibility';
import { orgChangeResponsibilityHeaders } from '@services/mdbuilder/defaults';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { responsibilityType } from '@services/mdviewer/data-handlers/responsibility';
import { orgHighlightedTableRowProperty } from '@services/mdviewer/enums/organization';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Badge, Button, Pagination, Tag } from '@sk-web-gui/react';
import { ZebraTable, ZebraTableColumn, ZebraTableHeader } from '@sk-web-gui/table';
import { columnSort } from '@utils/columnSort';
import { searchFilter } from '@utils/search';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useHighlightedTableRow } from '@utils/use-highlightedtablerow';
import { useWindowSize } from '@utils/use-window-size.hook';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ResponsibilityRenameModal from '../ResponsibilityEditor/ResponsibilityRenameModal.component';

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

  const windowSize = useWindowSize();

  const openEditModalHandler = (resp) => () => {
    setSelectedResp(resp);
    setIsOpen(true);
  };

  const onCloseHandler = () => {
    setIsOpen(false);
  };

  //table header
  const headers: ZebraTableHeader[] = orgChangeResponsibilityHeaders
    .filter((x) => (x.filterId == 7 ? user.permissions.canEditResponsibility : true))
    .map((header) => ({
      element: <span className="font-bold">{header.label}</span>,
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
          variant={windowSize.lg ? 'outline' : 'solid'}
          color={`primary`}
          className="border-0"
          iconButton={windowSize.lg || undefined}
          size="md"
          title="Öppna ansvaret"
          aria-label={`${r.description}`}
          onClick={openEditModalHandler(r)}
          leftIcon={<ModeEditOutlinedIcon className="material-icon !text-2xl" aria-hidden="true" />}
        >
          <span className="lg:hidden">Öppna ansvaret</span>
        </Button>
      );
    } else if (date < today) {
      return <div className="p-5 w-full"></div>;
    }
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
  const rows: ZebraTableColumn[][] = responsibilityListRendered.map((r) => {
    const from = new Date(r.responsibilityFromDate.toString()).toLocaleDateString('sv-SE');
    const to = new Date(r.responsibilityToDate.toString()).toLocaleDateString('sv-SE');
    const { status, dot } = getAccountStatus(r.responsibilityFromDate, r.responsibilityToDate, r.responsibilityPassive);
    const { bg: typeBg, text: typeText, border: border } = responsibilityType(r.responsibilityTypeId);

    return [
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Titel: </span>
            <span className="lg:min-h-[48px] lg:flex items-center">
              {r.orgId && !organization.isLeafLevel ?
                <Button
                  variant="link"
                  className="text-body text-left"
                  onClick={() => handleShowInOrg(r.orgId, r.responsibilityId)}
                >
                  {r.description}
                </Button>
              : <span>{r.description}</span>}
            </span>
          </Fragment>
        ),
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 1).value,
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
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 2).value,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Ansvarskod: </span>
            <span>{r.responsibilityCode}</span>
          </Fragment>
        ),
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 3).value,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Giltig från: </span>
            <span>{from}</span>
          </Fragment>
        ),
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 4).value,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Giltig till: </span>
            <span>{to}</span>
          </Fragment>
        ),
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 5).value,
      },
      {
        element: (
          <Fragment>
            <span className="inline font-bold lg:hidden">Status: </span>
            <span className="hidden lg:inline-block">
              <Badge size="sm" variant="solid" color={`${dot}`} className="mr-xs" />
            </span>
            <span>{status}</span>
          </Fragment>
        ),
        isShown: orgChangeResponsibilityFilter.find((i) => i.id === 6).value,
      },
      {
        element: <Fragment>{noEditWhenInactive(r)}</Fragment>,
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
    <div className="bg-white px-0 pb-16 pt-10">
      <div className="flex justify-between mx-8 px-2 border-b-2 border-grey">
        <h2
          id="orgchange-tabs-responsibilities-table-rowsstext"
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
      {rows.length > 0 ?
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
      : <div className="mt-sm mx-8 px-2">Inga ansvar att visa.</div>}

      {isOpen && <ResponsibilityRenameModal onClose={onCloseHandler} responsibility={selectedResp} />}
    </div>
  );
};
export default ResponsibilityinOrgChangeList;
