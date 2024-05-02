import { ConnectOperationDto, OrgChangeOperation } from '@data-contracts/backend/data-contracts';
import CheckIcon from '@mui/icons-material/Check';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Combobox } from '@sk-web-gui/forms';
import { Button, FormControl, FormErrorMessage, FormLabel, Modal, useMessage } from '@sk-web-gui/react';
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
  const message = useMessage();

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
      <form onSubmit={onSubmit}>
        <FormControl id="operation-searchconnect-title">
          <FormLabel>Verksamhet</FormLabel>
        </FormControl>
        <Combobox
          className="w-full"
          id="operation-searchconnect-dropdown"
          aria-labelledby="operation-searchconnect-title"
          placeholder="Sök på verksamhetskoder"
          onChange={onOperationSelectHandler}
          value={activeOperation?.data?.operationCode?.toString() ?? undefined}
          defaultValue={activeOperation?.data?.operationCode?.toString() ?? undefined}
        >
          <Combobox.List>
            {operationsNotInOrg.map((item, index) => (
              <Combobox.Option key={`item-${index}`} value={item.operationCode.toString()}>
                {`${item.operationCode.trim()} - ${item.description.trim()}`}
              </Combobox.Option>
            ))}
          </Combobox.List>
        </Combobox>
        <div className="mt-16 flex flex-col sm:flex-row sm:grid sm:grid-cols-2 sm:gap-10">
          <Button type="button" variant="solid" size="lg" className="my-sm sm:my-6 w-full" onClick={onCloseHandler}>
            Avbryt
          </Button>
          <Button
            type="submit"
            variant="solid"
            size="lg"
            color="primary"
            className="my-sm sm:my-6 w-full"
            leftIcon={<CheckIcon fontSize="large" className="mr-sm" />}
            loading={isLoading}
            loadingText="Sparar"
            disabled={!activeOperation}
          >
            Spara
          </Button>
        </div>
        {error && (
          <div className="w-full flex justify-between space-x-2 my-lg">
            <FormErrorMessage>
              <span>{errorMessage ? errorMessage : 'Det gick inte att spara åtgärd'}</span>
            </FormErrorMessage>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default OperationConnectorModal;
