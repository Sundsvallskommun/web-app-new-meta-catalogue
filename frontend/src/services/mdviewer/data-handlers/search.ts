import { SearchResult } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const objectType = (type: string) => {
  let text, color;
  if (type == 'RESPONSIBILITY') {
    text = 'Ansvar';
    color = 'bjornstigen';
  } else if (type == 'ORGANIZATION') {
    text = 'Organisation';
    color = 'tertiary';
  } else if (type == 'PERSON') {
    text = 'Person';
    color = 'error';
  } else {
    text = 'Annat';
    color = 'tertiary';
  }
  return { text: text, color: color };
};

export const handleGetSearchResults: (res: ApiResponse<SearchResult[]>) => SearchResult[] = (res) => {
  return res.data.map((data) => ({
    objectType: data.objectType,
    subObjectType: data.subObjectType,
    id: data.id,
    subId: data.subId,
    header: data.header,
    text: data.text,
  }));
};
