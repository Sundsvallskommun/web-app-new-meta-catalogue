import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  Textarea,
  useConfirm,
  useSnackbar,
  Select,
} from '@sk-web-gui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check, Trash } from 'lucide-react';
import {
  deleteAlertBannerMessage,
  editAlertBannerMessage,
  newAlertBannerMessage,
} from '@services/alert-banner-service/alert-banner-service';
import { emptyAlertBannerMessage } from '@services/alert-banner-service/defaults';
import { AlertBannerDto, AlertBannerMessage } from '@data-contracts/backend/data-contracts';

interface IAlertBannerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  messageData: AlertBannerMessage;
  isEdit?: boolean;
}

const formSchema = yup
  .object({
    message: yup.string(),
    severity: yup.mixed<AlertBannerDto['severity']>().oneOf(['neutral', 'info', 'warning', 'error']),
  })
  .required();

const AlertBannerForm = ({
  isOpen,
  messageData = emptyAlertBannerMessage,
  onClose,
  onSuccess,
  isEdit = false,
}: IAlertBannerFormProps) => {
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorText, setSubmitErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const severityList: { value: AlertBannerMessage['severity']; label: string }[] = [
    { value: 'info', label: 'Information' },
    { value: 'warning', label: 'Varning' },
    { value: 'error', label: 'Kritisk' },
    { value: 'neutral', label: 'Neutral' },
  ];

  const { showConfirmation } = useConfirm();
  const message = useSnackbar();

  // form state
  const { register, handleSubmit, watch, reset, setValue } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: messageData,
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  useEffect(() => {
    if (isOpen) {
      reset(messageData);
      setSubmitError(false);
      setSubmitErrorText('');
    }
  }, [isOpen, messageData, reset]);

  const onSubmit = (formData: AlertBannerMessage) => {
    const apiCall = isEdit ? editAlertBannerMessage : newAlertBannerMessage;

    setSubmitErrorText('');
    setSubmitError(false);
    setIsLoading(true);
    apiCall({ ...formData }).then((r) => {
      if (!r.error) {
        setIsLoading(false);
        reset(emptyAlertBannerMessage);
        onSuccess();
        message({
          message: `Meddelandet har sparats`,
          status: 'success',
        });
      } else {
        setSubmitErrorText(r.message); // This needs to be verified, not sure how the return looks like
        setSubmitError(true);
        setIsLoading(false);
      }
    });
  };

  const onDelete = async () => {
    const shouldDelete = await showConfirmation(
      'Ta bort meddelande',
      'Är du säker på att du vill ta bort meddelandet?'
    );
    if (!shouldDelete) return;

    setSubmitErrorText('');
    setSubmitError(false);
    setIsLoading(true);
    deleteAlertBannerMessage(messageData.id).then((res) => {
      if (!res.error) {
        setIsLoading(false);
        reset(emptyAlertBannerMessage);
        onSuccess();
        message({
          message: `Meddelandet har tagits bort`,
          status: 'success',
        });
      } else {
        setSubmitErrorText('Det gick inte att ta bort meddelandet'); // This needs to be verified, not sure how the return looks like
        setSubmitError(true);
        setIsLoading(false);
      }
    });
  };

  const handleSelectSeverity: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setValue('severity', e.target.value as AlertBannerMessage['severity'], { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      label={isEdit ? 'Redigera systemmeddelande' : 'Nytt systemmeddelande'}
      className="max-w-screen-md"
    >
      <form
        id="system-message-modal-form"
        data-cy="systemMessage-div-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-16"
      >
        <div className="flex flex-col items-start gap-8">
          <FormControl id="system-message" className="w-full">
            <FormLabel>Systemmeddelande</FormLabel>
            <Textarea
              data-cy="systemMessage-input"
              {...register('message')}
              className="w-full"
              rows={4}
              placeholder="Systemmeddelande"
            />
          </FormControl>
          <FormControl id="severity" className="w-full">
            <FormLabel>Kritisk nivå</FormLabel>
            <Select
              data-cy="systemMessage-button-criticalLevel"
              className="w-full"
              value={watch().severity}
              placeholder="Välj kritisk nivå"
              onChange={handleSelectSeverity}
            >
              {severityList.map((severity) => (
                <Select.Option key={severity.value} value={severity.value}>
                  {severity.label}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
          {isEdit && (
            <Button
              data-cy="systemMessage-button-taBort"
              type="button"
              color="error"
              size="sm"
              variant="tertiary"
              onClick={onDelete}
              leftIcon={<Trash />}
            >
              Ta bort
            </Button>
          )}
        </div>
        {submitError && (
          <FormErrorMessage data-cy="systemMessage-span-notAuthorized">{submitErrorText}</FormErrorMessage>
        )}
      </form>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} type="button">
          Avbryt
        </Button>
        <Button
          data-cy="systemMessage-button-spara"
          className="ml-auto"
          type="submit"
          form="system-message-modal-form"
          variant="primary"
          color="primary"
          leftIcon={<Check />}
          loading={isLoading}
          loadingText="Sparar"
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertBannerForm;
