import { OrganizationTree } from '@data-contracts/backend/data-contracts';
import { IOrgNameEditForm } from '@interfaces/orgchange';
import { FormControl, FormErrorMessage, FormLabel, Input, Select } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { ParentCode } from './ParentCode.component';

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

  const parentCode = watch().parentResponsibilityCode;
  const parentCodeChoices = parentOrg?.responsibilityList?.split(',');
  const invalid = errors.responsibilityCode?.message ? true : undefined;

  const codeInputProps = {
    ...register('responsibilityCode'),
    className: 'w-full min-w-0',
    min: 0,
    max: 9,
    step: 1,
    title: 'Ansvarskod, 1 bokstav eller siffra 0-9',
    maxLength: 1,
    pattern: '^[0-9]$',
    'aria-labelledby': 'respcode-label',
  };

  return (
    <FormControl id="respcode" className="w-full min-w-0" invalid={!!errors?.responsibilityCode}>
      <FormLabel>Kod</FormLabel>
      {parentCode && parentCodeChoices ?
        <Input.OuterGroup size="sm" className="w-full">
          <Input.LeftAddon>
            <Select size="sm" onSelectValue={handleSetParentRespCode} defaultValue={parentCode}>
              {parentCodeChoices.map((c) => (
                <Select.Option key={`${c}`} value={c}>
                  {c}
                </Select.Option>
              ))}
            </Select>
          </Input.LeftAddon>
          <Input {...codeInputProps} invalid={invalid} aria-invalid={invalid} />
        </Input.OuterGroup>
      : <Input.InnerGroup size="sm" className="w-full" invalid={invalid} aria-invalid={invalid}>
          {parentCode && (
            <Input.LeftAddin>
              <ParentCode code={parentCode} size="sm" />
            </Input.LeftAddin>
          )}
          <Input {...codeInputProps} />
        </Input.InnerGroup>
      }
      <span className="sr-only" id="respcode-helptext">
        {helpText}
      </span>
      {errors.responsibilityCode && (
        <FormErrorMessage id="respcode-error">{errors.responsibilityCode?.message as string}</FormErrorMessage>
      )}
    </FormControl>
  );
};
