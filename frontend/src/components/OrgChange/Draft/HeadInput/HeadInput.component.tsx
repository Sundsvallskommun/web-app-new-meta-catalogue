import { Draft } from '@data-contracts/backend/data-contracts';
import { yupResolver } from '@hookform/resolvers/yup';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useSaveStore } from '@services/save-service/save-service';
import { Button, useMessage } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useSaveState } from '@utils/use-save-service.hook';
import { useWindowSize } from '@utils/use-window-size.hook';
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
  const windowSize = useWindowSize();
  const user = useUserStore((s) => s.user);

  const message = useMessage();
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
      <div className="lg:w-[440px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-sm text-gray lg:flex lg:justify-between lg:items-end">
            {draftIsReadOnly || !user.permissions.canEditDrafts ?
              <div className="flex w-full items-end gap-[1rem]">
                <div className="flex items-end w-fit">
                  <span className="font-bold mr-sm inline-block">Brytdatum: </span>
                  <span className="inline-block">{draft.cutOffDate} </span>
                </div>
              </div>
            : <div className="flex w-full items-end gap-[1rem]">
                <HeadInputFormCutOffdate />
              </div>
            }
            <div className="text-sm grow flex form-label">
              <span className="font-bold lg:sr-only">Bolag: </span>
              <div className="ml-sm grow lg:ml-0 whitespace-nowrap" aria-labelledby="draft-company-label">
                {windowSize.lg ? `(${draft.companyName})` : `${draft.companyName}`}
              </div>
            </div>
          </div>
          <div className="flex gap-md">
            {draftIsReadOnly || !user.permissions.canEditDrafts ?
              <h1 className="text-2xl">{draft.name}</h1>
            : <HeadInputFormName />}

            {isValid && isDirty && (
              <Button data-cy="draft-submit" type="submit" variant="solid" color="primary" disabled={!isValid}>
                Spara
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
export default HeadInput;
