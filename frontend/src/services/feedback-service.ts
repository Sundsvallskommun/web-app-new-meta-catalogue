import { FeedbackDto } from '@data-contracts/backend/data-contracts';
import { apiService } from './api-service';

export const feedbackSelectTypes: { label: string; type: string }[] = [
  {
    label: 'Persondata (HR)',
    type: 'PERSONDETAILS',
  },
  {
    label: 'Anställd kopplad till fel organisation (HR)',
    type: 'PERSON',
  },
  {
    label: 'Felaktigt ansvar (Ekonomi)',
    type: 'RESPONSIBILITY',
  },
  {
    label: 'Felaktig verksamhet',
    type: 'OPERATION',
  },
  {
    label: 'Fel i systemet (HR)',
    type: 'SYSTEM',
  },
  {
    label: 'Support (IT)',
    type: 'SUPPORT',
  },
  {
    label: 'Övrigt (IT)',
    type: 'OTHER',
  },
];

export const sendFeedback: (feedback: FeedbackDto) => Promise<boolean> = (feedback) => {
  return apiService
    .post('feedback', feedback)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
};
