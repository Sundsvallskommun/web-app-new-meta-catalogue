import { OrgChangeOrganizationEmployee } from '@data-contracts/backend/data-contracts';
import { DataTable, DataTableColumn, DataTableHeader } from '@components/DataTable/DataTable.component';

interface ContextColumn {
  header: string;
  element: (person: OrgChangeOrganizationEmployee) => React.JSX.Element;
}

interface MarkedPeopleListProps {
  peopleToHandle: OrgChangeOrganizationEmployee[];
  contextColumn?: ContextColumn;
}

export const MarkedPeopleList = ({ peopleToHandle, contextColumn }: MarkedPeopleListProps) => {
  const headers: DataTableHeader[] = [
    { element: 'Namn' },
    { element: 'Anställning' },
    ...(contextColumn ? [{ element: `Nuvarande ${contextColumn.header}` }] : []),
  ];

  const peopleRows: DataTableColumn[][] = peopleToHandle.map((p) => {
    return [
      {
        element: `${p.givenname} ${p.lastname}`,
        isShown: true,
      },
      {
        element: p.title,
        isShown: true,
      },
      ...(contextColumn ?
        [
          {
            element: contextColumn.element(p),
            isShown: true,
          },
        ]
      : []),
    ];
  });

  return (
    <section className="flex flex-col gap-8">
      <h3 className="text-lead">{`Valda personer (${peopleToHandle.length})`}</h3>
      <DataTable
        pageSize={4}
        captionBody=""
        captionTitle=""
        headers={headers}
        rows={peopleRows}
        tableSortable={false}
        summary=""
      />
    </section>
  );
};
