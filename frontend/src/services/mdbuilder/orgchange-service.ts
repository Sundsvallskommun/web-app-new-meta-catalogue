import {
  CheckedOutOrganizationLevel2,
  CloseResponsibilityDto,
  ConnectOperationDto,
  DisconnectOperationDto,
  Draft,
  DraftComment,
  DraftPhaseEnum,
  DraftRenameDto,
  DraftRunbook,
  InitialOrgStructureToExport,
  NewDraftDto,
  OrgChangeActivity,
  OrgChangeObject,
  OrgChangeOperation,
  OrgChangeOrganizationEmployee,
  OrgChangeOrganizationOperation,
  OrgChangeOrganizationTree,
  OrgChangeProject,
  OrgChangeResponsibility,
  OrgnodeAddDto,
  OrgnodeChangeRespCodeDto,
  OrgnodeCreateDto,
  OrgnodeMoveDto,
  OrgnodeRenameDto,
  PATeamAndManager,
  PATeamSearchResult,
  PostDraftCommentDto,
  RenameResponsibilityDto,
  ResponsibilityCreateDto,
  RunBookActionTriggerDtoCommandEnum,
  VerifyResult,
} from '@data-contracts/backend/data-contracts';
import { DraftTreeOrganization, SaveDraft, VerifyResultByOrgId } from '@interfaces/orgchange';
import { ServiceResponse } from '@interfaces/service';
import FileIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { IFilterData } from '@sk-web-gui/dropdown-filter';
import { __DEV__ } from '@sk-web-gui/utils';
import { findIdInTree } from '@utils/findIdInTree';
import { flatten } from '@utils/flatten';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { devtools, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { getActivitiesByCompany } from './api-calls/activity';
import {
  deleteDraft,
  deleteDraftComment,
  draftTrigger,
  editDraftComment,
  editDraftCutOffDate,
  editDraftName,
  getCheckedOutOrganizationsLevel2,
  getDraft,
  getDraftComments,
  getDrafts,
  getInitialOrgStructuresToExport,
  getOrgTree,
  getRunbook,
  newDraft,
  postDraftComment,
  runVerify,
} from './api-calls/draft';
import { getEmployeesByOrg } from './api-calls/employment';
import { getObjectsByCompany } from './api-calls/object';
import {
  connectOperation,
  disconnectOperation,
  getOperationsByCompany,
  getOperationsByOrg,
} from './api-calls/operation';
import {
  addExistingNodeToTree,
  createNode,
  orgNodeChangeRespCode,
  orgNodeMove,
  orgNodeRemovefromDraft,
  orgNodeRename,
  orgNodeTerminate,
  undoOrgNodeTerminate,
} from './api-calls/orgnode';
import { getPaTeamSearchResults, getPaTeamsByManager } from './api-calls/pateam';
import { getProjectsByCompany } from './api-calls/project';
import {
  closeResponsibility,
  getResponsibilitiesByOrg,
  newResponsibility,
  renameResponsibility,
} from './api-calls/responsibility';
import {
  defaultOrgChangeEmployeeFilter,
  emptyDraft,
  orgChangeDefaultOperationFilter,
  orgChangeDefaultResponsibilityFilter,
  sideMenuShowFiltersDefaults,
} from './defaults';
import { verifyErrorsByOrgId } from './data-handlers/draft';
import { IFilterDataMenu } from '@interfaces/organization';

export const draftListEntry = (draft: Draft) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { draftIsArchived } = useDraftPhaseState(draft);

  let phaseLabel = '',
    phaseColor = {
      text: 'text-body',
      icon: 'text-body',
      border: 'border-white',
      bg: 'bg-white',
    },
    PhaseIcon = null;

  if (draftIsArchived) {
    phaseLabel = 'Exporterad och arkiverad';
    phaseColor = { text: 'text-[#E4E4E5]', icon: 'text-[#E4E4E5]', border: 'border-[#4B4B4B]', bg: 'bg-[#4B4B4B]' };
    PhaseIcon = null;
  } else if (draft.phase === DraftPhaseEnum.APPROVED) {
    phaseLabel = 'Godkänd och väntar på export';
    phaseColor = { text: 'text-body', icon: 'text-success', border: 'border-success', bg: 'bg-[#E0F6DE]' };
    PhaseIcon = ThumbUpOutlinedIcon;
  } else if (draft.phase === DraftPhaseEnum.EXPORT) {
    phaseLabel = 'Godkänd och exporteras';
    phaseColor = { text: 'text-body', icon: 'text-success', border: 'border-success', bg: 'bg-[#E0F6DE]' };
    PhaseIcon = ThumbUpOutlinedIcon;
  } else if (draft.phase === DraftPhaseEnum.DRAFT) {
    phaseLabel = 'Utkast';
    phaseColor = { text: 'text-body', icon: 'text-[#5B1F78]', border: 'border-[#5B1F78]', bg: 'bg-[#D7DBF2]' };
    PhaseIcon = FileIcon;
  }

  const phaseRunbookStep = draft.runbook?.currentStep ? draft.runbook?.runner[draft.runbook.currentStep - 1] : null;

  return { phaseLabel, phaseColor, PhaseIcon, phaseRunbookStep };
};

