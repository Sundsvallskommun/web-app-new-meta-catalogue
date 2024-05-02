import {
  EmploymentChangeArrayDto,
  OrgChangeOrganizationEmployee,
  OrgChangeOrganizationOperation,
} from '@data-contracts/backend/data-contracts';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import LeadButtons from '@layouts/ButtonGroup/LeadButtons';
import UndoIcon from '@mui/icons-material/Undo';
import { changeEmployment } from '@services/mdbuilder/api-calls/employment';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { Select } from '@sk-web-gui/forms';
import { Button, FormControl, FormErrorMessage, FormLabel, Modal, useMessage } from '@sk-web-gui/react';
import { renderNewOrOld } from '@utils/render-new-or-old';
import { Fragment, useEffect, useMemo, useState } from 'react';
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

  const message = useMessage();

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

  const label = (
    <div>
      <h3>Ändra verksamhet</h3>
      <h4 className="font-normal">
        För {`${peopleToHandle.length} personer`} under gren {organization.orgName} &#40;nivå 6&#41;
      </h4>
    </div>
  );

  const resetButton = (
    <Button
      className="border-0 float-right"
      type="button"
      size="md"
      variant="link"
      onClick={resetPa}
      aria-label={`Återställ verksamhet`}
      leftIcon={<UndoIcon className="material-icon !text-2xl" aria-hidden="true" />}
    >
      Ångra och återställ
    </Button>
  );

  return (
    <Modal className="max-w-[900px]" show onClose={handleOnClose} label={label}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          invalid={formState.errors.operationCode !== undefined ? true : false}
          id="orgchange-employment-operation"
        >
          <FormLabel id="chooseoperation">
            <strong>Välj verksamhet</strong>
          </FormLabel>
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
        {formState.isDirty && <div className="w-full py-sm">{resetButton}</div>}
        {errorMessage && (
          <div className="w-full flex justify-between space-x-2 my-lg">
            <FormErrorMessage>
              <span>{errorMessage ? errorMessage : 'Det gick inte att spara åtgärd'}</span>
            </FormErrorMessage>
          </div>
        )}
        {peopleToHandle.length !== 0 && (
          <MarkedPeopleList
            peopleToHandle={peopleToHandle}
            contextColumn={{
              header: 'Verksamhet',
              element: (p) => (
                <Fragment>
                  <span className="inline font-bold lg:hidden">Verksamhet: </span>
                  <span className="lg:float-left">
                    <span className="lg:font-bold lg:text-sm lg:float-left">
                      {renderNewOrOld(p.newOperationCode, p.operationCode)}
                    </span>
                    <br />
                    <span className="inline font-bold lg:hidden">Verksamhet-namn: </span>
                    <span>{renderNewOrOld(p.newOperationName, p.operationName)}</span>
                  </span>
                </Fragment>
              ),
            }}
          />
        )}
        <LeadButtons>
          <Button type="button" onClick={handleOnClose}>
            Stäng
          </Button>
          <Button variant="solid" type="submit" color="primary" aria-disabled={!formState.isDirty ? 'true' : undefined}>
            Spara
          </Button>
        </LeadButtons>
      </form>
    </Modal>
  );
}
