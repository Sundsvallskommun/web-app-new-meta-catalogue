import { AlertBannerSeverity } from '@interfaces/alert-banner';
import { AlertBannerMessage } from 'src/data-contracts/backend/data-contracts';

export const emptyAlertBannerMessage: AlertBannerMessage = {
  message: '',
  severity: 'info' as AlertBannerSeverity,
  fromDate: null,
  toDate: null,
};
