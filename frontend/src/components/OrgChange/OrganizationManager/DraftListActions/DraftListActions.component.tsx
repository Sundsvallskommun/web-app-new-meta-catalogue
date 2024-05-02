import { Draft, DraftPhaseEnum, RunbookStepsStateEnum } from '@data-contracts/backend/data-contracts';
import { DraftListFilters, DraftPhaseAction } from '@interfaces/orgchange';
import AddIcon from '@mui/icons-material/Add';
import { useUserStore } from '@services/user-service/user-service';
import { Select } from '@sk-web-gui/forms';
import { Button, SearchBar } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

const emptyDraftsFilters: DraftListFilters = {
  query: '',
  phase: null,
  timeRange: null,
};

interface PhaseSelectOption {
  id: number;
  value: DraftPhaseAction | null;
  name: string;
}

const phaseSelectOptions: PhaseSelectOption[] = [
  {
    id: 0,
    value: DraftPhaseAction.UNSET,
    name: 'Alla förändringar',
  },
  {
    id: 1,
    value: DraftPhaseAction.DRAFT,
    name: 'Utkast',
  },
  {
    id: 2,
    value: DraftPhaseAction.APPROVED,
    name: 'Godkänd och väntar på export',
  },
  {
    id: 3,
    value: DraftPhaseAction.EXPORT_ONGOING,
    name: 'Godkänd och exporteras',
  },
  {
    id: 4,
    value: DraftPhaseAction.EXPORT_NEED_ACTION,
    name: 'Export behöver uppmärksamhet',
  },
  {
    id: 5,
    value: DraftPhaseAction.ARCHIVED,
    name: 'Exporterad och arkiverad',
  },
];

export const getDraftPhaseAction = (draft: Draft) => {
  if (draft.phase === DraftPhaseEnum.DRAFT) return DraftPhaseAction.DRAFT;
  if (draft.phase === DraftPhaseEnum.APPROVED) return DraftPhaseAction.APPROVED;
  if (draft.phase === DraftPhaseEnum.EXPORT) {
    if (
      draft.runbook?.currentStep &&
      draft.runbook?.runner[draft.runbook.currentStep - 1].state === RunbookStepsStateEnum.Waiting
    )
      return DraftPhaseAction.EXPORT_NEED_ACTION;
    return DraftPhaseAction.EXPORT_ONGOING;
  }

  if (draft.isArchived) return DraftPhaseAction.ARCHIVED;
  return DraftPhaseAction.UNSET;
};

export const dofilterMatchPhase = (filter: DraftPhaseAction, draft: Draft) => {
  // pass through all if unset
  if (filter === DraftPhaseAction.UNSET) return true;
  // EXPORT_ONGOING should include EXPORT_NEED_ACTION
  if (
    filter === DraftPhaseAction.EXPORT_ONGOING &&
    [DraftPhaseAction.EXPORT_ONGOING, DraftPhaseAction.EXPORT_NEED_ACTION].includes(getDraftPhaseAction(draft))
  )
    return true;
  // matching
  if (filter === getDraftPhaseAction(draft)) return true;
  return false;
};

interface TimeRangeSelectOption {
  id: number;
  value: string | null;
  name: string;
}

const timeRangeSelectOptions: TimeRangeSelectOption[] = [
  {
    id: 0,
    value: null,
    name: 'Skapad datum (alla)',
  },
  {
    id: 1,
    value: dayjs().subtract(3, 'month').hour(0).minute(0).second(1).format('YYYY-MM-DD'),
    name: 'Senaste kvartalet',
  },
  {
    id: 2,
    value: dayjs().subtract(1, 'year').hour(0).minute(0).second(1).format('YYYY-MM-DD'),
    name: 'Senaste året',
  },
  {
    id: 3,
    value: dayjs().subtract(5, 'year').hour(0).minute(0).second(1).format('YYYY-MM-DD'),
    name: 'Senaste fem åren',
  },
];

const defaultChangeOptions = {
  shouldValidate: true,
  shouldDirty: true,
  shouldTouch: true,
};

interface DraftListActions {
  openEditModalHandler: () => void;
  draftsFilters: DraftListFilters;
  setDraftsFilters: (
    value: null | DraftListFilters | ((prevState: null | DraftListFilters) => null | DraftListFilters)
  ) => void;
}

export default function DraftListActions(props: DraftListActions) {
  const { openEditModalHandler, draftsFilters, setDraftsFilters } = props;
  const user = useUserStore((s) => s.user);

  // useForm
  const { handleSubmit, watch, setValue, getValues, register } = useForm({
    defaultValues: useMemo(() => {
      return { ...(draftsFilters ? draftsFilters : emptyDraftsFilters) };
    }, [draftsFilters]),
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
  });

  const submit = (data) => {
    const filterData = {
      query: data.query,
      phase: data.phase === '0' ? null : data.phase,
      timeRange: data.timeRange === '0' ? null : data.timeRange,
    };
    setDraftsFilters(filterData);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('query', e.target.value, defaultChangeOptions);
    submit(getValues());
  };
  const handleQueryClose = () => {
    setValue('query', '', defaultChangeOptions);
    submit(getValues());
  };

  const handlePhaseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setValue('phase', phaseSelectOptions.find((x) => x.id == id).value, defaultChangeOptions);
    submit(getValues());
  };

  const handleTimeRangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setValue('timeRange', timeRangeSelectOptions.find((x) => x.id == id).value, defaultChangeOptions);
    submit(getValues());
  };

  const currentPhaseSelectOption = phaseSelectOptions.find((x) => x.value == watch().phase);
  const currentTimeRangeSelectOption = timeRangeSelectOptions.find((x) => x.value == watch().timeRange);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="w-full mb-lg lg:mb-[3rem] flex flex-col gap-sm lg:flex-row lg:justify-between lg:gap-x-11 items-center"
    >
      <span className="w-full">
        <SearchBar
          {...register('query')}
          rounded
          aria-label="Sök organisationsförändringar"
          placeholder="Sök organisationsförändringar"
          aria-live="polite"
          aria-controls="draftlist-count"
          aria-describedby="draftlist-count"
          value={watch().query}
          onChange={handleQueryChange}
          onClose={handleQueryClose}
        />
      </span>
      <span className="w-full">
        <Select
          {...register('phase')}
          className="w-full"
          value={currentPhaseSelectOption ? currentPhaseSelectOption.id.toString() : ''}
          onChange={handlePhaseSelect}
          placeholder={`${phaseSelectOptions[0].name}`}
          size="md"
        >
          {phaseSelectOptions.map((option, i) => (
            <Select.Option key={`draftlist-filters-phase-option-${i}`} value={option.id}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </span>
      <span className="w-full">
        <Select
          {...register('timeRange')}
          className="w-full"
          value={currentTimeRangeSelectOption ? currentTimeRangeSelectOption.id.toString() : ''}
          onChange={handleTimeRangeSelect}
          placeholder={`${timeRangeSelectOptions[0].name}`}
          size="md"
        >
          {timeRangeSelectOptions.map((option, i) => (
            <Select.Option key={`draftlist-filters-phase-option-${i}`} value={option.id}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </span>
      {user.role === 'meta_admin' && (
        <span className="w-full">
          <Button
            type="button"
            data-cy="orgchange-new-draft"
            className="w-full h-fit"
            onClick={openEditModalHandler}
            size="md"
            variant="solid"
            color="primary"
            leftIcon={<AddIcon fontSize="medium" className="mr-sm" />}
          >
            Ny organisationsförändring
          </Button>
        </span>
      )}
    </form>
  );
}
