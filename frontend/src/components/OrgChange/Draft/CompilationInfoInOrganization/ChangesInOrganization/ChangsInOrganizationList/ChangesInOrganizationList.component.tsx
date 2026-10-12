import { Fragment } from 'react';
import { DataTable, DataTableColumn } from '@components/DataTable/DataTable.component';

export const ChangesInOrganizationList = ({ changesTexts }) => {
  if (!changesTexts) return <></>;

  const rows: DataTableColumn[][] = [
    ...changesTexts.map((change) => [
      {
        element: (
          <Fragment>
            <div className="w-full flex justify-between my-sm">
              <ul className="list-outside list-disc ml-6 grid gap-y-6 text-base">
                <li className="text-warning">
                  <span className="text-dark-primary">{change}</span>
                </li>
              </ul>
            </div>
          </Fragment>
        ),
        isShown: true,
      },
    ]),
  ];
  return <DataTable rows={rows} tableSortable={true} summary="" headers={[]} />;
};
