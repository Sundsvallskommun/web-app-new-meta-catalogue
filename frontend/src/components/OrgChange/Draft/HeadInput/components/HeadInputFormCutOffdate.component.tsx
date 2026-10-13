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
    <FormControl id="orgchange-draft-cutOffDate" invalid={!!errors?.cutOffDate} className="w-fit">
      <FormLabel showRequired>Brytdatum</FormLabel>
      <Input
        data-cy="orgchange-draft-cutOffDate"
        required
        aria-labelledby="orgchange-draft-cutOffDate-label"
        aria-label="Planerat brytdatum"
        type="date"
        size="sm"
        {...register('cutOffDate')}
        onChange={handleCutOffDateChange}
      />
      {errors.cutOffDate && (
        <FormErrorMessage id="orgchange-draft-cutOffDate-error">
          {errors.cutOffDate?.message as string}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
