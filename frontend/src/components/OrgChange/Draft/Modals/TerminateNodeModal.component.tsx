import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, Modal, useConfirm, useMessage } from '@sk-web-gui/react';

interface ITerminateNodeProps {
  onClose;
}

export default function TerminateNode(props: ITerminateNodeProps) {
  const { onClose } = props;
  const terminateNode = useOrgChangeStore((s) => s.terminateNode);
  const employeesByOrg = useOrgChangeStore((s) => s.employeesByOrg);
  const organization = useOrganizationStore((s) => s.organization);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const { showConfirmation } = useConfirm();
  const message = useMessage();
  const setIsSaving = useSaveStore((s) => s.setIsSaving);

  const onTerminateBranch = () => {
    showConfirmation(
      'Är du säker på att du vill stänga grenen?',
      `Gren ${organization.orgName} Kommer inte längre vara en del av organisationen${
        organization.subItems?.length > 0 ? ' samt alla underliggande grenar i grenens struktur.' : '.'
      } Alla förändringar som gjorts i grenens struktur kommer även att försvinna.${
        employeesByOrg.length > 0 ?
          ' Notera att samtlig personal i grenen måste flyttas för att du sedan ska kunna gå vidare med alla förändringar'
        : ''
      }`,
      'Ja, stäng',
      'Avbryt'
    ).then((result) => {
      if (result === true) {
        setIsSaving(true);
        terminateNode(organization.id).then((t) => {
          if (!t.error) {
            message({
              message: `Ändringar på grenen sparas.`,
              status: 'success',
            });
          } else {
            message({
              message: `Det gick inte att stänga grenen`,
              status: 'error',
            });
          }
          setIsSaving(false);
          setSelectedOrganizationId(organization.id);
        });
      }
    });
  };

  return (
    <Modal className="max-w-[800px]" show onClose={onClose} label={'Stäng gren'}>
      <span className="mb-md block">
        Gren: {organization.orgName} nivå {organization.level}
      </span>

      <div className="mt-16 flex flex-col sm:flex-row sm:grid sm:grid-cols-2 sm:gap-10">
        <Button variant="solid" size="lg" className="my-sm sm:my-6 w-full" type="button" onClick={onClose}>
          Avbryt
        </Button>
        <Button
          size="lg"
          variant="solid"
          color="primary"
          className="my-sm sm:my-6 w-full"
          loadingText="Sparar"
          type="button"
          onClick={onTerminateBranch}
        >
          Stäng gren
        </Button>
      </div>
    </Modal>
  );
}
