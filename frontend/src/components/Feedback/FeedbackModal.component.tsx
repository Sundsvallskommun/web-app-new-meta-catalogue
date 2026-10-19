import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  Textarea,
  useSnackbar,
  Select,
} from '@sk-web-gui/react';
import WarnIfUnsavedChanges from '@utils/warnIfUnsavedChanges';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import isEqual from 'lodash/isEqual';
import { feedbackSelectTypes, sendFeedback } from '@services/feedback-service';
import { FeedbackDto } from '@data-contracts/backend/data-contracts';

const formSchema = yup
  .object({
    type: yup.string().required('Typ av fel måste anges').min(1, 'Typ av fel måste anges'),
    body: yup.string().required('Anteckning måste anges'),
    typeLabel: yup.string(),
  })
  .required();

export const FeedbackModal: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  formData?: FeedbackDto;
}> = ({ isOpen = false, closeModal, formData = { body: '', type: '', typeLabel: '' } }) => {
  const [submitError, setSubmitError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const message = useSnackbar();

  const {
    control,
    watch,
    reset,
    setValue,
    trigger,
    getValues,
    formState,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: useMemo(() => {
      return formData;
    }, [formData]),
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const onSubmit = (formData: FeedbackDto) => {
    const dataBody = {
      ...formData,
      typeLabel: feedbackSelectTypes.find((x) => x.type == formData.type).label,
    };
    setIsLoading(true);
    sendFeedback(dataBody).then((success) => {
      if (success) {
        setSubmitError(false);
        message({
          message: 'Din feedback har skickats',
          status: 'success',
        });
        closeModal();
        reset();
      } else {
        setSubmitError(true);
      }
      setIsLoading(false);
    });
  };

  const handleOnClose = async () => {
    if (!isEqual(formData, getValues())) {
      const shouldClose = await window.confirm(
        'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?'
      );
      if (!shouldClose) return;
    }
    reset();
    closeModal();
  };

  const handleOnSelectTypeChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const val = e.target.value;
    const value = feedbackSelectTypes.find((x) => x.label === val);
    setValue('type', value.type);
    trigger('type');
  };

  const formDataMemo = useMemo(() => formData, [formData]);

  useEffect(() => {
    reset({
      ...formDataMemo,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formDataMemo]);

  const selectTypeValue = feedbackSelectTypes.find((x) => x.type == watch().type);

  return (
    <Modal show={isOpen} label="Rapportera fel" onClose={handleOnClose} className="max-w-screen-md">
      <WarnIfUnsavedChanges showWarning={!isEqual(formState.defaultValues, getValues())}>
        <form id="feedback-modal-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-16">
          <FormControl id="type" className="w-full">
            <FormLabel>Typ av fel</FormLabel>
            <Select
              placeholder="Välj typ"
              className="w-full"
              onChange={handleOnSelectTypeChange}
              defaultValue={selectTypeValue?.type ? selectTypeValue.label : feedbackSelectTypes[0].label}
            >
              {feedbackSelectTypes.map((c) => (
                <Select.Option data-cy="nav-li" key={`${c.label}`} value={c.label}>
                  {c.label}
                </Select.Option>
              ))}
            </Select>
            {errors.type && <FormErrorMessage key={`type-errors`}>{errors.type?.message}</FormErrorMessage>}
          </FormControl>
          <FormControl id="body" className="w-full">
            <FormLabel>Detaljbeskrivning</FormLabel>
            <Controller
              control={control}
              name="body"
              render={({ field: { onChange, value, ref } }) => (
                <Textarea
                  data-cy="nav-textArea"
                  className="w-full"
                  showCount={true}
                  maxLength={4000}
                  maxLengthWarningText="Max-antalet tecken är 4000"
                  placeholder="Beskrivning..."
                  rows={6}
                  onChange={onChange} // send value to hook form
                  value={value}
                  ref={ref}
                />
              )}
            />
            {errors.body && <FormErrorMessage key={`body-errors`}>{errors.body?.message}</FormErrorMessage>}
          </FormControl>
          {submitError && (
            <FormErrorMessage key={`formData-errors`}>Det gick inte att skicka meddelandet</FormErrorMessage>
          )}
        </form>
        <Modal.Footer>
          <Button data-cy="nav-button-avbryt" onClick={handleOnClose} type="button" variant="secondary">
            Avbryt
          </Button>
          <Button
            data-cy="nav-button-rapportera"
            type="submit"
            form="feedback-modal-form"
            variant="primary"
            color="primary"
            className="ml-auto"
            disabled={!formState.isDirty}
            loading={isLoading}
            loadingText="Skickar"
          >
            Rapportera
          </Button>
        </Modal.Footer>
      </WarnIfUnsavedChanges>
    </Modal>
  );
};
