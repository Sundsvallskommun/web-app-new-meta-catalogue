import OrgChangeCsvExporter from '@components/OrgChange/OrgChangeCsvExporter/OrgChangeCsvExporter.component';
import { CheckedOutOrganizationLevel2, Draft } from '@data-contracts/backend/data-contracts';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, FormControl, FormLabel, Modal, useMessage } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import { Spinner } from '@sk-web-gui/react';

interface IExportInitialOrgStructureModal {
  onClose: () => void;
  draft: Draft;
}

export default function ExportInitialOrgStructureModal(props: IExportInitialOrgStructureModal) {
  const { onClose, draft } = props;
  const getCheckedOutOrganizationsLevel2 = useOrgChangeStore((s) => s.getCheckedOutOrganizationsLevel2);
  const checkedOutOrganizationsLevel2 = useOrgChangeStore((s) => s.checkedOutOrganizationLevel2);
  const checkedOutOrganizationsLevel2IsLoading = useOrgChangeStore((s) => s.checkedOutOrganizationLevel2IsLoading);
  const getInitialOrgStructuresToExport = useOrgChangeStore((s) => s.getInitialOrgStructuresToExport);
  const [csvData, setCsvData] = useState([]);
  const [fetchedOrg, setFetchedOrg] = useState<CheckedOutOrganizationLevel2>(null);

  useEffect(() => {
    getCheckedOutOrganizationsLevel2(draft.draftId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const message = useMessage();

  const handleSetCsvData = async (org) => {
    const res = await getInitialOrgStructuresToExport([org.orgId]);
    if (!res.error) {
      setCsvData(res.data[0]);
      setFetchedOrg(org);
    } else {
      message({
        message: `Något gick fel vid försök av exportering`,
        status: 'error',
      });
    }

    setTimeout(() => {
      setFetchedOrg(null);
    });
  };

  const label = (
    <div>
      <h3>Exportera förlaga av Organisationer</h3>
    </div>
  );

  return (
    <Modal className="max-w-3xl" show={true} label={label} onClose={onClose}>
      <form>
        <FormControl>
          <FormLabel className="text-base mb-md flex gap-4 items-center">
            Välj organisation som du vill exportera {checkedOutOrganizationsLevel2IsLoading && <Spinner size="lg" />}
          </FormLabel>
          {!checkedOutOrganizationsLevel2IsLoading && (
            <div className="flex flex-col space-y-md">
              {checkedOutOrganizationsLevel2?.map((org) => {
                return (
                  <Button
                    key={`${org.orgId}`}
                    aria-label={`Exportera ${org.name}`}
                    className="text-lg"
                    variant="link"
                    onClick={() => handleSetCsvData(org)}
                  >
                    <span className="flex justify-center items-center gap-2">
                      <span>
                        <FileDownloadIcon fontSize="large" />
                      </span>
                      <span>{org.name}</span>
                    </span>
                  </Button>
                );
              })}
            </div>
          )}
        </FormControl>
        <div className="mt-16 flex">
          <Button type="button" className="w-full" onClick={onClose}>
            Stäng
          </Button>

          {fetchedOrg !== null && <OrgChangeCsvExporter fileName={fetchedOrg.name} csvData={csvData} />}
        </div>
      </form>
    </Modal>
  );
}
