import * as yup from 'yup';

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  useConfirm,
  useMessage,
} from '@sk-web-gui/react';
import React, { useMemo, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarnIfUnsavedChanges from '@utils/warnIfUnsavedChanges';
import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { emptyResponsibility } from '@services/mdviewer/defaults/responsibility';
import {
  OrgChangeResponsibility,
  OrgChangeResponsibilityResponsibilityChangeStatusEnum,
} from '@data-contracts/backend/data-contracts';

import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';

interface ResponsibilityRenameProps {
  onClose: () => void;
  responsibility: OrgChangeResponsibility;
}

const ResponsibilityRenameModal = ({ onClose, responsibility = undefined }: ResponsibilityRenameProps) => {
  // orgchangestore
  const renameResponsibility = useOrgChangeStore((s) => s.renameResponsibility);
  const closeResponsibility = useOrgChangeStore((s) => s.closeResponsibility);

  const { showConfirmation } = useConfirm();
  const message = useMessage();

  const organization = useOrganizationStore((s) => s.organization);

  const formSchema = yup
    .object({
      description: yup.string().required('En ansvarstitel måste anges'),
    })
    .required();

  // useForm
  const {
    watch,
    reset,
    setValue,
    trigger,
    formState,
    getValues,
    formState: { errors },
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

  const onCloseHandler = async () => {
    if (!isEqual(formState.defaultValues, getValues())) {
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

  const onRemoveHandler = async () => {
    const dataBody = {
      responsibilityId: responsibility.responsibilityId,
    };

    const title = 'Är du säker på att du vill ta bort ansvaret?';
    const _message = `Ansvar (${responsibility.description}) kommer att tas bort från gren ${organization.orgName} (Nivå ${organization.level})`;
    showConfirmation(title, _message, 'Ja, ta bort ansvaret', 'Avbryt').then((result) => {
      result === true &&
        closeResponsibility(dataBody).then((res) => {
          if (!res.error) {
            setIsLoading(false);
            reset();
            onClose();
            message({
              message: `Ansvaret har tagits bort`,
              status: 'success',
            });
          } else {
            setErrorMessage(errorMessage);
            setError(true);
            setIsLoading(false);
          }
        });
    });
  };

  const onSubmit = () => {
    const formData = getValues();

    const apiCall = renameResponsibility;

    const dataBody = {
      responsibilityId: responsibility.responsibilityId,
      description: formData.description,
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

  const descriptionHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('description', e.target.value);
    trigger('description');
  };

  return (
    <Modal className="max-w-[800px]" show={true} labelAs="h3" onClose={onClose} label="Uppdatera ansvar">
      <WarnIfUnsavedChanges showWarning={!isEqual(formState.defaultValues, getValues())}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <FormControl id="responsibility-edit-title">
            <FormLabel>
              <strong>Ansvartitel</strong>
            </FormLabel>
            <Input.Group size="md">
              <Input
                value={watch().description}
                placeholder="Ansvarstitel"
                maxLength={30}
                title="Ansvarstitel"
                onChange={descriptionHandler}
              />
            </Input.Group>
          </FormControl>

          {errors.description && (
            <FormErrorMessage key={`description-errors`}>{errors.description?.message}</FormErrorMessage>
          )}

          <div className="mt-16 flex flex-col sm:flex-row sm:grid sm:grid-cols-2 sm:gap-10 items-end">
            <div>
              {responsibility.responsibilityChangeStatus ==
                OrgChangeResponsibilityResponsibilityChangeStatusEnum.NEW && (
                <div className="mb-sm">
                  <Button
                    type="button"
                    className="text-error hover:border-error hover:bg-error focus-within:bg-error focus-within:text-white"
                    size="md"
                    variant="outline"
                    aria-label={`Ta bort ansvar ${watch().description}`}
                    onClick={onRemoveHandler}
                    leftIcon={<DeleteOutlineIcon fontSize="large" />}
                  >
                    Ta bort ansvar
                  </Button>
                </div>
              )}

              <Button variant="solid" size="lg" onClick={onCloseHandler} className="my-sm sm:my-6 w-full" type="button">
                {'Avbryt'}
              </Button>
            </div>
            <Button
              type="submit"
              variant="solid"
              size="lg"
              color="primary"
              className="my-sm sm:my-6 w-full"
              leftIcon={<CheckIcon fontSize="large" className="mr-sm" />}
              loading={isLoading}
              loadingText="Sparar"
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
      </WarnIfUnsavedChanges>
    </Modal>
  );
};

export default ResponsibilityRenameModal;
