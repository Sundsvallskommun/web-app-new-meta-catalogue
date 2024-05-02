import { HelpTooltip } from '@components/Tooltip/HelpTooltip.component';
import { IOrgNameEditForm } from '@interfaces/orgchange';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';

export const OrgNameEditFormAbbreviation: React.FC = () => {
  const {
    formState: { errors },
    register,
  } = useFormContext<IOrgNameEditForm>();

  const helpText = 'Grenens förkortning kan endast bestå av 3 tecken som är versala. Exempelvis: ABC eller AB1';

  return (
    <FormControl id="abbreviation" invalid={!!errors?.abbreviation}>
      <FormLabel>
        <strong>Förkortning</strong>
        <HelpTooltip aria-hidden="true" tabIndex={-1} onlyIcon={true}>
          Grenens förkortning kan endast bestå av 3 tecken som är versala. Exempelvis: ABC, AB1, AB2, CAB
        </HelpTooltip>
      </FormLabel>
      <Input
        {...register('abbreviation')}
        invalid={errors.abbreviation?.message ? true : undefined}
        aria-invalid={errors.abbreviation?.message ? true : undefined}
        placeholder="ABC"
        size="sm"
        maxLength={3}
        title="Förkortning, A-Ö"
        pattern={`^[a-zA-ZåäöÅÄÖ]*$`}
        className="uppercase"
      />
      <span className="sr-only" id="abbreviation-helptext">
        {helpText}
      </span>
      {errors.abbreviation && (
        <FormErrorMessage id="abbreviation-error">{errors.abbreviation?.message as string}</FormErrorMessage>
      )}
    </FormControl>
  );
};
