import { SearchResult } from '@data-contracts/backend/data-contracts';
import { __DEV__ } from '@sk-web-gui/react';
import debounce from 'debounce-promise';
import { devtools } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { getSearchResults } from './api-calls/search';

const search = debounce<{ data?: SearchResult[]; error?: string }>(getSearchResults, 150);

interface State {
  searchTerm: string;
  searchResults: SearchResult[];
  searchResultsIsLoading: boolean;
}
interface Actions {
  setSearchTerm: (term: string) => void;
  setSearchResults: (searchResults: SearchResult[]) => void;
}

const initialState: State = {
  searchTerm: '',
  searchResults: [],
  searchResultsIsLoading: false,
};

export const useSearchStore = createWithEqualityFn<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setSearchTerm: async (searchTerm) => {
        set(() => ({ searchTerm }));
        if (searchTerm.length > 1) {
          // Api needs atleast two characters
          set(() => ({ searchResultsIsLoading: true }));
          const res = await search(searchTerm);
          if (!res.error) {
            get().setSearchResults(res.data);
          }
          set(() => ({ searchResultsIsLoading: false }));
        }
      },
      setSearchResults: (searchResults) => set(() => ({ searchResults })),
      reset: () => {
        set(initialState);
      },
    }),
    { name: 'search-storage', enabled: __DEV__ }
  )
);
