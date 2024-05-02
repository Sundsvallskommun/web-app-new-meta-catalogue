import { OrgOperation } from '@data-contracts/backend/data-contracts';
import { IFilterData } from '@sk-web-gui/react';

export const emptyOperation: OrgOperation = {
  orgOperationId: '',
  orgId: 0,
  operationCode: '',
  operationDescription: '',
};

export const orgOperationHeaders = [
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
];

export const orgDefaultOperationFilter: IFilterData[] = orgOperationHeaders.map((header) => ({
  id: header.filterId,
  name: header.label,
  value: header.isShown,
  disabled: header.disabled,
}));
