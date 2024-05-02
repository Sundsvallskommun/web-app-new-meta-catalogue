import { useSearchStore } from '@services/mdviewer/search-service';
import { SearchBar } from '@sk-web-gui/react';
import React, { useRef } from 'react';

export const GlobalSearch: React.FC = () => {
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const { setSearchTerm } = useSearchStore();

  const refGlobalSearch = useRef(null);
  const refSearchbarWrapper = useRef<HTMLDivElement>(null);
  const refSearchBar = useRef<HTMLInputElement>(null);

  const handleOnSearch = (query?: string) => {
    setSearchTerm(query);
  };

  const onChange = (e: React.BaseSyntheticEvent) => {
    handleOnSearch(e.target.value);
  };

  const handleClose = () => {
    setSearchTerm('');
  };

  return (
    <div ref={refGlobalSearch} className="GlobalSearch relative ml-auto w-full max-w-[460px] flex items-center">
      <div ref={refSearchbarWrapper} className="w-full">
        <SearchBar
          ref={refSearchBar}
          rounded
          data-cy="search"
          aria-label="Sök i all data"
          placeholder="Sök i all data"
          value={searchTerm}
          onChange={onChange}
          onSearch={handleOnSearch}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};
