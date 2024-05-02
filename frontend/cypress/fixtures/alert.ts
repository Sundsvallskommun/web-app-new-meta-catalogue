import { AlertBannerMessage } from '../../src/data-contracts/backend/data-contracts';

const toDate = new Date();
toDate.setDate(toDate.getDate() + 1);

export const alert: AlertBannerMessage = {
  id: 0,
  message: 'System-message',
  severity: 'info',
  fromDate: new Date().toLocaleDateString('sv-SE'),
  toDate: toDate.toLocaleDateString('sv-SE'),
};
