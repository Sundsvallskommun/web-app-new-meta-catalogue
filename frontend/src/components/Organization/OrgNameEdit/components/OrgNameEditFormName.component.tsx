import { HelpTooltip } from '@components/Tooltip/HelpTooltip.component';
import { IOrgNameEditForm } from '@interfaces/orgchange';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';

export const OrgNameEditFormName: React.FC<{ newItem: boolean }> = ({ newItem }) => {
  const {
    formState: { errors },
    register,
    watch,
    setValue,
  } = useFormContext<IOrgNameEditForm>();
  const helpText = 'Grenens namn kan max ha 30 tecken.';

  return (
    <FormControl id="orgname" invalid={!!errors?.orgName}>
      <FormLabel>
        <strong>Namn</strong>
        <HelpTooltip aria-hidden="true" tabIndex={-1} onlyIcon={true}>
          {helpText}
        </HelpTooltip>
      </FormLabel>
      <Input.Group
        size="sm"
        invalid={errors.orgName?.message ? true : undefined}
        aria-invalid={errors.orgName?.message ? true : undefined}
      >
        <Input
          {...register('orgName')}
          onFocus={() => watch().orgName === 'Ny gren' && setValue('orgName', '')}
          title="Organizationsnamn, a-Ö, 0-9, mellanslag eller följande tecken ,.-_"
          pattern="^[a-zA-Z0-9åäöÅÄÖ\s,\._\-]*$"
          placeholder={newItem ? 'Ny gren' : 'Organisationsnamn'}
          // maxLength={30}
          className={`lg:min-w-[26.5rem] border-r-0`}
        />
        <Input.RightAddin>{watch().orgName.length}/30</Input.RightAddin>
      </Input.Group>
      <span className="sr-only" id="orgname-helptext">
        {helpText}
      </span>
      {errors.orgName && <FormErrorMessage id="orgname-error">{errors.orgName?.message as string}</FormErrorMessage>}
    </FormControl>
  );
};
