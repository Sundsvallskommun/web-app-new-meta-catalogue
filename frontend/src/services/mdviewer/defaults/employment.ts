import { MDVEmployee } from '@data-contracts/backend/data-contracts';
import { IFilterData } from '@sk-web-gui/react';

export const employeeHeaders = [
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
    isShown: true,
    filterId: 1,
  },
  {
    label: 'Anställning',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 2,
  },
  {
    label: 'Anv. namn',
    screenReaderOnly: false,
    isColumnSortable: true,
    isShown: true,
    filterId: 3,
  },
  {
    label: 'Persondetaljer',
    screenReaderOnly: true,
    isColumnSortable: false,
    isShown: true,
    filterId: 4,
    disabled: true,
  },
];

export const defaultEmployeeFilter: IFilterData[] = employeeHeaders.map((header) => ({
  id: header.filterId,
  name: header.label,
  value: header.isShown,
  disabled: header.disabled,
}));

export const emptyPersonEditor: MDVEmployee = {
  personId: '',
  personNumber: '',
  givenname: '',
  lastname: '',
  friendlyGivenname: '',
  orgId: null,
  workPhone: '',
  workMobile: '',
  loginname: '',
  title: '',
  isManual: false,

  logins: null,
  emails: null,
  employments: null,
};