export const progressbarPhase = (phase) => {
  let phase1bg, phase2bg, phase3bg, phase4bg;
  if (phase === 'DRAFT') {
    phase1bg = 'bg-[#5B1F78]';
    phase2bg = 'bg-[#E4E4E5]';
    phase3bg = 'bg-[#E4E4E5]';
    phase4bg = 'bg-[#E4E4E5]';
  } else if (phase === 'DRAFT_VERIFY') {
    phase1bg = 'bg-[#D7DBF2]';
    phase2bg = 'bg-[#E8B34D]';
    phase3bg = 'bg-[#E4E4E5]';
    phase4bg = 'bg-[#E4E4E5]';
  } else if (phase === 'TECHNICAL_REVIEW') {
    phase1bg = 'bg-[#D7DBF2]';
    phase2bg = 'bg-[#F9E9CA]';
    phase3bg = 'bg-[#CB6666]';
    phase4bg = 'bg-[#E4E4E5]';
  } else if (phase === 'APPROVED') {
    phase1bg = 'bg-[#D7DBF2]';
    phase2bg = 'bg-[#F9E9CA]';
    phase3bg = 'bg-[#FEDFE2]';
    phase4bg = 'bg-[#66AB89]';
  } else {
    phase1bg = 'bg-[#D7DBF2]';
    phase2bg = 'bg-[#F9E9CA]';
    phase3bg = 'bg-[#FEDFE2]';
    phase4bg = 'bg-[#66AB89]';
  }
  return { phase1bg, phase2bg, phase3bg, phase4bg };
};

interface State {
  drafts: Draft[];
  draftsIsLoading: boolean;
  isDraft: boolean;
  draft: Draft;
  draftIsLoading: boolean;
  lastChangeDate: Date;
  lastVerificationDate: Date;
  runbook: DraftRunbook | null;
  verifyResultsByOrgId: VerifyResultByOrgId;
  orgTree: OrgChangeOrganizationTree[];
  orgTreeOrganizations: DraftTreeOrganization[];
  orgTreeIsLoading: boolean;
  sideMenuShowFilters: IFilterDataMenu[];
  paSearchResults: PATeamSearchResult[];
  paSearchResultsIsLoading: boolean;
  paTeamsByManager: PATeamAndManager[];
  paTeamsByManagerIsLoading: boolean;
  employeesByOrg: OrgChangeOrganizationEmployee[];
  employeesByOrgIsLoading: boolean;
  orgChangeEmployeeFilter: IFilterData[];
  responsibilitiesByOrg: OrgChangeResponsibility[];
  responsibilitiesByOrgIsLoading: boolean;
  orgChangeResponsibilityFilter: IFilterData[];
  operationsByOrg: OrgChangeOrganizationOperation[];
  operationsByCompany: OrgChangeOperation[];
  operationsByOrgIsLoading: boolean;
  operationsByCompanyIsLoading: boolean;
  orgChangeOperationFilter: IFilterData[];
  objectsByCompany: OrgChangeObject[];
  objectsByCompanyIsLoading: boolean;
  activitiesByCompany: OrgChangeActivity[];
  activitiesByCompanyIsLoading: boolean;
  projectsByCompany: OrgChangeProject[];
  projectsByCompanyIsLoading: boolean;
  draftComments: DraftComment[];
  draftCommentsIsLoading: boolean;
  checkedOutOrganizationLevel2: CheckedOutOrganizationLevel2[];
  checkedOutOrganizationLevel2IsLoading: boolean;
  initialOrgStructuresToExport: InitialOrgStructureToExport[][];
  initialOrgStructuresToExportIsLoading: boolean;
  lockedView: boolean | null;
}

