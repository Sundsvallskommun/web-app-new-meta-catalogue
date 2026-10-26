import { ConnectOperationDto, OrgChangeOperation } from '@data-contracts/backend/data-contracts';
import { Check } from 'lucide-react';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, FormControl, FormErrorMessage, FormLabel, Modal, useSnackbar, Combobox } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';

interface IOperationConnectorModalProps {
  onClose: () => void;
}

const OperationConnectorModal = ({ onClose }: IOperationConnectorModalProps) => {
  const organization = useOrganizationStore((s) => s.organization);
  const connectOperation = useOrgChangeStore((s) => s.connectOperation);
  const getOperationsByCompany = useOrgChangeStore((s) => s.getOperationsByCompany);
  const draft = useOrgChangeStore((s) => s.draft);
  const operationsByOrg = useOrgChangeStore((s) => s.operationsByOrg);
  const operationsByCompany = useOrgChangeStore((s) => s.operationsByCompany);
  const message = useSnackbar();

  const [activeOperation, setActiveOperation] = useState<{ label: string; data: OrgChangeOperation } | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [operationsNotInOrg, setOperationsNotInOrg] = useState<OrgChangeOperation[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const onOperationSelectHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    const value = operationsNotInOrg.find((x) => x.operationCode === val);
    if (!value) return;
    setActiveOperation({
      label: value.operationCode,
      data: value,
    });
  };

  const onCloseHandler = async () => {
    if (activeOperation) {
      const shouldClose = await window.confirm(
        'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?'
      );
      if (!shouldClose) return;
    }
    setActiveOperation(undefined);
    onClose();
    setError(false);
    setIsLoading(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOperation) {
      const dataBody: ConnectOperationDto = {
        operationId: activeOperation.data.operationId,
        orgId: organization.id,
      };

      connectOperation({ ...dataBody }).then((res) => {
        if (!res.error) {
          setIsLoading(false);
          onClose();
          message({
            message: `Verksamheten kopplas till grenen`,
            status: 'success',
          });
        } else {
          setErrorMessage(res.message);
          setError(true);
          setIsLoading(false);
        }
      });
    }
  };

  useEffect(() => {
    setOperationsNotInOrg(
      operationsByCompany.filter((o) =>
        operationsByOrg.find((x) => x.operationCode === o.operationCode) ? false : true
      )
    );
  }, [operationsByCompany, operationsByOrg]);

  useEffect(() => {
    getOperationsByCompany(draft.companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal className="max-w-[800px]" show={true} onClose={onClose} label="Koppla verksamhet">
      <form id="operation-connector-form" onSubmit={onSubmit} className="flex flex-col gap-16">
        <FormControl id="operation-searchconnect-dropdown" className="w-full">
          <FormLabel>Verksamhet</FormLabel>
          <Combobox
            className="w-full"
            id="operation-searchconnect-dropdown"
            onChange={onOperationSelectHandler}
            value={activeOperation?.data?.operationCode?.toString() ?? undefined}
            defaultValue={activeOperation?.data?.operationCode?.toString() ?? undefined}
          >
            <Combobox.Input className="w-full" placeholder="Sök på verksamhetskoder" />
            <Combobox.List>
              {operationsNotInOrg.map((item, index) => (
                <Combobox.Option key={`item-${index}`} value={item.operationCode.toString()}>
                  {`${item.operationCode.trim()} - ${item.description.trim()}`}
                </Combobox.Option>
              ))}
            </Combobox.List>
          </Combobox>
        </FormControl>
        {error && <FormErrorMessage>{errorMessage || 'Det gick inte att spara åtgärd'}</FormErrorMessage>}
      </form>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={onCloseHandler}>
          Avbryt
        </Button>
        <Button
          className="ml-auto"
          type="submit"
          form="operation-connector-form"
          variant="primary"
          color="primary"
          leftIcon={<Check />}
          loading={isLoading}
          loadingText="Sparar"
          disabled={!activeOperation}
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OperationConnectorModal;
