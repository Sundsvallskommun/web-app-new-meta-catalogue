import * as yup from 'yup';

import FeedbackMessage from '@components/FeedbackMessage/FeedbackMessage.component';
import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationTree, OrganizationTree } from '@data-contracts/backend/data-contracts';
import { yupResolver } from '@hookform/resolvers/yup';
import { IOrgNameEditForm } from '@interfaces/orgchange';
import { ServiceResponse } from '@interfaces/service';
import { emptyOrganizationForm } from '@services/mdbuilder/defaults';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, cx, useMessage } from '@sk-web-gui/react';
import { findIdInTree } from '@utils/findIdInTree';
import { useSaveState } from '@utils/use-save-service.hook';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { OrgNameEditFormAbbreviation } from './components/OrgNameEditFormAbbreviation.component';
import { OrgNameEditFormCode } from './components/OrgNameEditFormCode.component';
import { OrgNameEditFormName } from './components/OrgNameEditFormName.component';
import { OrgNameEditFormShortName } from './components/OrgNameEditFormShortName.component';

export const OrgNameEditForm: React.FC<{
  newItem: boolean;
  orgTree: OrganizationTree[];
  orgChangeOrg: OrgChangeOrganizationTree;
  formData?: IOrgNameEditForm;
  className?;
  submitCallback: (data: IOrgNameEditForm) => Promise<ServiceResponse<boolean>>;
}> = ({ newItem, formData = emptyOrganizationForm, className, submitCallback, orgTree, orgChangeOrg }) => {
  const { isOrgChange } = useAppContext();
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [, setIsLoading] = useState<boolean>(false);
  const [submitErrorText, setSubmitErrorText] = useState<string>('');
  const [warningText, setWarningText] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');
  const [parentOrg, setParentOrg] = useState<OrganizationTree>(findIdInTree(orgTree, formData.parentId, 'subItems'));
  const message = useMessage();
  const setIsSaving = useSaveStore((s) => s.setIsSaving);

  const parentOrgAbbreviations = (abbreviations, parentOrg: OrganizationTree) => {
    const nextParentOrg: OrganizationTree = findIdInTree(orgTree, parentOrg.parentId, 'subItems');
    if (nextParentOrg) {
      if (nextParentOrg.abbreviation) {
        abbreviations = nextParentOrg.abbreviation + ' ' + abbreviations;
      } else {
        abbreviations = abbreviations;
      }
      return parentOrgAbbreviations(abbreviations, nextParentOrg);
    } else {
      return abbreviations ? abbreviations + ' ' : '';
    }
  };

  const parentOrgShortNamesString = parentOrg ? parentOrgAbbreviations(parentOrg.abbreviation || '', parentOrg) : '';
  const textLength = 30 - parentOrgShortNamesString.length;
  let orgNameShortMaxLength;

  if (!parentOrg?.abbreviation && textLength !== 30) {
    orgNameShortMaxLength = 31 - parentOrgShortNamesString.length;
  } else {
    orgNameShortMaxLength = textLength;
  }

  const getParentResponsibilityCode = (
    parentOrg: OrganizationTree,
    responsibilityCode: string,
    correctResponsibilityCodeLength: boolean
  ) => {
    if (parentOrg) {
      const responsibilityInList = parentOrg.responsibilityList
        ?.split(',')
        .find((x) => x && responsibilityCode.startsWith(x));

      if (responsibilityInList) {
        // Virtual parent
        return responsibilityInList;
      }
      if (parentOrg?.responsibilityCode) {
        return parentOrg.responsibilityCode || '';
      }
    }
    return correctResponsibilityCodeLength ? responsibilityCode.substring(0, responsibilityCode.length - 1) : '';
  };

  const formSchema = yup
    .object({
      orgName: yup.string().max(30, 'Namn är för långt'),
      orgNameShort: yup.string().max(orgNameShortMaxLength, 'Kortnamn är för långt'),
      abbreviation: yup.string().max(3, 'Förkortning är för långt'),
      responsibilityCode: yup.string().max(1, 'Kod är för långt'),
      parentResponsibilityCode: yup.string(),
    })
    .required();

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: useMemo(() => {
      return { ...formData, responsibilityCode: formData.responsibilityCode || '', parentResponsibilityCode: '' };
    }, [formData]),
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const {
    reset,
    getValues,
    setValue,
    trigger,
    formState: { isDirty },
  } = form;

  useSaveState('organization', isDirty);
  const onSubmit = (data: IOrgNameEditForm) => {
    if (!isDirty) return;

    const dataResponsibilityCode = data.responsibilityCode ? data.responsibilityCode : '';

    const responsibilityCode = data.parentResponsibilityCode + dataResponsibilityCode;

    const dataBody: IOrgNameEditForm = {
      ...data,
      abbreviation: data.abbreviation ? data.abbreviation.toUpperCase() : null,
      responsibilityCode: responsibilityCode ? responsibilityCode : null,
    };

    setSubmitError(false);
    setIsLoading(true);
    setIsSaving(true);
    submitCallback({ ...dataBody }).then((res) => {
      if (!res.error) {
        reset();
        message({
          message: `Ändringarna har sparats`,
          status: 'success',
        });
      } else {
        setSubmitError(true);
        setSubmitErrorText(res.message);
      }
      setIsLoading(false);
      setIsSaving(false);
    });
  };

  const handleFormSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, ...getValues() });
  };

  const updateDefaults = useMemo(() => ({ formData: formData, orgTree: orgTree }), [formData, orgTree]);

  useEffect(() => {
    setSubmitError(false);
    setSubmitErrorText('');
    setWarningText('');
    setErrorText('');

    const parentOrg: OrganizationTree = findIdInTree(orgTree, formData.parentId, 'subItems');
    setParentOrg(parentOrg);
    const abbreviation = formData.abbreviation ? formData.abbreviation.substring(0, 3) : '';
    setValue('abbreviation', abbreviation);

    const dataResponsibilityCode = formData.responsibilityCode ? formData.responsibilityCode : '';
    const correctResponsibilityCodeLength = formData.treeLevel - 1 == dataResponsibilityCode.length;
    const maskedResponsibilityCode = correctResponsibilityCodeLength
      ? dataResponsibilityCode.substring(dataResponsibilityCode.length - 1)
      : '';

    const parentOrgResponsibilityCode = getParentResponsibilityCode(
      parentOrg,
      dataResponsibilityCode,
      correctResponsibilityCodeLength
    );
    const correctParentResponsibilityCodeLength = formData.treeLevel - 2 == parentOrgResponsibilityCode.length;

    if (!correctParentResponsibilityCodeLength) {
      setWarningText('Ansvarskod saknas på en högre nivå');
    }

    const parentOrgResponsibilityCodeHasChanged =
      dataResponsibilityCode.length - 1 === parentOrgResponsibilityCode.length &&
      parentOrgResponsibilityCode !== dataResponsibilityCode.substring(0, dataResponsibilityCode.length - 1);

    if (correctParentResponsibilityCodeLength && parentOrgResponsibilityCodeHasChanged) {
      setWarningText(
        `Ansvarskoden för en högre nivå har ändrats. '${formData.responsibilityCode}' kommer ändras till '${parentOrgResponsibilityCode}${maskedResponsibilityCode}'. Tryck 'Spara' för att justera till den nya ansvarskoden på den här nivån.`
      );
    }

    reset({
      ...formData,
      responsibilityCode: maskedResponsibilityCode,
      abbreviation: abbreviation,
      parentResponsibilityCode: parentOrgResponsibilityCode,
    });
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDefaults]);

  useEffect(() => {
    trigger('orgNameShort');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgNameShortMaxLength]);

  return (
    <FormProvider {...form}>
      <form className={cx(className, '')} onSubmit={handleFormSubmit}>
        <div className="lg:flex lg:space-x-md">
          <OrgNameEditFormName newItem={newItem} />
          <OrgNameEditFormShortName newItem={newItem} orgNameShortMaxLength={orgNameShortMaxLength} />
          {!formData.isLeafLevel && <OrgNameEditFormAbbreviation />}
          <OrgNameEditFormCode parentOrg={parentOrg} />
        </div>
        <div className="flex justify-between mt-md">
          {orgChangeOrg?.structureChangeStatus !== 'DELETED' && (
            <div className="feedback-texts">
              {errorText && <FeedbackMessage severity="error">{errorText}</FeedbackMessage>}
              {warningText && <FeedbackMessage severity="warning">{warningText}</FeedbackMessage>}
              {submitError && (
                <FeedbackMessage severity="error" className="mt-md" background>
                  {submitErrorText}
                </FeedbackMessage>
              )}
            </div>
          )}

          {isOrgChange && orgChangeOrg?.structureChangeStatus !== 'DELETED' && (
            <div>
              <Button
                aria-describedby={!isDirty ? `save-describedby` : undefined}
                aria-disabled={!isDirty ? 'true' : undefined}
                color="primary"
                variant="solid"
                size="sm"
                type="submit"
              >
                Spara
              </Button>
              <span className="sr-only" aria-hidden id="save-describedby">
                Ändringar i formuläret krävs för att spara
              </span>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default OrgNameEditForm;
