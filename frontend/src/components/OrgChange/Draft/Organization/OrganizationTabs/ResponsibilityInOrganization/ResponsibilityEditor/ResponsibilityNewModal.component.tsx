import {
  OrgChangeResponsibility,
  OrgChangeResponsibilityResponsibilityTypeIdEnum,
  OrganizationTree,
  ResponsibilityCreateDto,
} from '@data-contracts/backend/data-contracts';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Check } from 'lucide-react';
import { getNewResponsibilityCodeSuggestion } from '@services/mdbuilder/api-calls/responsibility';
import { emptyResponsibility } from '@services/mdbuilder/defaults';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { responsibilityTypes } from '@services/mdviewer/defaults/responsibility';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, useSnackbar, Select } from '@sk-web-gui/react';
import { findIdInTree } from '@utils/findIdInTree';
import WarnIfUnsavedChanges from '@utils/warnIfUnsavedChanges';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const defaultSetValueOptions = { shouldDirty: true, shouldTouch: true, shouldValidate: true };

interface ResponsibilityNewProps {
  onClose: () => void;
  responsibility?: OrgChangeResponsibility;
}

const ResponsibilityNewModal = (props: ResponsibilityNewProps) => {
  const { onClose, responsibility = emptyResponsibility } = props;

  // organizationstore
  const organization = useOrganizationStore((s) => s.organization);
  const orgTree = useOrganizationStore((s) => s.orgTree);

  // orgchangestore
  const createConnectResponsibility = useOrgChangeStore((s) => s.createConnectResponsibility);
  const responsibilitiesByOrg = useOrgChangeStore((s) => s.responsibilitiesByOrg);

  const hasLoneansvarInOrg = responsibilitiesByOrg.find(
    (x) => x.responsibilityTypeId === OrgChangeResponsibilityResponsibilityTypeIdEnum.LONEANSVAR
  );

  const message = useSnackbar();

  const formSchema = yup
    .object({
      orgId: yup.number(),
      responsibilityCode: yup
        .string()
        .length(organization.level - 1 + 3, `AnsvarsId:et måste vara sammanlagt ${organization.level - 1 + 3} tecken`)
        .required('AnsvarsId måste anges'),
      description: yup.string().required('En ansvarstitel måste anges'),
      responsibilityTypeId: yup.string().required('Ansvarstyp måste anges'),
    })
    .required();

  // useForm
  const {
    watch,
    reset,
    setValue,
    register,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: useMemo(() => {
      return { ...(responsibility ? responsibility : emptyResponsibility) };
    }, [responsibility]),
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rightValue, setRightValue] = useState('');

  const getResponsibilityCodeLeft = () => {
    const Org: OrganizationTree = findIdInTree(orgTree, organization.id, 'subItems');
    const _leftValue = Org.responsibilityCode;

    if (!_leftValue || organization.level - 1 !== _leftValue.length) {
      setErrorMessage(`Organisationen saknar giltig ansvarskod, nya ansvar kan därför inte kopplas.`);
      setError(true);
    }
    return _leftValue;
  };
  const [leftValue, setLeftValue] = useState('');

  const onCloseHandler = async () => {
    if (isDirty) {
      const shouldClose = await window.confirm(
        'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?'
      );
      if (!shouldClose) return;
    }

    onClose();
    setError(false);
    setIsLoading(false);
    reset();
  };

  const onSubmit = () => {
    const formData = getValues();

    const apiCall = createConnectResponsibility;
    const dataBody: ResponsibilityCreateDto = {
      ...formData,
      orgId: organization.id,
      responsibilityCode: formData.responsibilityCode,
      description: formData.description,
      responsibilityType: formData.responsibilityTypeId,
    };

    setErrorMessage('');
    setError(false);
    setIsLoading(true);
    apiCall({ ...dataBody }).then((r) => {
      if (!r.error) {
        setIsLoading(false);
        reset();
        onClose();
        message({
          message: `Ansvaret har sparats`,
          status: 'success',
        });
      } else {
        setErrorMessage(r.message); // This needs to be verified, not sure how the return looks like
        setError(true);
        setIsLoading(false);
      }
    });
  };

  const setResponsibilityCode = (code: string) => {
    setRightValue(code);
    setValue('responsibilityCode', leftValue + code, defaultSetValueOptions);
  };

  const responsibilityCodeHandler = (e) => {
    setResponsibilityCode(e.target.value);
  };

  const resetFormDefaults = async (responsibility: OrgChangeResponsibility) => {
    const leftValue = getResponsibilityCodeLeft() || '';
    setLeftValue(leftValue);
    const responsibilityTypeId =
      hasLoneansvarInOrg ? OrgChangeResponsibilityResponsibilityTypeIdEnum.ANSVAR : responsibility.responsibilityTypeId;
    const suggestedCode = await _getNewResponsibilityCodeSuggestion(responsibilityTypeId, false);
    reset({
      ...responsibility,
      responsibilityTypeId: responsibilityTypeId,
      responsibilityCode: leftValue + suggestedCode,
    });
  };

  useEffect(() => {
    resetFormDefaults(responsibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responsibility]);

  const _getNewResponsibilityCodeSuggestion = async (
    responsibilityTypeId: OrgChangeResponsibility['responsibilityTypeId'],
    shouldDirty = true
  ) => {
    let suggestedCode = '';
    if (!organization.responsibilityCode) return suggestedCode;
    const res = await getNewResponsibilityCodeSuggestion(organization.responsibilityCode, responsibilityTypeId);
    if (!res.error) {
      suggestedCode = res.data.toString().slice(-3);
      setRightValue(suggestedCode);
      setValue('responsibilityCode', leftValue + suggestedCode, shouldDirty ? defaultSetValueOptions : undefined);
      return suggestedCode;
    } else {
      message({
        message: res.message,
        status: 'error',
      });
    }
    return suggestedCode;
  };

  const selectTypeOfResponsibilityHandler: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const val = e.target.value;
    const value = responsibilityTypes.find((x) => x.id === val);
    if (!value) return;
    setValue('responsibilityTypeId', value.id);
    _getNewResponsibilityCodeSuggestion(value.id);
  };

  return (
    <Modal className="max-w-[800px]" show={true} onClose={onCloseHandler} label="Skapa nytt ansvar">
      <WarnIfUnsavedChanges showWarning={isDirty}>
        <form
          id="responsibility-new-modal-form"
          className="flex flex-col gap-16"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <FormControl id="responsibility-edit-title" className="w-full">
            <FormLabel>Ansvartitel</FormLabel>
            <Input.Group size="md">
              <Input {...register('description')} placeholder="Ansvarstitel" maxLength={30} title="Ansvarstitel" />
            </Input.Group>
            <ErrorMessage
              errors={errors}
              name="description"
              render={({ message }) => <FormErrorMessage>{message}</FormErrorMessage>}
            />
          </FormControl>
          <div className="grid grid-cols-2 gap-16">
            <div>
              <FormControl id="responsibility-code">
                <FormLabel>Ansvarskod</FormLabel>
                <Input.Group size="md">
                  <Input.LeftAddon>{leftValue}</Input.LeftAddon>
                  <Input
                    value={rightValue}
                    placeholder="000"
                    maxLength={3}
                    title="Ansvarskod i siffror 0-9"
                    pattern="[0-9]\d\d"
                    onChange={responsibilityCodeHandler}
                  />
                </Input.Group>
                <ErrorMessage
                  errors={errors}
                  name="responsibilityCode"
                  render={({ message }) => <FormErrorMessage>{message}</FormErrorMessage>}
                />
              </FormControl>
            </div>

            <div>
              <FormControl id="responsibilityTypeId">
                <FormLabel>Ansvarstyp</FormLabel>
                <Select
                  aria-label="Ansvarstyp"
                  id="responsibilityTypeId"
                  {...register('responsibilityTypeId')}
                  value={responsibilityTypes.find((x) => x.id == watch().responsibilityTypeId)?.id}
                  placeholder="Ansvarstyp"
                  className="w-full"
                  onChange={selectTypeOfResponsibilityHandler}
                >
                  {responsibilityTypes
                    .filter((x) =>
                      hasLoneansvarInOrg ? x.id !== OrgChangeResponsibilityResponsibilityTypeIdEnum.LONEANSVAR : true
                    )
                    .map((type) => (
                      <Select.Option key={`${type.label}`} value={type.id}>
                        {type.label}
                      </Select.Option>
                    ))}
                </Select>
                <ErrorMessage
                  errors={errors}
                  name="responsibilityTypeId"
                  render={({ message }) => <FormErrorMessage>{message}</FormErrorMessage>}
                />
              </FormControl>
            </div>
          </div>
          <FormControl id="responsibilityToDate">
            <FormLabel>Giltig till</FormLabel>
            <p>9999-12-31</p>
          </FormControl>

          {error && (
            <FormErrorMessage>{errorMessage ? errorMessage : 'Det gick inte att spara åtgärd'}</FormErrorMessage>
          )}
        </form>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCloseHandler} type="button">
            {'Avbryt'}
          </Button>
          <Button
            className="ml-auto"
            type="submit"
            form="responsibility-new-modal-form"
            variant="primary"
            color="primary"
            leftIcon={<Check />}
            loading={isLoading}
            loadingText="Sparar"
          >
            Spara
          </Button>
        </Modal.Footer>
      </WarnIfUnsavedChanges>
    </Modal>
  );
};

export default ResponsibilityNewModal;
