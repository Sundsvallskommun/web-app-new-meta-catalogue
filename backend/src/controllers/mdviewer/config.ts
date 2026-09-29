import { getApiBase } from '@/config/api-config';

const apiConfig = {
  API_PREFIX: '/mdviewer',
  API_URL: getApiBase('mdviewer'),
};

export const { API_PREFIX, API_URL } = apiConfig;
