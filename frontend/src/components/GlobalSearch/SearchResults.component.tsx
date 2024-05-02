import { SearchItem } from '@components/GlobalSearch/SearchItem.component';
import { objectType } from '@services/mdviewer/data-handlers/search';
import { useSearchStore } from '@services/mdviewer/search-service';
import { Checkbox, Pagination } from '@sk-web-gui/react';
import { useWindowSize } from '@utils/use-window-size.hook';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

interface Category {
  [type: string]: { type: string; count: number; value: boolean };
}

interface IModalProps {
  className?: string;
}

const SearchResults = React.forwardRef<HTMLDivElement, IModalProps>(({ className = '' }, ref) => {
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const searchResults = useSearchStore((s) => s.searchResults);
  const searchResultsIsLoading = useSearchStore((s) => s.searchResultsIsLoading);
  const [filterCategories, setFilterCategories] = useState<Category>({});
  const [activePage, setActivePage] = useState(1);
  const pageSize = 8;

  const windowSize = useWindowSize();

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const handleOnCategoryFilterChange = (categoryType: string) => (e: React.BaseSyntheticEvent) => {
    setFilterCategories((categories) => {
      categories[categoryType] = Object.assign(categories[categoryType], { value: e.target.checked });
      return Object.assign({}, categories);
    });
    setActivePage(1);
  };

  useEffect(() => {
    setActivePage(1);
  }, [searchTerm]);

  useEffect(() => {
    setFilterCategories((categories) => {
      const groupedFilters = _(searchResults)
        .groupBy((x) => x.objectType)
        .map((items, objectType) => ({
          type: objectType,
          count: items.length,
          value: true,
        }))
        .valueOf();
      const newCategories: Category = {};
      groupedFilters.forEach((filter) => {
        newCategories[filter.type] = categories[filter.type]
          ? Object.assign(categories[filter.type], { count: filter.count })
          : filter;
      });
      return newCategories;
    });
  }, [searchResults]);

  const startIndex = activePage * pageSize - pageSize;
  const endIndex = startIndex + pageSize;
  const shownCategories: string[] = Object.entries(filterCategories)
    .filter((x) => x[1].value === true)
    .map((x) => x[0]);
  const shownResults = searchResults.filter((x) => shownCategories.includes(x.objectType));

  return (
    <div>
      <div className={`${className} h-full inline-block w-full transition-all transform `}>
        <div ref={ref} className="mx-auto max-w-[818px] mt-20">
          <div className={`flex justify-between w-full mb-sm p-sm border-b-2 border-[#ECECEC]`}>
            <h2 data-cy="search-results-query" className={`grow text-2xl text-left`}>
              Sökord: {searchTerm}
            </h2>
          </div>
          {!searchResultsIsLoading ? (
            <div>
              <span className="lg:flex">
                <h3 data-cy="search-results-amount" className="min-w-max text-lg px-sm">
                  {`${
                    shownResults.length !== searchResults.length
                      ? `(${shownResults.length} av ${searchResults.length})`
                      : `${searchResults.length}`
                  }`}{' '}
                  sökresultat:
                </h3>
                <div className="ml-md flex flex-col lg:flex-row lg:inline-flex lg:flex-wrap">
                  {Object.keys(filterCategories).map((categoryType) => (
                    <Checkbox
                      key={categoryType}
                      checked={filterCategories[categoryType].value}
                      onChange={handleOnCategoryFilterChange(categoryType)}
                    >
                      <span className="mr-lg">{`${objectType(categoryType).text} (${
                        filterCategories[categoryType].count
                      })`}</span>
                    </Checkbox>
                  ))}
                </div>
              </span>
              {shownResults.length > 0 ? (
                <div>
                  {shownResults.slice(startIndex, endIndex).map((result, i) => (
                    <SearchItem key={`${result.id}-${i}`} item={result} />
                  ))}
                  {Math.ceil(shownResults.length / pageSize) > 1 && (
                    <Pagination
                      pagesBefore={!windowSize.lg ? 0 : undefined}
                      pagesAfter={!windowSize.lg ? 0 : undefined}
                      className="mt-lg text-lg"
                      pages={Math.ceil(shownResults.length / pageSize)}
                      activePage={activePage}
                      changePage={handlePageChange}
                    />
                  )}
                </div>
              ) : (
                <div className="px-sm">Inga sökresultat</div>
              )}
            </div>
          ) : (
            <div className="px-sm">Laddar..</div>
          )}
        </div>
      </div>
    </div>
  );
});
SearchResults.displayName = 'SearchResults';
export default SearchResults;
