import {
  Draft,
  DraftPhaseEnum,
  OrgChangePersonEmployeeDetail,
  OrgChangeResponsibility,
  OrgChangeResponsibilityResponsibilityTypeIdEnum,
  VerifyResult,
} from '@data-contracts/backend/data-contracts';
import { EditOrganizationDto, IFilterDataMenu } from '@interfaces/orgchange';
import { IFilterData } from '@sk-web-gui/react';

export const emptyVerifyResult: VerifyResult = {
  numberOfValidationErrors: 0,
  missingParent: [],
  noChildren: [],
};

export const emptyDraft: Draft = {
  companyName: null,
  draftId: null,
  name: null,
  description: null,
  companyId: null,
  cutOffDate: null,
  phase: DraftPhaseEnum.DRAFT,
  verifyResult: emptyVerifyResult,
  phaseChangeDT: null,
  nodes: null,
  changes: null,
  createdDT: null,
  isArchived: false,
};

export const sideMenuShowFiltersDefaults: IFilterDataMenu[] = [
  {
    id: 0,
    name: 'Nivåer',
    propertyName: 'level',
    value: false,
    disabled: false,
    isShown: true,
  },
  {
    id: 1,
    name: 'Ansvarskod',
    propertyName: 'responsibilityCode',
    value: false,
    disabled: false,
    isShown: true,
  },
  {
    id: 2,
    name: 'Förkortningar',
    propertyName: 'abbreviation',
    value: false,
    disabled: false,
    isShown: true,
  },
  {
    id: 3,
    name: 'Namn',
    propertyName: 'orgName',
    value: true,
    disabled: true,
    isShown: true,
  },
];

export const draftHeaders = [
  {
    label: 'Titel',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 0,
  },
  {
    label: 'Brytdatum',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 1,
    disabled: true,
  },
  {
    label: 'Berör organisation',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 2,
  },
  {
    label: 'Antal ändringar',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 3,
  },
  {
    label: 'Fas',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 4,
  },
  {
    label: 'Export-status',
    screenReaderOnly: false,
    isColumnSortable: false,
    isShown: true,
    filterId: 5,
  },
];

export const employeeOrgChangeHeaders = [
  {
    label: 'Namn',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 0,
    disabled: true,
  },
  {
    label: 'Pers.nr',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: false,
    filterId: 1,
  },
  {
    label: 'Anställning',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: false,
    filterId: 2,
  },
  {
    label: 'Anv. namn',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: false,
    filterId: 3,
  },
  {
    label: 'PA-Team',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 4,
  },
  {
    label: 'Verksamhet',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 5,
  },
  {
    label: 'Objekt',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 8,
  },
  {
    label: 'Aktivitet',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 9,
  },
  {
    label: 'Projekt',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 10,
  },
  {
    label: 'Persondetaljer',
    screenReaderOnly: true,
    isColumnSortable: false,
    isShown: true,
    filterId: 6,
    disabled: true,
  },
  {
    label: 'Välj person',
    screenReaderOnly: true,
    isColumnSortable: false,
    isShown: true,
    filterId: 7,
    disabled: true,
  },
];

export const defaultOrgChangeEmployeeFilter: IFilterData[] = employeeOrgChangeHeaders.map((header) => ({
  id: header.filterId,
  name: header.label,
  value: header.isShown,
  disabled: header.disabled,
}));

export const orgChangeResponsibilityHeaders = [
  {
    label: 'Titel',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 1,
    disabled: true,
  },
  {
    label: 'Ansvarstyp',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 2,
  },
  {
    label: 'Ansvarskod',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 3,
  },
  {
    label: 'Giltig från',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 4,
  },
  {
    label: 'Giltig till',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 5,
  },
  {
    label: 'Status',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 6,
  },
  {
    label: 'Redigera ansvar',
    screenReaderOnly: true,
    isColumnSortable: false,
    isShown: true,
    filterId: 7,
    disabled: true,
  },
];

export const orgChangeDefaultResponsibilityFilter: IFilterData[] = orgChangeResponsibilityHeaders.map((header) => ({
  id: header.filterId,
  name: header.label,
  value: header.isShown,
  disabled: header.disabled,
  isShown: header.isShown,
}));

export const orgChangeOperationHeaders = [
  {
    label: 'Titel',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 1,
    disabled: true,
  },
  {
    label: 'Verksamhetskod',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 2,
  },
  {
    label: 'Ta bort verksamhet',
    screenReaderOnly: true,
    isColumnSortable: false,
    isShown: true,
    filterId: 3,
    disabled: true,
  },
];

export const orgChangeDefaultOperationFilter: IFilterData[] = orgChangeOperationHeaders.map((header) => ({
  id: header.filterId,
  name: header.label,
  value: header.isShown,
  disabled: header.disabled,
}));

export const emptyPersonEditor: OrgChangePersonEmployeeDetail = {
  personId: '',
  personNumber: '',
  givenname: '',
  middlename: '',
  lastname: '',
  friendlyGivenname: '',
  customFriendlyGivenname: '',
  workPhone: '',
  workMobile: '',

  logins: null,
  emails: null,
  employments: null,
};

export const emptyOrganizationForm: EditOrganizationDto = {
  orgId: null,
  treeLevel: null,
  abbreviation: '',
  orgName: 'Organisationsnamn',
  orgNameShort: '',
  parentId: null,
  isLeafLevel: false,
  responsibilityCode: null,
};

export const emptyResponsibility: OrgChangeResponsibility = {
  responsibilityId: null,
  responsibilityCode: '',
  orgId: null,
  description: '',
  responsibilityFromDate: '',
  responsibilityToDate: '',
  responsibilityPassive: true,
  responsibilityTypeId: OrgChangeResponsibilityResponsibilityTypeIdEnum.LONEANSVAR,
};
