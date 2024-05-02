import { SearchResult } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';

export const objectType = (type: string) => {
  let bg, text, border;
  if (type == 'RESPONSIBILITY') {
    text = 'Ansvar';
    bg = 'bg-[#D7DBF2]';
    border = 'border-[#5B1F78]';
  } else if (type == 'ORGANIZATION') {
    text = 'Organisation';
    bg = 'bg-[#E4E4E5]';
    border = 'border-[#4b4b4b]';
  } else if (type == 'PERSON') {
    text = 'Person';
    bg = 'bg-[#FEDFE2]';
    border = 'border-[#A90000]';
  } else {
    text = 'Annat';
    bg = 'bg-transparent';
  }
  return { bg: bg, text: text, border: border };
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
