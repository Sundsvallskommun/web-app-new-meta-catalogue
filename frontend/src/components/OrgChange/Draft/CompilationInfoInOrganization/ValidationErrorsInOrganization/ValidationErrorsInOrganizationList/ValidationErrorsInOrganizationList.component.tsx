import { Fragment } from 'react';
import { DataTable, DataTableColumn } from '@components/DataTable/DataTable.component';

export default function ValidationErrorsInOrganizationList({ errors }) {
  if (!errors) return <></>;

  const rows: DataTableColumn[][] = [
    ...errors.map((errorText) => [
      {
        element: (
          <Fragment>
            <div className="w-full flex justify-between my-sm">
              <ul className="list-outside list-disc ml-6 grid gap-y-6 text-base">
                <li className="text-error">
                  <span className="text-svartvik-800">{errorText}</span>
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
}
