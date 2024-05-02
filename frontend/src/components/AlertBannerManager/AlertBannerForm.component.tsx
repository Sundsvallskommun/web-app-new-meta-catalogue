import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, useConfirm, useMessage } from '@sk-web-gui/react';
import { Select } from '@sk-web-gui/forms';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import {
  deleteAlertBannerMessage,
  editAlertBannerMessage,
  newAlertBannerMessage,
} from '@services/alert-banner-service/alert-banner-service';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
      initialFocus.current && initialFocus.current.focus();
    });
  };

  const { showConfirmation } = useConfirm();
  const message = useMessage();

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

        <Button type="submit" data-cy="systemMessage-button-spara" color="primary" variant="solid" size="sm">
          Spara
        </Button>
        {isEdit && (
          <Button
            data-cy="systemMessage-button-taBort"
            className="text-gray"
            type="button"
            onClick={onDelete}
            variant="link"
            leftIcon={<DeleteOutlineIcon fontSize="large" className="mr-sm" />}
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
          <CloseOutlinedIcon className="material-icon !text-2xl" />
        </button>
        {submitError && (
          <span
            data-cy="systemMessage-span-notAuthorized"
            className="bg-red bg-opacity-5 p-2 pr-4 rounded-md border text-red border-red"
          >
            <ErrorOutlinedIcon className="material-icon mr-sm !text-2xl " />
            {submitErrorText}
          </span>
        )}
      </div>
    </form>
  );
};

export default AlertBannerForm;
