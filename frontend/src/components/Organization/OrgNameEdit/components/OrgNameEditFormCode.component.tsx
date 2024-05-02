import { OrganizationTree } from '@data-contracts/backend/data-contracts';
import { IOrgNameEditForm } from '@interfaces/orgchange';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/react';
import { Select } from '@sk-web-gui/forms';
import { useFormContext } from 'react-hook-form';

interface OrgNameEditFormCodeProps {
  parentOrg: OrganizationTree;
}

export const OrgNameEditFormCode: React.FC<OrgNameEditFormCodeProps> = ({ parentOrg }: OrgNameEditFormCodeProps) => {
  const {
    formState: { errors },
    watch,
    setValue,
    register,
  } = useFormContext<IOrgNameEditForm>();

  const helpText = ``;

  const handleSetParentRespCode = (value) => {
    setValue('parentResponsibilityCode', value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const getParentCodeElement = (parentOrg: OrganizationTree) => {
    if (parentOrg && parentOrg.responsibilityList !== null) {
      const responsibilityList = parentOrg.responsibilityList.split(',');
      return (
        <fieldset>
          <Select
            size="sm"
            className="p-xs min-h-fit"
            onSelectValue={handleSetParentRespCode}
            defaultValue={watch().parentResponsibilityCode}
          >
            {responsibilityList.map((c) => (
              <Select.Option key={`${c}`} value={c}>
                {c}
              </Select.Option>
            ))}
          </Select>
        </fieldset>
      );
    } else {
      return watch().parentResponsibilityCode;
    }
  };

  return (
    <FormControl id="respcode" invalid={!!errors?.responsibilityCode}>
      <FormLabel>
        <strong>Kod</strong>
      </FormLabel>
      <Input.Group
        size="sm"
        invalid={errors.responsibilityCode?.message ? true : undefined}
        aria-invalid={errors.responsibilityCode?.message ? true : undefined}
      >
        {watch().parentResponsibilityCode && (
          <Input.LeftAddon className="text-gray">{getParentCodeElement(parentOrg)}</Input.LeftAddon>
        )}

        <Input
          {...register('responsibilityCode')}
          min={0}
          max={9}
          step={1}
          title="Ansvarskod, 1 bokstav eller siffra 0-9"
          maxLength={1}
          pattern="^[0-9]$"
          aria-labelledby="respcode-label"
        />
      </Input.Group>
      <span className="sr-only" id="respcode-helptext">
        {helpText}
      </span>
      {errors.responsibilityCode && (
        <FormErrorMessage id="respcode-error">{errors.responsibilityCode?.message as string}</FormErrorMessage>
      )}
    </FormControl>
  );
};
