import {
  EmploymentChangeArrayDto,
  OrgChangeOrganizationEmployee,
  OrgChangeOrganizationOperation,
} from '@data-contracts/backend/data-contracts';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Undo2 } from 'lucide-react';
import { changeEmployment } from '@services/mdbuilder/api-calls/employment';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { Button, FormControl, FormErrorMessage, FormLabel, Modal, useSnackbar, Select } from '@sk-web-gui/react';
import { renderNewOrOld } from '@utils/render-new-or-old';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { MarkedPeopleList } from './components/MarkedPeopleList.component';

interface IChangeOperationProps {
  peopleToHandle: OrgChangeOrganizationEmployee[];
  closeCallback: () => void;
}

interface ChangeOperationForm {
  operationCode: OrgChangeOrganizationOperation['operationCode'];
}

export default function ChangeOperationModal(props: IChangeOperationProps) {
  const { closeCallback, peopleToHandle } = props;
  const getEmployeesByOrg = useOrgChangeStore((s) => s.getEmployeesByOrg);
  const organization = useOrganizationStore((s) => s.organization);

  const operationsByOrg = useOrgChangeStore((s) => s.operationsByOrg);
  const [errorMessage, setErrorMessage] = useState('');
  const initialOperation = {
    operationCode: renderNewOrOld(peopleToHandle[0]?.newOperationCode, peopleToHandle[0]?.operationCode),
    description: renderNewOrOld(peopleToHandle[0]?.newOperationName, peopleToHandle[0]?.operationName),
    operationId: null,
  };

  const formSchema = yup
    .object({
      operationCode: yup.string().test({
        name: 'operationNotInOrg',
        message: `Nuvarande verksamhet "${initialOperation.description} - ${initialOperation.operationCode}" finns inte tillgänglig i ${organization.label} (Nivå ${organization.level}). Var god välj en i listan.`,
        test: (value) => {
          const operationNotInOrg = operationsByOrg.find((x) => x.operationCode === value);
          return operationNotInOrg ? true : false;
        },
      }),
    })
    .required();

  const { formState, reset, register, trigger, handleSubmit } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: useMemo(
      () => ({
        operationCode: renderNewOrOld(peopleToHandle[0]?.newOperationCode, peopleToHandle[0]?.operationCode),
      }),
      [peopleToHandle]
    ),
    mode: 'onChange',
  });

  const message = useSnackbar();

  const handleOnClose = async () => {
    if (formState.isDirty) {
      const shouldClose = await window.confirm(
        'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?'
      );
      if (!shouldClose) return;
    }
    reset();
    closeCallback();
  };

  const onSubmit = async (formValues: ChangeOperationForm) => {
    const dataBody: EmploymentChangeArrayDto['people'] = peopleToHandle.map((x) => ({
      personId: x.personId,
      orgId: x.orgId,
      newOperationId: operationsByOrg.find((x) => x.operationCode === formValues.operationCode).operationId,
    }));
    changeEmployment(dataBody).then((res) => {
      if (!res.error) {
        getEmployeesByOrg(organization.id);
        message({
          message: `Ändringar på verksamhet sparas`,
          status: 'success',
        });
        reset();
        closeCallback();
      } else {
        setErrorMessage(res.message);
      }
    });
  };

  const resetPa = () => {
    reset();
  };

  useEffect(() => {
    trigger('operationCode', { shouldFocus: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationsByOrg, peopleToHandle]);

  const resetButton = (
    <Button
      type="button"
      size="sm"
      variant="tertiary"
      onClick={resetPa}
      aria-label={`Återställ verksamhet`}
      leftIcon={<Undo2 />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="w-[calc(100%-32px)] max-w-[900px] my-16" show onClose={handleOnClose} label="Ändra verksamhet">
      <form id="change-operation-modal-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-16">
        <p className="text-small text-dark-secondary">
          För {`${peopleToHandle.length} personer`} under gren {organization.orgName} nivå 6
        </p>
        <FormControl
          invalid={formState.errors.operationCode !== undefined ? true : false}
          id="orgchange-employment-operation"
          className="w-full"
        >
          <FormLabel id="chooseoperation">Verksamhet</FormLabel>
          <Select
            {...register('operationCode')}
            className="w-full"
            id="orgchange-employment-operation"
            aria-labelledby="orgchange-employment-operation-error"
          >
            {operationsByOrg.map((operation) => (
              <Select.Option key={`${operation.operationCode}`} value={operation.operationCode}>
                {`${operation.description} - ${operation.operationCode}`}
              </Select.Option>
            ))}
          </Select>
          <ErrorMessage
            errors={formState.errors}
            name="operationCode"
            render={({ message }) => <FormErrorMessage>{message}</FormErrorMessage>}
          />
        </FormControl>
        {formState.isDirty && <div>{resetButton}</div>}
        {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
        {peopleToHandle.length !== 0 && (
          <MarkedPeopleList
            peopleToHandle={peopleToHandle}
            contextColumn={{
              header: 'Verksamhet',
              element: (p) => (
                <>
                  {renderNewOrOld(p.newOperationCode, p.operationCode)}
                  <br />
                  {renderNewOrOld(p.newOperationName, p.operationName)}
                </>
              ),
            }}
          />
        )}
      </form>
      <Modal.Footer>
        <Button variant="secondary" className="flex-1" type="button" onClick={handleOnClose}>
          Avbryt
        </Button>
        <Button
          className="flex-1"
          variant="primary"
          type="submit"
          form="change-operation-modal-form"
          color="primary"
          aria-disabled={!formState.isDirty ? 'true' : undefined}
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
