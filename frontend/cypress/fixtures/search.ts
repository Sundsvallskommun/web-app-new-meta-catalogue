import { SearchResult } from '../../src/data-contracts/backend/data-contracts';
import { ApiResponse } from '../../src/services/api-service';

export const search: ApiResponse<SearchResult[]> = {
  data: [
    {
      objectType: 'RESPONSIBILITY',
      subObjectType: null,
      id: 'id-hash',
      subId: 0,
      header: 'Test Persson - RESPONSIBILITY',
      text: null,
    },
    {
      objectType: 'PERSON',
      subObjectType: 'ORGANIZATION',
      id: '1234aa5b-a123-123a-a12b-1a234bd5eee',
      subId: 180,
      header: 'AnnJan Ahsonzi - PERSON',
      text: 'BOU NG Bosvedjeskolan',
    },
    {
      objectType: 'ORGANIZATION',
      subObjectType: null,
      id: '70e4e274-62f1-4116-986b-a632a679f2bb',
      subId: 180,
      header: 'Bosvedjeskolan - ORGANIZATION',
      text: 'Nivå 6 under Kontoret, Sundsvalls kommun',
    },
  ],
  message: 'success',
};
