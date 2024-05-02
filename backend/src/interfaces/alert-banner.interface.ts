export type AlertBannerMessageSeverity = 'neutral' | 'info' | 'warning' | 'error' | string;

export interface AlertBannerMessage {
  id?: number;
  message: string;
  severity: AlertBannerMessageSeverity;
  fromDate?: Date | null;
  toDate?: Date | null;
}
