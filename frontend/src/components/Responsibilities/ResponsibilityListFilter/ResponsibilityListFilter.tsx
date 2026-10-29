import { useDebouncedCallback } from '@react-hookz/web';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useResponsibilityStore } from '@services/mdviewer/responsibility-service';
import { Button, FormControl, SearchField, Select } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
interface IResponsibilityListFilter {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
}

const ResponsibilityListFilter = ({ searchQuery, setSearchQuery }: IResponsibilityListFilter) => {
  const { treeImage, getTreeImage } = useOrganizationStore();
  const { selectedCompanyId, setSelectedCompanyId } = useResponsibilityStore();
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const router = useRouter();

  const setDelayQuery = useDebouncedCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [],
    150,
    500
  );

  const onSearchChangeHandler = (e: React.BaseSyntheticEvent) => {
    setSearchTerm(e.target.value);
    setDelayQuery(e.target.value);
  };

  const onSearchCloseHandler = () => {
    setSearchQuery('');
  };

  /**
   * On mount, get root tree
   */
  useEffect(() => {
    getTreeImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCompanyChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedCompanyId(parseInt(e.target.value));
  };

  const onSearchHandler = () => ({});

  return (
    <div className="ListFilter pt-20 bg-background-content">
      <div className="flex justify-between w-full flex-wrap gap-x-md">
        <div className="flex flex-col space-y-md lg:space-y-0 lg:flex-row lg:space-x-md lg:items-center mb-20">
          <span>
            <Select
              size="md"
              className="w-full lg:w-fit"
              id="responsibilities-listfilter-company"
              onChange={onCompanyChange}
              value={selectedCompanyId.toString() ?? ''}
              defaultValue={selectedCompanyId.toString() ?? ''}
            >
              {treeImage?.map((c) => (
                <Select.Option key={`${c.orgName}`} value={c.companyId}>
                  {c.orgName}
                </Select.Option>
              )) || []}
            </Select>
          </span>
          <span className="max-w-[460px]">
            <FormControl id="responsibilities-listfilter-searchbar">
              <SearchField
                size="md"
                rounded
                aria-label="Sök i listan över ansvar"
                placeholder="Sök i listan"
                value={searchTerm}
                onReset={onSearchCloseHandler}
                onChange={onSearchChangeHandler}
                onSearch={onSearchHandler}
              />
            </FormControl>
          </span>
        </div>
        <span className="flex flex-wrap justify-end gap-15">
          <NextLink
            href={{
              query: { ...router.query, feedback: 'RESPONSIBILITY' },
            }}
            shallow
            replace
          >
            <Button as="span" variant="secondary" size="md">
              Rapportera fel
            </Button>
          </NextLink>
        </span>
      </div>
    </div>
  );
};

export default ResponsibilityListFilter;
