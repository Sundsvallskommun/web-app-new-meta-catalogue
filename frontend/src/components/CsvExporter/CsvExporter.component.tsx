import { CSVLink } from 'react-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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
      <FileDownloadIcon fontSize="large" />
      <span>Exportera</span>
    </CSVLink>
  );
};

export default CsvExporter;
