import { AlertBannerProps } from '@sk-web-gui/react';
import { AlertBannerMessage } from 'src/data-contracts/backend/data-contracts';

export const emptyAlertBannerMessage: AlertBannerMessage = {
  message: '',
  severity: 'info' as AlertBannerProps['severity'],
  fromDate: null,
  toDate: null,
};
