import { Dialog, Transition } from '@headlessui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormControl, FormErrorMessage, FormLabel, Textarea, useMessage } from '@sk-web-gui/react';
import { Select } from '@sk-web-gui/forms';
import WarnIfUnsavedChanges from '@utils/warnIfUnsavedChanges';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import isEqual from 'lodash/isEqual';
import CloseIcon from '@mui/icons-material/Close';
import { feedbackSelectTypes, sendFeedback } from '@services/feedback-service';
import LeadButtons from '@layouts/ButtonGroup/LeadButtons';
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
  const initialFocus = useRef(null);
  const [submitError, setSubmitError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const message = useMessage();

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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        open={isOpen}
        as="div"
        className="fixed inset-0 z-20 overflow-y-auto bg-opacity-50 bg-gray-500"
        onClose={handleOnClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-screen-md px-md py-lg sm:px-16 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded">
              <div className="flex flex-between w-full mb-lg">
                <Dialog.Title as="h4" className={`grow text-xl`}>
                  Rapportera fel
                </Dialog.Title>
                <button
                  className="p-4 -m-4"
                  aria-label="Stäng feedback"
                  ref={initialFocus}
                  onClick={() => handleOnClose()}
                >
                  <CloseIcon className="material-icon" />
                </button>
              </div>

              <WarnIfUnsavedChanges showWarning={!isEqual(formState.defaultValues, getValues())}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <fieldset>
                      <FormLabel>
                        <strong>Typ av fel</strong>
                      </FormLabel>
                      <Select
                        placeholder="Välj typ"
                        className="w-full mt-[6px]"
                        onChange={handleOnSelectTypeChange}
                        defaultValue={selectTypeValue?.type ? selectTypeValue.label : feedbackSelectTypes[0].label}
                      >
                        {feedbackSelectTypes.map((c) => (
                          <Select.Option data-cy="nav-li" key={`${c.label}`} value={c.label}>
                            {c.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </fieldset>
                    {errors.type && <FormErrorMessage key={`type-errors`}>{errors.type?.message}</FormErrorMessage>}
                  </div>
                  <div className="flex my-md">
                    <FormControl id="body">
                      <FormLabel>
                        <strong>Detaljbeskrivning</strong>
                      </FormLabel>
                      <Controller
                        control={control}
                        name="body"
                        render={({ field: { onChange, value, ref } }) => (
                          <Textarea
                            data-cy="nav-textArea"
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
                  </div>

                  {submitError && (
                    <div className="flex my-md">
                      <FormErrorMessage key={`formData-errors`}>Det gick inte att skicka meddelandet</FormErrorMessage>
                    </div>
                  )}
                  <LeadButtons className="pb-md">
                    <Button
                      data-cy="nav-button-avbryt"
                      onClick={handleOnClose}
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      Avbryt
                    </Button>
                    <Button
                      data-cy="nav-button-rapportera"
                      type="submit"
                      variant="solid"
                      size="lg"
                      color="primary"
                      className="w-full"
                      disabled={!formState.isDirty}
                      loading={isLoading}
                      loadingText="Skickar"
                    >
                      Rapportera
                    </Button>
                  </LeadButtons>
                </form>
              </WarnIfUnsavedChanges>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
