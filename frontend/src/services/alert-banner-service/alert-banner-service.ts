import { ServiceResponse } from '@interfaces/service';
import { apiService, ApiResponse } from '../api-service';
import { AlertBannerMessage } from 'src/data-contracts/backend/data-contracts';

export const getAlertBannerMessage: () => Promise<{ message?: AlertBannerMessage; error?: string }> = () => {
  return apiService
    .get<ApiResponse<AlertBannerMessage>>(`/alert`)
    .then((res) => ({
      message: res.data.data,
    }))
    .catch((e) => ({
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const handleSendAlertBannerMessage: (alertMessage: AlertBannerMessage) => AlertBannerMessage = (
  alertMessage
) => ({
  message: alertMessage.message,
  severity: alertMessage.severity,
  fromDate: alertMessage.fromDate,
  toDate: alertMessage.toDate,
});

export const newAlertBannerMessage: (alertMessage: AlertBannerMessage) => Promise<ServiceResponse<boolean>> = (
  alertMessage
) => {
  return apiService
    .post(`alert`, handleSendAlertBannerMessage(alertMessage))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const editAlertBannerMessage: (alertMessage: AlertBannerMessage) => Promise<ServiceResponse<boolean>> = (
  alertMessage
) => {
  return apiService
    .patch(`alert/${alertMessage.id}`, handleSendAlertBannerMessage(alertMessage))
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const deleteAlertBannerMessage: (id: number) => Promise<ServiceResponse<boolean>> = (id) => {
  return apiService
    .delete(`alert/${id}`)
    .then(() => ({ data: true }))
    .catch((e) => ({
      message: e.response.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};
