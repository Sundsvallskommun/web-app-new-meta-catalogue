import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, useConfirm, useSnackbar, Select, Icon } from '@sk-web-gui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CircleAlert, Trash, X } from 'lucide-react';
import {
  deleteAlertBannerMessage,
  editAlertBannerMessage,
  newAlertBannerMessage,
} from '@services/alert-banner-service/alert-banner-service';
import { emptyAlertBannerMessage } from '@services/alert-banner-service/defaults';
import { AlertBannerDto, AlertBannerMessage } from '@data-contracts/backend/data-contracts';

interface IAlertBannerFormProps {
  onClose: () => void;
  onSuccess: () => void;
  messageData: AlertBannerMessage;
  isEdit?: boolean;
  setSeverityFromForm?: (severity: AlertBannerMessage['severity']) => void;
}

const formSchema = yup
  .object({
    message: yup.string(),
    severity: yup.mixed<AlertBannerDto['severity']>().oneOf(['neutral', 'info', 'warning', 'error']),
  })
  .required();

const AlertBannerForm = ({
  messageData = emptyAlertBannerMessage,
  onClose,
  onSuccess,
  isEdit = false,
  setSeverityFromForm,
}: IAlertBannerFormProps) => {
  const [submitError, setSubmitError] = useState(false);
  const [submitErrorText, setSubmitErrorText] = useState('');
  const [, setIsLoading] = useState(false);

  const severityList: AlertBannerMessage['severity'][] = ['info', 'warning', 'error', 'neutral'];

  const initialFocus = useRef(null);

  const setInitialFocus = () => {
    setTimeout(() => {
      if (initialFocus.current) {
        initialFocus.current.focus();
      }
    });
  };

  const { showConfirmation } = useConfirm();
  const message = useSnackbar();

  // form state
  const { register, handleSubmit, watch, reset, setValue, trigger } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: useMemo(() => {
      return messageData;
    }, [messageData]),
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const onCloseHandler = () => {
    reset();
    onClose();
  };

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
    const value = e.target.value;
    setValue('severity', value);
    trigger('severity');
    setSeverityFromForm(value);
  };

  useEffect(() => {
    setInitialFocus();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div data-cy="systemMessage-div-form" className="flex items-center gap-lg">
        <Input
          data-cy="systemMessage-input"
          ref={initialFocus}
          {...register('message')}
          className="flex-grow"
          size="sm"
          aria-label="Systemmeddelande"
          placeholder="Systemmeddelande..."
        />
        <div className="w-1/3 z-30">
          <Select
            data-cy="systemMessage-button-criticalLevel"
            aria-label="Kritisk nivå"
            id="severity"
            className="w-full"
            size="md"
            defaultValue={watch().severity}
            placeholder={'Välj kritisk nivå'}
            onChange={handleSelectSeverity}
          >
            {severityList.map((severity) => (
              <Select.Option key={`${severity}`} value={severity}>
                {severity}
              </Select.Option>
            ))}
          </Select>
        </div>

        <Button type="submit" data-cy="systemMessage-button-spara" color="primary" variant="primary" size="sm">
          Spara
        </Button>
        {isEdit && (
          <Button
            data-cy="systemMessage-button-taBort"
            className="text-dark-secondary"
            type="button"
            onClick={onDelete}
            variant="link"
            leftIcon={<Trash />}
          >
            Ta bort
          </Button>
        )}
        <button
          aria-label="Stäng redigering av systemmeddelande"
          type="button"
          onClick={onCloseHandler}
          className="p-sm -m-sm"
        >
          <Icon icon={<X />} />
        </button>
        {submitError && (
          <span
            data-cy="systemMessage-span-notAuthorized"
            className="bg-error-background-100 p-2 pr-4 rounded-md border text-error border-error-surface-primary"
          >
            <Icon className="mr-sm" icon={<CircleAlert />} />
            {submitErrorText}
          </span>
        )}
      </div>
    </form>
  );
};

export default AlertBannerForm;