interface Actions {
  setDrafts: (drafts: Draft[]) => Promise<void>;
  getDrafts: (signal?: AbortSignal) => Promise<ServiceResponse<Draft[]>>;
  setDraft: (draft: Draft | ((prevState: Draft) => Draft)) => Promise<void>;
  getDraft: (draftId?: string, signal?: AbortSignal) => Promise<ServiceResponse<Draft>>;
  saveDraft: (draft: Draft | Partial<SaveDraft>, draftId?: Draft['draftId']) => Promise<ServiceResponse<SaveDraft>>;
  deleteDraft: (draftId?: string) => Promise<ServiceResponse<boolean>>;
  triggerDraft: (
    command: RunBookActionTriggerDtoCommandEnum,
    draftId?: Draft['draftId']
  ) => Promise<ServiceResponse<boolean>>;
  getRunbook: () => Promise<ServiceResponse<DraftRunbook>>;
  runVerify: () => Promise<ServiceResponse<VerifyResult>>;
  resetDraft: () => Promise<void>;
  blankDraft: () => Promise<void>;
  getOrgTree: (draftId?: string) => Promise<ServiceResponse<OrgChangeOrganizationTree[]>>;
  addExistingNodeToTree: (body?: OrgnodeAddDto) => Promise<ServiceResponse<boolean>>;
  createNode: (body: OrgnodeCreateDto) => Promise<ServiceResponse<number>>;
  moveNode: (body: OrgnodeMoveDto) => Promise<ServiceResponse<boolean>>;
  editNode: (rNode: OrgnodeRenameDto, rcNode?: OrgnodeChangeRespCodeDto) => Promise<ServiceResponse<boolean>>;
  removeNodeFromDraft: (orgId: number) => Promise<ServiceResponse<boolean>>;
  terminateNode: (orgId: number) => Promise<ServiceResponse<boolean>>;
  undoOrgNodeTerminate: (orgId: number) => Promise<ServiceResponse<boolean>>;
  setSideMenuShowFilters: (sideMenuShowFilters: IFilterDataMenu[]) => Promise<void>;
  getPaSearchResults: (query?: string) => Promise<ServiceResponse<PATeamSearchResult[]>>;
  getPaTeamsByManager: (managerId?: string | null) => Promise<ServiceResponse<PATeamAndManager[]>>;
  getEmployeesByOrg: (
    orgId: number | null,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrgChangeOrganizationEmployee[]>>;
  setOrgChangeEmployeeFilter: (orgChangeEmployeeFilter: IFilterData[]) => Promise<void>;
  getResponsibilitiesByOrg: (
    orgId: number | null,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrgChangeResponsibility[]>>;
  createConnectResponsibility: (body: ResponsibilityCreateDto) => Promise<ServiceResponse<boolean>>;
  renameResponsibility: (body: RenameResponsibilityDto) => Promise<ServiceResponse<boolean>>;
  closeResponsibility: (body: CloseResponsibilityDto) => Promise<ServiceResponse<boolean>>;
  setOrgChangeResponsibilityFilter: (orgChangeResponsibilityFilter: IFilterData[]) => Promise<void>;
  getOperationsByOrg: (
    orgId: number | null,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrgChangeOrganizationOperation[]>>;
  getOperationsByCompany: (
    companyId: number | null,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrgChangeOperation[]>>;
  setOrgChangeOperationFilter: (orgChangeOperationFilter: IFilterData[]) => Promise<void>;
  connectOperation: (body: ConnectOperationDto) => Promise<ServiceResponse<boolean>>;
  disconnectOperation: (body: DisconnectOperationDto) => Promise<ServiceResponse<boolean>>;
  getObjectsByCompany: (companyId: number | null, signal?: AbortSignal) => Promise<ServiceResponse<OrgChangeObject[]>>;
  getActivitiesByCompany: (
    companyId: number | null,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrgChangeActivity[]>>;
  getProjectsByCompany: (
    companyId: number | null,
    signal?: AbortSignal
  ) => Promise<ServiceResponse<OrgChangeProject[]>>;
  getDraftComments: (draftId: string) => Promise<ServiceResponse<DraftComment[]>>;
  postDraftComment: (body: PostDraftCommentDto) => Promise<ServiceResponse<string>>;
  editDraftComment: (draftCommentId: string, comment: string) => Promise<ServiceResponse<boolean>>;
  deleteDraftComment: (draftCommentId: string) => Promise<ServiceResponse<boolean>>;
  getCheckedOutOrganizationsLevel2: (draftId: string) => Promise<ServiceResponse<CheckedOutOrganizationLevel2[]>>;
  getInitialOrgStructuresToExport: (orgIds: number[]) => Promise<ServiceResponse<InitialOrgStructureToExport[][]>>;
  setLockedView: (lockedView: boolean | ((lockedView: boolean) => boolean)) => void;
  reset: () => Promise<void>;
}

const initialState: State = {
  drafts: [],
  draftsIsLoading: true,
  lastChangeDate: null,
  lastVerificationDate: null,
  runbook: null,
  verifyResultsByOrgId: null,
  isDraft: false,
  draft: emptyDraft,
  draftIsLoading: true,
  orgTree: [],
  orgTreeOrganizations: [],
  orgTreeIsLoading: true,
  sideMenuShowFilters: sideMenuShowFiltersDefaults,
  paSearchResults: [],
  paSearchResultsIsLoading: false,
  paTeamsByManager: [],
  paTeamsByManagerIsLoading: false,
  employeesByOrg: [],
  employeesByOrgIsLoading: false,
  orgChangeEmployeeFilter: defaultOrgChangeEmployeeFilter,
  responsibilitiesByOrg: [],
  responsibilitiesByOrgIsLoading: false,
  orgChangeResponsibilityFilter: orgChangeDefaultResponsibilityFilter,
  operationsByOrg: [],
  operationsByCompany: [],
  operationsByOrgIsLoading: false,
  operationsByCompanyIsLoading: false,
  orgChangeOperationFilter: orgChangeDefaultOperationFilter,
  objectsByCompany: [],
  objectsByCompanyIsLoading: false,
  activitiesByCompany: [],
  activitiesByCompanyIsLoading: false,
  projectsByCompany: [],
  projectsByCompanyIsLoading: false,
  draftComments: [],
  draftCommentsIsLoading: false,
  checkedOutOrganizationLevel2: [],
  checkedOutOrganizationLevel2IsLoading: false,
  initialOrgStructuresToExport: [],
  initialOrgStructuresToExportIsLoading: false,
  lockedView: null,
};

export const useOrgChangeStore = createWithEqualityFn<
  State & Actions,
  [
    ['zustand/devtools', never],
    [
      'zustand/persist',
      {
        sideMenuShowFilters: IFilterDataMenu[];
        orgChangeEmployeeFilter: IFilterData[];
        orgChangeResponsibilityFilter: IFilterData[];
        orgChangeOperationFilter: IFilterData[];
      },
    ],
  ]
>(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        setDrafts: async (drafts) => await set(() => ({ drafts })),
        getDrafts: async (signal) => {
          set(() => ({ draftsIsLoading: true }));
          const res = await getDrafts(signal);
          const data = (!res.error && res.data) || initialState.drafts;
          set(() => ({ drafts: data, draftsIsLoading: false }));
          return { data, error: res.error };
        },
        setDraft: async (draft) => await set((s) => ({ draft: typeof draft === 'function' ? draft(s.draft) : draft })),
        getDraft: async (draftId?, signal?) => {
          if (draftId === null) {
            await set(() => ({
              draft: { ...initialState.draft, companyId: get().draft.companyId },
              orgTree: initialState.orgTree,
            }));
            await get().reset();
            await useOrganizationStore.getState().reset();
            return;
          }
          await set(() => ({ draftIsLoading: true }));
          const res = await getDraft(draftId ? draftId : get().draft.draftId, signal);
          const data = (res.data && res.data) || initialState.draft;
          await get().getOrgTree(data.draftId);

          // Reset organization if not in orgTree
          const idMatch = findIdInTree(
            useOrganizationStore.getState()?.orgTree,
            useOrganizationStore.getState()?.organization?.id,
            'subItems'
          );
          if (idMatch === undefined) {
            useOrganizationStore.getState().setSelectedOrganizationId(null);
          }

          const verifyResultsByOrgId = data.verifyResult ? verifyErrorsByOrgId(data.verifyResult) : null;

          await set(() => ({
            isDraft: !res.error,
            draft: data,
            verifyResultsByOrgId: verifyResultsByOrgId,
            lockedView: data.phase !== DraftPhaseEnum.DRAFT,
            draftIsLoading: false,
            runbook: data.runbook,
          }));
          return { data, error: res.error };
        },
        saveDraft: async (draft?, draftId?) => {
          let res;

          let data = get().draft;
          if (draft.name && draft.cutOffDate && draft.description !== undefined && !draftId) {
            res = await newDraft({ ...(draft as NewDraftDto), companyId: get().draft.companyId });
            if (!res.error) {
              data = { ...data, draftId: res.data };
              set(() => ({ isDraft: true, draft: data }));
            }
            return { data, error: res?.error, message: res?.message };
          } else {
            const error = [];
            const id = draftId ?? get().draft.draftId;
            if (draft?.cutOffDate) {
              res = await editDraftCutOffDate({ cutOffDate: draft.cutOffDate }, id);
              error.push(!!res.error);
              if (!res.error) {
                data = { ...data, cutOffDate: draft.cutOffDate };
              }
            }
            if (draft?.name) {
              res = await editDraftName(draft as DraftRenameDto, id);
              error.push(!!res.error);
              if (!res.error) {
                data = { ...data, name: draft.name };
              }
            }

            const hasErrors = error.some((x) => x == true);
            if (error.some((x) => x == false)) {
              await set(() => ({ lastChangeDate: new Date() }));
              await get().getDraft();
            }
            return { data, error: hasErrors, message: res?.message };
          }
        },
        deleteDraft: async (draftId) => {
          const res = await deleteDraft(draftId);
          if (!res.error) {
            await get().getDrafts();
          }
          return res;
        },
        triggerDraft: async (command, _draftId) => {
          const draftId = _draftId ? _draftId : get().draft.draftId;
          const res = await draftTrigger(draftId, command);
          if (!res.error) {
            await get().getDraft(draftId);
            if (_draftId) {
              // assuming trigger from a drafts listing
              await get().getDrafts();
            }
          }
          return res;
        },
        getRunbook: async () => {
          const res = await getRunbook(get().draft.draftId);
          const data = (res.data && res.data) || initialState.runbook;
          if (!res.error) {
            await set(() => ({ runbook: data, draft: Object.assign(get().draft, { runbook: data }) }));
          }
          return res;
        },
        runVerify: async () => {
          const res = await runVerify(get().draft.draftId);
          if (!res.error) {
            await set(() => ({ lastVerificationDate: new Date() }));
            await get().getDraft();
          }
          return res;
        },
        resetDraft: async () => {
          set(() => ({
            draft: initialState.draft,
            isDraft: false,
            orgTree: initialState.orgTree,
            draftIsLoading: true,
            orgTreeIsLoading: true,
          }));
          await useOrganizationStore.getState().setOrgTree([]);
        },
        blankDraft: async () => {
          set(() => ({
            draft: initialState.draft,
            isDraft: false,
            orgTree: initialState.orgTree,
            draftIsLoading: false,
            orgTreeIsLoading: false,
          }));
          await useOrganizationStore.getState().setOrgTree([]);
        },
        getOrgTree: async (draftId) => {
          const _draftId = draftId ? draftId : get().draft.draftId;
          if (_draftId === null) {
            await set(() => ({ orgTree: initialState.orgTree }));
            await useOrganizationStore.getState().setOrgTree([]);
            return;
          }
          await set(() => ({ orgTreeIsLoading: true }));
          const res = await getOrgTree(_draftId);
          const data = (!res.error && res.data) || initialState.orgTree;
          let orgTreeOrganizations = [];
          if (!res.error) {
            orgTreeOrganizations = flatten(
              res.data,
              (x) => x.subItems,
              res.data,
              (x, parent) => Object.assign(x, { orgFromName: parent.label })
            );
          }
          if (!res.error) {
            await useOrganizationStore.getState().setOrgTree(data);
            await useOrganizationStore.getState().getOrganization();
          }
          await set(() => ({ orgTree: data, orgTreeIsLoading: false, orgTreeOrganizations }));
          return { data, error: res.error };
        },
        addExistingNodeToTree: async (body: OrgnodeAddDto) => {
          const res = await addExistingNodeToTree(body);
          if (!res.error) {
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        createNode: async (body: OrgnodeCreateDto) => {
          const res = await createNode(body);
          if (!res.error) {
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        moveNode: async (body: OrgnodeMoveDto) => {
          const res = await orgNodeMove(body);
          if (!res.error) {
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        editNode: async (rNode?: OrgnodeRenameDto, rcNode?: OrgnodeChangeRespCodeDto) => {
          let res;
          const error = [];
          let data = false;
          if (rNode) {
            res = await orgNodeRename(rNode);
            error.push(!!res.error);
            if (!res.error) {
              data = res.data;
            }
          }
          if (rcNode) {
            res = await orgNodeChangeRespCode(rcNode);
            error.push(!!res.error);
            if (!res.error) {
              data = res.data;
            }
          }
          const hasErrors = error.some((x) => x == true);
          if (error.some((x) => x == false)) {
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getDraft();
          }
          return { data, error: hasErrors, message: res?.message };
        },
        removeNodeFromDraft: async (orgId: number) => {
          const res = await orgNodeRemovefromDraft(orgId);
          if (!res.error) {
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        terminateNode: async (orgId: number) => {
          const res = await orgNodeTerminate(orgId);
          if (!res.error) {
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        undoOrgNodeTerminate: async (orgId: number) => {
          const res = await undoOrgNodeTerminate(orgId);
          if (!res.error) {
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        setSideMenuShowFilters: async (sideMenuShowFilters) => await set(() => ({ sideMenuShowFilters })),
        getPaSearchResults: async (query) => {
          if (query.length > 1) {
            await set(() => ({ paSearchResultsIsLoading: true }));
            const res = await getPaTeamSearchResults(query);
            const data = (!res.error && res.data) || [];
            await set(() => ({ paSearchResults: data, paSearchResultsIsLoading: false }));
            return { data, error: res.error };
          }
        },
        getPaTeamsByManager: async (managerId) => {
          if (managerId === null) {
            await set(() => ({ paTeamsByManager: initialState.paTeamsByManager }));
            return;
          }
          await set(() => ({ paTeamsByManagerIsLoading: true }));
          const res = await getPaTeamsByManager(managerId);
          const data = (!res.error && res.data) || [];
          await set(() => ({ paTeamsByManager: data, paTeamsByManagerIsLoading: false }));
          return { data, error: res.error };
        },
        getEmployeesByOrg: async (orgId, signal) => {
          if (orgId === null) {
            await set(() => ({
              employeesByOrg: initialState.employeesByOrg,
              employeesByOrgIsLoading: initialState.employeesByOrgIsLoading,
            }));
            return;
          }
          await set(() => ({ employeesByOrgIsLoading: true }));
          const res = await getEmployeesByOrg(orgId, signal);
          const organization = await useOrganizationStore.getState().organization;
          const data =
            (!res.error && res.data.filter((x) => (x.newOrgId ? x.newOrgId === organization.id : true))) ||
            initialState.employeesByOrg;
          await set(() => ({ employeesByOrg: data, employeesByOrgIsLoading: false }));
          return { data, error: res.error };
        },
        setOrgChangeEmployeeFilter: async (orgChangeEmployeeFilter) => await set(() => ({ orgChangeEmployeeFilter })),
        getResponsibilitiesByOrg: async (orgId, signal) => {
          if (orgId === null) {
            await set(() => ({
              responsibilitiesByOrg: initialState.responsibilitiesByOrg,
              responsibilitiesByOrgIsLoading: initialState.responsibilitiesByOrgIsLoading,
            }));
            return;
          }
          await set(() => ({ responsibilitiesByOrgIsLoading: true }));
          const res = await getResponsibilitiesByOrg(get().draft.draftId, orgId, signal);
          const data = (!res.error && res.data) || initialState.responsibilitiesByOrg;
          await set(() => ({ responsibilitiesByOrg: data, responsibilitiesByOrgIsLoading: false }));
          return { data, error: res.error };
        },
        setOrgChangeResponsibilityFilter: async (orgChangeResponsibilityFilter) =>
          await set(() => ({ orgChangeResponsibilityFilter })),
        createConnectResponsibility: async (body: ResponsibilityCreateDto) => {
          const res = await newResponsibility(body);
          if (!res.error) {
            const organization = await useOrganizationStore.getState().organization;
            await get().getResponsibilitiesByOrg(organization.id);
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        renameResponsibility: async (body: RenameResponsibilityDto) => {
          const res = await renameResponsibility(body);
          if (!res.error) {
            const organization = await useOrganizationStore.getState().organization;
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getResponsibilitiesByOrg(organization.id);
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        closeResponsibility: async (body: CloseResponsibilityDto) => {
          const res = await closeResponsibility(body);
          if (!res.error) {
            const organization = await useOrganizationStore.getState().organization;
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getResponsibilitiesByOrg(organization.id);
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        getOperationsByOrg: async (orgId, signal) => {
          if (orgId === null) {
            await set(() => ({
              operationsByOrg: initialState.operationsByOrg,
              operationsByOrgIsLoading: initialState.operationsByOrgIsLoading,
            }));
            return;
          }
          await set(() => ({ operationsByOrgIsLoading: true }));
          const res = await getOperationsByOrg(orgId, signal);
          const data = (!res.error && res.data) || initialState.operationsByOrg;
          await set(() => ({ operationsByOrg: data, operationsByOrgIsLoading: false }));
          return { data, error: res.error };
        },
        setOrgChangeOperationFilter: async (orgChangeOperationFilter) =>
          await set(() => ({ orgChangeOperationFilter })),
        getOperationsByCompany: async (companyId, signal) => {
          if (companyId === null) {
            await set(() => ({
              operationsByCompany: initialState.operationsByCompany,
              operationsByCompanyIsLoading: initialState.operationsByCompanyIsLoading,
            }));
            return;
          }
          await set(() => ({ operationsByCompanyIsLoading: true }));
          const res = await getOperationsByCompany(companyId, signal);
          const data = (!res.error && res.data) || initialState.operationsByCompany;
          await set(() => ({ operationsByCompany: data, operationsByCompanyIsLoading: false }));
          return { data, error: res.error };
        },
        connectOperation: async (body: ConnectOperationDto) => {
          const res = await connectOperation(body);
          if (!res.error) {
            const organization = await useOrganizationStore.getState().organization;
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getOperationsByOrg(organization.id);
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        disconnectOperation: async (body: DisconnectOperationDto) => {
          const res = await disconnectOperation(body);
          if (!res.error) {
            const organization = await useOrganizationStore.getState().organization;
            await set(() => ({ lastChangeDate: new Date() }));
            await get().getOperationsByOrg(organization.id);
            await get().getDraft();
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        getObjectsByCompany: async (companyId, signal) => {
          if (companyId === null) {
            await set(() => ({
              objectsByCompany: initialState.objectsByCompany,
              objectsByCompanyIsLoading: initialState.objectsByCompanyIsLoading,
            }));
            return;
          }
          await set(() => ({ objectsByCompanyIsLoading: true }));
          const res = await getObjectsByCompany(companyId, signal);
          const data = (!res.error && res.data) || initialState.objectsByCompany;
          await set(() => ({ objectsByCompany: data, objectsByCompanyIsLoading: false }));
          return { data, error: res.error };
        },
        getActivitiesByCompany: async (companyId, signal) => {
          if (companyId === null) {
            await set(() => ({
              activitiesByCompany: initialState.activitiesByCompany,
              activitiesByCompanyIsLoading: initialState.activitiesByCompanyIsLoading,
            }));
            return;
          }
          await set(() => ({ activitiesByCompanyIsLoading: true }));
          const res = await getActivitiesByCompany(companyId, signal);
          const data = (!res.error && res.data) || initialState.activitiesByCompany;
          await set(() => ({ activitiesByCompany: data, activitiesByCompanyIsLoading: false }));
          return { data, error: res.error };
        },
        getProjectsByCompany: async (companyId, signal) => {
          if (companyId === null) {
            await set(() => ({
              projectsByCompany: initialState.projectsByCompany,
              projectsByCompanyIsLoading: initialState.projectsByCompanyIsLoading,
            }));
            return;
          }
          await set(() => ({ projectsByCompanyIsLoading: true }));
          const res = await getProjectsByCompany(companyId, signal);
          const data = (!res.error && res.data) || initialState.projectsByCompany;
          await set(() => ({ projectsByCompany: data, projectsByCompanyIsLoading: false }));
          return { data, error: res.error };
        },
        getDraftComments: async (draftId) => {
          if (draftId === null) {
            await set(() => ({
              draftComments: initialState.draftComments,
              draftCommentsIsLoading: initialState.draftCommentsIsLoading,
            }));
            return;
          }
          await set(() => ({ draftCommentsIsLoading: true }));
          const res = await getDraftComments(draftId);
          const data = (!res.error && res.data) || initialState.draftComments;
          await set(() => ({ draftComments: data, draftCommentsIsLoading: false }));
          return { data, error: res.error };
        },
        postDraftComment: async (body: PostDraftCommentDto) => {
          const res = await postDraftComment(body);
          if (!res.error) {
            await get().getDraftComments(body.draftId);
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        editDraftComment: async (draftCommentId, comment) => {
          const res = await editDraftComment(draftCommentId, comment);
          if (!res.error) {
            const draftId = await get().draft.draftId;
            await get().getDraftComments(draftId);
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        deleteDraftComment: async (draftCommentId) => {
          const res = await deleteDraftComment(draftCommentId);
          if (!res.error) {
            const draftId = await get().draft.draftId;
            await get().getDraftComments(draftId);
          }
          return { data: res.data, error: res.error, message: res.message };
        },
        getCheckedOutOrganizationsLevel2: async (draftId) => {
          await set(() => ({ checkedOutOrganizationLevel2IsLoading: true }));
          const res = await getCheckedOutOrganizationsLevel2(draftId);
          const data = (!res.error && res.data) || initialState.checkedOutOrganizationLevel2;
          await set(() => ({ checkedOutOrganizationLevel2: data, checkedOutOrganizationLevel2IsLoading: false }));
          return { data, error: res.error };
        },
        getInitialOrgStructuresToExport: async (orgIds) => {
          await set(() => ({ initialOrgStructuresToExportIsLoading: true }));

          const res = await getInitialOrgStructuresToExport(orgIds);
          const data = (!res.error && res.data) || initialState.initialOrgStructuresToExport;
          await set(() => ({ initialOrgStructuresToExport: data, initialOrgStructuresToExportIsLoading: false }));
          return { data, error: res.error };
        },
        setLockedView: async (lockedView) => {
          await set((s) => ({ lockedView: typeof lockedView === 'function' ? lockedView(s.lockedView) : lockedView }));
        },
        reset: async () => {
          await set(initialState);
        },
      }),
      {
        name: 'org-change-storage',
        version: 7,
        partialize: ({
          sideMenuShowFilters,
          orgChangeEmployeeFilter,
          orgChangeResponsibilityFilter,
          orgChangeOperationFilter,
        }) => ({
          sideMenuShowFilters,
          orgChangeEmployeeFilter,
          orgChangeResponsibilityFilter,
          orgChangeOperationFilter,
        }),
      }
    ),
    { name: 'org-change-storage', enabled: __DEV__ }
  )
);
