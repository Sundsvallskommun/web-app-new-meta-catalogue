import { HelpTooltip } from '@components/Tooltip/HelpTooltip.component';
import { IOrgNameEditForm } from '@interfaces/orgchange';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';

interface OrgNameEditFormShortNameProps {
  orgNameShortMaxLength: string;
  newItem: boolean;
}

export const OrgNameEditFormShortName: React.FC<OrgNameEditFormShortNameProps> = ({
  orgNameShortMaxLength,
  newItem,
}: OrgNameEditFormShortNameProps) => {
  const {
    formState: { errors },
    register,
    watch,
    setValue,
  } = useFormContext<IOrgNameEditForm>();

  const helpText = `Grenens kortnamn kan max ha ${orgNameShortMaxLength} tecken. Det beror på att ${
    (30 - parseInt(orgNameShortMaxLength)) / 4
  } förkortningar automatiskt läggs till från grenens föräldrar.`;

  return (
    <FormControl id="orgshortname" invalid={!!errors?.orgNameShort}>
      <FormLabel>
        <strong>Kortnamn</strong>
        <HelpTooltip aria-hidden="true" tabIndex={-1} onlyIcon={true}>
          {helpText}
        </HelpTooltip>
      </FormLabel>
      <Input.Group
        size="sm"
        invalid={errors.orgNameShort?.message ? true : undefined}
        aria-invalid={errors.orgNameShort?.message ? true : undefined}
      >
        <Input
          {...register('orgNameShort')}
          onFocus={() => watch().orgNameShort === 'Ny gren' && setValue('orgNameShort', '')}
          title="Tillåtna tecken: a-Ö, 0-9, mellanslag eller följande tecken ,.-_"
          pattern="^[a-zA-Z0-9åäöÅÄÖ\s,\._\-]*$"
          placeholder={newItem ? 'Ny gren' : ''}
          // maxLength={textLengthMax}
          className="lg:min-w-[26.5rem] border-r-0"
        />
        <Input.RightAddin>
          {watch().orgNameShort.length}/{orgNameShortMaxLength}
        </Input.RightAddin>
      </Input.Group>
      <span className="sr-only" id="orgshortname-helptext">
        {helpText}
      </span>
      {errors.orgNameShort && (
        <FormErrorMessage id="orgshortname-error">{errors.orgNameShort?.message as string}</FormErrorMessage>
      )}
    </FormControl>
  );
};
