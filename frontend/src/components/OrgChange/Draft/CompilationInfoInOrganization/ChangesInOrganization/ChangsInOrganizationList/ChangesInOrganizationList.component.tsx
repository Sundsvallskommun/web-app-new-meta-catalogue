import { DataTable, DataTableColumn } from '@components/DataTable/DataTable.component';

export const ChangesInOrganizationList = ({ changesTexts }) => {
  if (!changesTexts) return <></>;

  const rows: DataTableColumn[][] = [
    ...changesTexts.map((change) => [
      {
        element: change,
        isShown: true,
      },
    ]),
  ];
  return <DataTable rows={rows} tableSortable={true} summary="" headers={[]} />;
};
