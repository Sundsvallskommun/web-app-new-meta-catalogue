import { getApiBase } from '@/config/api-config';

const apiConfig = {
  API_PREFIX: '/orgchange',
  API_URL: getApiBase('mdbuilder'),
};

export const { API_PREFIX, API_URL } = apiConfig;
