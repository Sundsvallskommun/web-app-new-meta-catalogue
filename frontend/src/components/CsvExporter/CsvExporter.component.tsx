import { CSVLink } from 'react-csv';
import { Button } from '@sk-web-gui/react';
import { Download } from 'lucide-react';

export const CsvExporter = (props) => {
  const { csvData, csvHeaders, fileName } = props;

  return (
    <CSVLink data={csvData} headers={csvHeaders} separator={';'} filename={fileName}>
      <Button as="span" variant="secondary" leftIcon={<Download />}>
        Exportera
      </Button>
    </CSVLink>
  );
};

export default CsvExporter;
