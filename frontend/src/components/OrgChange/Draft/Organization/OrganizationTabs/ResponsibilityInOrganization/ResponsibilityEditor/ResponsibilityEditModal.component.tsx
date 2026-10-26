import * as yup from 'yup';

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  useConfirm,
  useSnackbar,
} from '@sk-web-gui/react';
import React, { useMemo, useState } from 'react';

import { OrgChangeResponsibility } from '@data-contracts/backend/data-contracts';
import { yupResolver } from '@hookform/resolvers/yup';
import { Check, Trash } from 'lucide-react';
import { emptyResponsibility } from '@services/mdviewer/defaults/responsibility';
import WarnIfUnsavedChanges from '@utils/warnIfUnsavedChanges';
import { isEqual } from 'lodash';
import { useForm } from 'react-hook-form';

import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';

interface ResponsibilityRenameProps {
  onClose: () => void;
  responsibility: OrgChangeResponsibility;
}

const ResponsibilityEditModal = ({ onClose, responsibility = undefined }: ResponsibilityRenameProps) => {
  // orgchangestore
  const renameResponsibility = useOrgChangeStore((s) => s.renameResponsibility);
  const closeResponsibility = useOrgChangeStore((s) => s.closeResponsibility);

  const { showConfirmation } = useConfirm();
  const message = useSnackbar();

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

    const title = 'Är du säker på att du vill stänga ansvaret?';
    const _message = `Ansvar (${responsibility.description}) kommer att tas bort från gren ${organization.orgName} (Nivå ${organization.level})`;
    showConfirmation(title, _message, 'Ja, stäng ansvar', 'Avbryt').then((result) => {
      if (result === true) {
        closeResponsibility(dataBody).then((res) => {
          if (!res.error) {
            setIsLoading(false);
            reset();
            onClose();
            message({
              message: `Ansvaret har stängts`,
              status: 'success',
            });
          } else {
            setErrorMessage(res.message);
            message({
              message: `Ansvaret kunde inte stängas: ${res.message}`,
              status: 'error',
            });
            setError(true);
            setIsLoading(false);
          }
        });
      }
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
    <Modal className="max-w-[800px]" show={true} onClose={onClose} label="Uppdatera ansvar">
      <WarnIfUnsavedChanges showWarning={!isEqual(formState.defaultValues, getValues())}>
        <form
          id="responsibility-edit-modal-form"
          className="flex flex-col gap-16"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="flex flex-col items-start gap-8">
            <FormControl id="responsibility-edit-title" className="w-full">
              <FormLabel>Ansvartitel</FormLabel>
              <Input.InnerGroup size="md">
                <Input
                  value={watch().description}
                  placeholder="Ansvarstitel"
                  maxLength={30}
                  title="Ansvarstitel"
                  onChange={descriptionHandler}
                />
              </Input.InnerGroup>
              {errors.description && (
                <FormErrorMessage key={`description-errors`}>{errors.description?.message}</FormErrorMessage>
              )}
            </FormControl>
            <Button
              type="button"
              color="error"
              size="sm"
              variant="tertiary"
              aria-label={`Stäng ansvar ${watch().description}`}
              onClick={onRemoveHandler}
              leftIcon={<Trash />}
            >
              Stäng ansvar
            </Button>
          </div>
          {error && <FormErrorMessage>{errorMessage || 'Det gick inte att spara åtgärd'}</FormErrorMessage>}
        </form>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCloseHandler} type="button">
            {'Avbryt'}
          </Button>
          <Button
            className="ml-auto"
            type="submit"
            form="responsibility-edit-modal-form"
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

export default ResponsibilityEditModal;
