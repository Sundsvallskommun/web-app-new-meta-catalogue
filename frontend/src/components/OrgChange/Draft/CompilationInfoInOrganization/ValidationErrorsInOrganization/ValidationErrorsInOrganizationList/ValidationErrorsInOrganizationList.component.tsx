import { DataTable, DataTableColumn } from '@components/DataTable/DataTable.component';

export default function ValidationErrorsInOrganizationList({ errors }) {
  if (!errors) return <></>;

  const rows: DataTableColumn[][] = [
    ...errors.map((errorText) => [
      {
        element: errorText,
        isShown: true,
      },
    ]),
  ];
  return <DataTable rows={rows} tableSortable={true} summary="" headers={[]} />;
}
