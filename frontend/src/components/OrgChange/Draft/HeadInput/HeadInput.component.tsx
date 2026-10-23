import { Draft } from '@data-contracts/backend/data-contracts';
import { yupResolver } from '@hookform/resolvers/yup';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, useSnackbar } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useSaveState } from '@utils/use-save-service.hook';
import dayjs from 'dayjs';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { HeadInputFormCutOffdate } from './components/HeadInputFormCutOffdate.component';
import { HeadInputFormName } from './components/HeadInputFormName.component';
import { useUserStore } from '@services/user-service/user-service';

const HeadInput = () => {
  const draft = useOrgChangeStore((s) => s.draft);
  const saveDraft = useOrgChangeStore((s) => s.saveDraft);
  const [, setIsLoading] = useState<boolean>(false);
  const setIsSaving = useSaveStore((s) => s.setIsSaving);
  const { draftIsReadOnly } = useDraftPhaseState();
  const user = useUserStore((s) => s.user);
  const readOnly = draftIsReadOnly || !user.permissions.canEditDrafts;

  const message = useSnackbar();
  const router = useRouter();

  const formSchema = yup
    .object({
      name: yup.string().required(),
      companyId: yup.number().required(),
      cutOffDate: yup.string().required(),
    })
    .required();

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: useMemo(() => {
      return { name: draft.name, cutOffDate: draft.cutOffDate, companyId: draft.companyId };
    }, [draft.name, draft.cutOffDate, draft.companyId]),
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const {
    handleSubmit,
    reset,
    formState: { defaultValues, isDirty, isValid, errors },
  } = form;

  const onSubmit = (formData: Draft) => {
    const dataBody: Partial<Draft> = {
      name: defaultValues.name !== formData.name ? formData.name : undefined,
      companyId: defaultValues.companyId,
      cutOffDate:
        defaultValues.cutOffDate !== dayjs(formData.cutOffDate).format('YYYY-MM-DD') ?
          dayjs(formData.cutOffDate).format('YYYY-MM-DD')
        : undefined,
      description: !draft.draftId ? '' : undefined,
    };

    setIsLoading(true);
    setIsSaving(true);
    saveDraft({ ...dataBody }).then((res) => {
      if (!res.error) {
        reset(dataBody);
        message({
          message: `Utkastet sparas`,
          status: 'success',
        });
        if (res.data.draftId !== null) {
          router.push(`/hanteraorganisation/utkast/${res.data.draftId}`);
        }
      } else {
        message({
          message: res.message,
          status: 'error',
        });
        reset();
      }
      setIsLoading(false);
      setIsSaving(false);
    });
  };

  useSaveState('orgchange-headinput', isDirty);

  useEffect(() => {
    if (errors !== undefined) {
      Object.keys(errors).forEach((errorName) => {
        const error = errors[errorName];
        message({
          message: error.message,
          status: 'error',
          duration: 30000,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {readOnly ?
          <h1 className="text-h4 text-dark-secondary">{draft.name}</h1>
        : <div className="flex flex-wrap items-end gap-md">
            <HeadInputFormName />
            <HeadInputFormCutOffdate />
            {isValid && isDirty && (
              <Button data-cy="draft-submit" type="submit" variant="primary" color="primary" disabled={!isValid}>
                Spara
              </Button>
            )}
          </div>
        }
        <p className="text-small text-dark-secondary">
          {readOnly && `Brytdatum ${draft.cutOffDate} · `}
          {draft.companyName}
          {draft.loginname && ` · Skapad av ${draft.loginname}`}
        </p>
      </form>
    </FormProvider>
  );
};
export default HeadInput;
