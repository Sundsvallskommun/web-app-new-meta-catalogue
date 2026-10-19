import OrgChangeCsvExporter from '@components/OrgChange/OrgChangeCsvExporter/OrgChangeCsvExporter.component';
import { CheckedOutOrganizationLevel2, Draft } from '@data-contracts/backend/data-contracts';
import { Download } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, FormControl, FormLabel, Modal, useSnackbar } from '@sk-web-gui/react';
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

  const message = useSnackbar();

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

  return (
    <Modal className="max-w-3xl" show={true} label="Exportera förlaga av organisationer" onClose={onClose}>
      <form className="flex flex-col gap-16">
        <FormControl className="w-full">
          <FormLabel>Välj organisation som du vill exportera</FormLabel>
          {checkedOutOrganizationsLevel2IsLoading && <Spinner size={2} />}
          {!checkedOutOrganizationsLevel2IsLoading && (
            <div className="flex flex-col items-start gap-8">
              {checkedOutOrganizationsLevel2?.map((org) => {
                return (
                  <Button
                    key={`${org.orgId}`}
                    aria-label={`Exportera ${org.name}`}
                    variant="secondary"
                    leftIcon={<Download />}
                    onClick={() => handleSetCsvData(org)}
                  >
                    {org.name}
                  </Button>
                );
              })}
            </div>
          )}
        </FormControl>
        {fetchedOrg !== null && <OrgChangeCsvExporter fileName={fetchedOrg.name} csvData={csvData} />}
      </form>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={onClose}>
          Stäng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
