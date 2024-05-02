import { SaveDraft } from '@interfaces/orgchange';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';

export const HeadInputFormName: React.FC = () => {
  const {
    formState: { errors },
    watch,
    register,
  } = useFormContext<SaveDraft>();
  const draft = useOrgChangeStore((s) => s.draft);

  return (
    <FormControl id="orgchange-draft-name" required invalid={!!errors?.name}>
      <FormLabel className="sr-only" showRequired>
        Utkastnamn
      </FormLabel>
      <h1 className="sr-only" aria-describedby="orgchange-draft-name-label">
        {watch().name}
      </h1>
      <Input
        data-cy="orgchange-draft-name"
        required
        aria-labelledby="orgchange-draft-name-label"
        placeholder="Ny organisationsförändring..."
        autoFocus={draft.draftId === null}
        {...register('name')}
      />
      {errors.name && (
        <FormErrorMessage id="orgchange-draft-name-error" className="sr-only">
          {errors.name?.message as string}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
