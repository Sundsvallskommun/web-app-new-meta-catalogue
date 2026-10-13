import { Disclosure } from '@sk-web-gui/react';
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
    <Disclosure initalOpen={peopleToHandle.length === 1} className="mt-lg" variant="default">
      <Disclosure.Header>
        <Disclosure.Title>{`Valda personer (${peopleToHandle.length})`}</Disclosure.Title>
        <Disclosure.Button />
      </Disclosure.Header>
      <Disclosure.Content>
        <DataTable
          pageSize={4}
          captionBody=""
          captionTitle=""
          headers={headers}
          rows={peopleRows}
          tableSortable={false}
          summary=""
        />
      </Disclosure.Content>
    </Disclosure>
  );
};
