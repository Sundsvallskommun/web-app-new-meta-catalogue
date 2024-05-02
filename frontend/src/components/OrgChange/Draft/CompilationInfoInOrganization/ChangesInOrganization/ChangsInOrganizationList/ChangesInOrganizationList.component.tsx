import { ZebraTable, ZebraTableColumn } from '@sk-web-gui/react';
import { Fragment } from 'react';

export const ChangesInOrganizationList = ({ changesTexts }) => {
  if (!changesTexts) return <></>;

  const rows: ZebraTableColumn[][] = [
    ...changesTexts.map((change) => [
      {
        element: (
          <Fragment>
            <div className="w-full flex justify-between my-sm">
              <ul className="list-outside list-disc ml-6 grid gap-y-6 text-base">
                <li className="text-warning">
                  <span className="text-svartvik-800">{change}</span>
                </li>
              </ul>
            </div>
          </Fragment>
        ),
        isShown: true,
      },
    ]),
  ];
  return <ZebraTable rows={rows} tableSortable={true} summary="" headers={[]} />;
};
