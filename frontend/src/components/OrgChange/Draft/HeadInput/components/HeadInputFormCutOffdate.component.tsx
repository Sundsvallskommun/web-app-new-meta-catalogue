import { SaveDraft } from '@interfaces/orgchange';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';

export const HeadInputFormCutOffdate: React.FC = () => {
  const {
    formState: { errors },
    register,
    setValue,
  } = useFormContext<SaveDraft>();

  const handleCutOffDateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setValue('cutOffDate', dayjs(value).set('date', 1).format('YYYY-MM-DD'), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <FormControl id="orgchange-draft-cutOffDate" invalid={!!errors?.cutOffDate} className="md:flex items-end w-fit">
      <FormLabel className="inline text-sm font-bold mr-sm" showRequired>
        Brytdatum:
      </FormLabel>
      <Input
        data-cy="orgchange-draft-cutOffDate"
        required
        aria-labelledby="orgchange-draft-cutOffDate-label"
        aria-label="Planerat brytdatum"
        className="text-sm -mb-[.55rem] w-fit max-w-[14rem] font-bold bg-transparent shadow-none border-0 p-0 !h-[20px] max-h-fit text-primary"
        type="date"
        {...register('cutOffDate')}
        onChange={handleCutOffDateChange}
      />
      {errors.cutOffDate && (
        <FormErrorMessage id="orgchange-draft-cutOffDate-error" className="sr-only">
          {errors.cutOffDate?.message as string}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
