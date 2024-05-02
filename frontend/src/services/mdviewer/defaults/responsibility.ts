import {
  OrgChangeResponsibility,
  OrgChangeResponsibilityResponsibilityTypeIdEnum,
} from '@data-contracts/backend/data-contracts';
import { IFilterData } from '@sk-web-gui/react';

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

export const orgResponsibilityHeaders = [
  {
    label: 'Titel',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 0,
    disabled: true,
  },
  {
    label: 'Ansvarstyp',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 1,
  },
  {
    label: 'Ansvarskod',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 2,
  },
  {
    label: 'Giltig från',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 3,
  },
];

export const orgDefaultResponsibilityFilter: IFilterData[] = orgResponsibilityHeaders.map((header) => ({
  id: header.filterId,
  name: header.label,
  value: header.isShown,
  disabled: header.disabled,
  isShown: header.isShown,
}));

export const responsibilityHeaders = [
  {
    label: 'Titel',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 0,
    disabled: true,
  },
  {
    label: 'Organisation',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 1,
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
];

export const defaultResponsibilityFilter: IFilterData[] = responsibilityHeaders.map((header) => ({
  id: header.filterId,
  name: header.label,
  value: header.isShown,
  disabled: header.disabled,
  isShown: header.isShown,
}));

export const responsibilityTypes = [
  {
    label: 'Ansvar',
    id: OrgChangeResponsibilityResponsibilityTypeIdEnum.ANSVAR,
  },
  {
    label: 'Löneansvar',
    id: OrgChangeResponsibilityResponsibilityTypeIdEnum.LONEANSVAR,
  },
  {
    label: 'Pseudoansvar',
    id: OrgChangeResponsibilityResponsibilityTypeIdEnum.PSEUDOANSVAR,
  },
];
