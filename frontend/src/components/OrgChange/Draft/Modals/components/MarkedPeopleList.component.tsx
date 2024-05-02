import { Disclosure, ZebraTable, ZebraTableColumn, ZebraTableHeader } from '@sk-web-gui/react';
import { Fragment } from 'react';
import { OrgChangeOrganizationEmployee } from '@data-contracts/backend/data-contracts';

interface ContextColumn {
  header: string;
  element: (person: OrgChangeOrganizationEmployee) => JSX.Element;
}

interface MarkedPeopleListProps {
  peopleToHandle: OrgChangeOrganizationEmployee[];
  contextColumn?: ContextColumn;
}

export const MarkedPeopleList = ({ peopleToHandle, contextColumn }: MarkedPeopleListProps) => {
  const headers: ZebraTableHeader[] = [
    { element: <span className="font-bold">Namn</span> },
    { element: <span className="font-bold">Anställning</span> },
    ...(contextColumn ? [{ element: <span className="font-bold">Nuvarande {contextColumn.header}</span> }] : []),
  ];

  const peopleRows: ZebraTableColumn[][] = peopleToHandle.map((p) => {
    return [
      {
        element: (
          <Fragment>
            <div className="lg:w-[170px] break-words">
              <span className="inline font-bold lg:hidden">Namn: </span>
              <span className="lg:min-h-[48px] inline-flex items-center">
                <span>
                  {p.givenname} {p.lastname}
                </span>
              </span>
            </div>
          </Fragment>
        ),
        isShown: true,
      },
      {
        element: (
          <Fragment>
            <div className="lg:w-[180px] break-words">
              <span className="inline font-bold lg:hidden">Anställning: </span>
              <span>{p.title}</span>
            </div>
          </Fragment>
        ),
        isShown: true,
      },
      ...(contextColumn
        ? [
            {
              element: contextColumn.element(p),
              isShown: true,
            },
          ]
        : []),
    ];
  });

  return (
    <Disclosure
      initalOpen={peopleToHandle.length === 1}
      noMargin
      className="mt-lg"
      variant="outline"
      header={`Valda personer (${peopleToHandle.length})`}
    >
      <ZebraTable
        pageSize={4}
        captionBody=""
        captionTitle=""
        headers={headers}
        rows={peopleRows}
        tableSortable={false}
        summary=""
      />
    </Disclosure>
  );
};
