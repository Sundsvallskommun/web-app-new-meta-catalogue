import { CSVLink } from 'react-csv';
import { Icon } from '@sk-web-gui/react';
import { Download } from 'lucide-react';

export const CsvExporter = (props) => {
  const { csvData, csvHeaders, fileName } = props;

  return (
    <CSVLink
      data={csvData}
      headers={csvHeaders}
      separator={';'}
      filename={fileName}
      className="text-base font-semibold text-svartvik-600 hover:text-hover transition-colors"
    >
      <Icon icon={<Download />} />
      <span>Exportera</span>
    </CSVLink>
  );
};

export default CsvExporter;
