import { downloadInitialOrgStructureCsv } from '@components/OrgChange/OrgChangeCsvExporter/OrgChangeCsvExporter.component';
import { CheckedOutOrganizationLevel2, Draft } from '@data-contracts/backend/data-contracts';
import { Download } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, FormControl, FormLabel, Modal, useSnackbar } from '@sk-web-gui/react';
import { useEffect } from 'react';
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
  useEffect(() => {
    getCheckedOutOrganizationsLevel2(draft.draftId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const message = useSnackbar();

  const handleExport = async (org: CheckedOutOrganizationLevel2) => {
    const res = await getInitialOrgStructuresToExport([org.orgId]);
    if (!res.error) {
      downloadInitialOrgStructureCsv(res.data[0] ?? [], org.name);
    } else {
      message({
        message: `Något gick fel vid försök av exportering`,
        status: 'error',
      });
    }
  };

  return (
    <Modal
      className="w-[calc(100%-32px)] max-w-3xl my-16"
      show={true}
      label="Exportera förlaga av organisationer"
      onClose={onClose}
    >
      <form className="flex flex-col gap-16">
        <FormControl className="w-full">
          <FormLabel>Välj organisation som du vill exportera</FormLabel>
          {checkedOutOrganizationsLevel2IsLoading && <Spinner size={2} />}
          {!checkedOutOrganizationsLevel2IsLoading && !checkedOutOrganizationsLevel2?.length && (
            <p className="text-dark-secondary mb-16">Det finns inga organisationer att exportera i det här utkastet.</p>
          )}
          {!checkedOutOrganizationsLevel2IsLoading && checkedOutOrganizationsLevel2?.length > 0 && (
            <div className="flex flex-col items-start gap-16 mb-16">
              {checkedOutOrganizationsLevel2?.map((org) => {
                return (
                  <Button
                    key={`${org.orgId}`}
                    aria-label={`Exportera ${org.name}`}
                    variant="link"
                    leftIcon={<Download />}
                    onClick={() => handleExport(org)}
                  >
                    {org.name}
                  </Button>
                );
              })}
            </div>
          )}
        </FormControl>
      </form>
      <Modal.Footer>
        <Button variant="secondary" className="w-full" type="button" onClick={onClose}>
          Stäng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
