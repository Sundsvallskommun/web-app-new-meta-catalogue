import { InitialOrgStructureToExport } from '@data-contracts/backend/data-contracts';

const csvOrgHeaders: { label: string; key: string }[] = [
  { label: 'N2 Organisationsnamn', key: 'nameLvl2' },
  { label: 'N2 Kortnamn', key: 'shortnameLv2' },
  { label: 'N2 Förkortning', key: 'abbreviationLv2' },
  { label: 'N2 Ansvarskod', key: 'responsibilityCodePartLv2' },
  { label: 'N3 Organisationsnamn', key: 'nameLvl3' },
  { label: 'N3 Kortnamn', key: 'shortnameLv3' },
  { label: 'N3 Förkortning', key: 'abbreviationLv3' },
  { label: 'N3 Ansvarskod', key: 'responsibilityCodePartLv3' },
  { label: 'N4 Organisationsnamn', key: 'nameLvl4' },
  { label: 'N4 Kortnamn', key: 'shortnameLv4' },
  { label: 'N4 Förkortning', key: 'abbreviationLv4' },
  { label: 'N4 Ansvarskod', key: 'responsibilityCodePartLv4' },
  { label: 'N5 Organisationsnamn', key: 'nameLvl5' },
  { label: 'N5 Kortnamn', key: 'shortnameLv5' },
  { label: 'N5 Förkortning', key: 'abbreviationLv5' },
  { label: 'N5 Ansvarskod', key: 'responsibilityCodePartLv5' },
  { label: 'N6 Organisationsnamn', key: 'nameLvl6' },
  { label: 'N6 Kortnamn', key: 'shortnameLv6' },
  { label: 'N6 Förkortning', key: 'abbreviationLv6' },
  { label: 'N6 Ansvarskod', key: 'responsibilityCodePartLv6' },
  { label: 'Ansvar kod', key: 'responsibilityCode' },
  { label: 'Ansvar titel', key: 'responsibilityDescription' },
  { label: 'Verksamheter', key: 'operations' },
  { label: 'Chef', key: 'manager' },
  { label: 'Begärda ändringar', key: 'changes' },
];

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

/**
 * Downloads the rows as a ;-separated CSV file through a download link.
 * Replaces react-csv's CSVDownload, which no longer opened the file after the React 19 upgrade.
 */
export const downloadInitialOrgStructureCsv = (rows: InitialOrgStructureToExport[], fileName: string) => {
  const csv = [
    csvOrgHeaders.map((header) => csvCell(header.label)).join(';'),
    ...rows.map((row) =>
      csvOrgHeaders.map((header) => csvCell((row as Record<string, unknown>)[header.key])).join(';')
    ),
  ].join('\n');

  const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
