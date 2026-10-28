import OperationConnectorModal from '@components/OrgChange/Draft/Organization/OrganizationTabs/OperationInOrganization/OperationConnector/OperationConnectorModal.component';
import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { Plus } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOperationStore } from '@services/mdviewer/operation-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, FormControl, SearchField } from '@sk-web-gui/react';
import { ColumnFilter } from '@components/ColumnFilter/ColumnFilter.component';
import { IFilterData } from '@interfaces/filter-data';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
interface IListFiter {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
}

const ListFilterOperation = ({ searchQuery, setSearchQuery }: IListFiter) => {
  // operationstore
  const orgOperationFilter = useOperationStore((s) => s.orgOperationFilter);
  const setOrgOperationFilter = useOperationStore((s) => s.setOrgOperationFilter);

  // orgchangestore
  const orgChangeOperationFilter = useOrgChangeStore((s) => s.orgChangeOperationFilter);
  const setOrgChangeOperationFilter = useOrgChangeStore((s) => s.setOrgChangeOperationFilter);

  // userstore
  const user = useUserStore((s) => s.user);

  // organization
  const orgChangeOrg = useOrganizationStore((s) => s.organization) as OrgChangeOrganizationTree;

  const { isOrgChange } = useAppContext();
  const { draftIsReadOnly } = useDraftPhaseState();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const dropDownFilter =
    isOrgChange ?
      orgChangeOperationFilter.map((x) => {
        if (x.id == 3) {
          return { ...x, isShown: user.permissions.canEditOperation && !draftIsReadOnly };
        }
        return x;
      })
    : orgOperationFilter;
  const setDropdownFilter = isOrgChange ? setOrgChangeOperationFilter : setOrgOperationFilter;

  const onSearchChangeHandler = (e: React.BaseSyntheticEvent) => {
    setSearchQuery(e.target.value);
  };

  const onSearchCloseHandler = () => {
    setSearchQuery('');
  };

  const handleSetOperationFilter = (data: IFilterData[]) => {
    setDropdownFilter(JSON.parse(JSON.stringify(data)));
  };

  const onModalHandler = () => {
    setIsOpen(true);
  };

  const onCloseHandler = () => {
    setIsOpen(false);
  };

  return (
    <div className="list-filter bg-background-content">
      <div className="flex justify-between w-full flex-wrap gap-x-md">
        <span className="flex-grow mb-20">
          <FormControl id="org-operation-listfilter-searchbar" className="w-full">
            <SearchField
              size="md"
              aria-live="polite"
              aria-controls={
                isOrgChange ? 'orgchange-tabs-operations-table-rowsstext' : 'org-tabs-operations-table-rowsstext'
              }
              aria-describedby={
                isOrgChange ? 'orgchange-tabs-operations-table-rowsstext' : 'org-tabs-operations-table-rowsstext'
              }
              rounded
              placeholder="Sök i listan"
              value={searchQuery}
              onReset={onSearchCloseHandler}
              onChange={onSearchChangeHandler}
            />
          </FormControl>
        </span>
        {orgChangeOrg?.structureChangeStatus !== 'DELETED' && (
          <span className="flex flex-wrap justify-end gap-15">
            {isOrgChange && !draftIsReadOnly && (
              <Button onClick={onModalHandler} size="md" variant="primary" color="primary" leftIcon={<Plus />}>
                Koppla på verksamhet
              </Button>
            )}
            <NextLink
              legacyBehavior
              href={{
                query: { ...router.query, feedback: 'OPERATION' },
              }}
              shallow
              replace
            >
              <Button variant="secondary" size="md">
                Rapportera fel
              </Button>
            </NextLink>
          </span>
        )}
      </div>
      <div className="flex mt-28">
        <ColumnFilter
          label="Visa/dölj kolumner i verksamheter"
          filterData={dropDownFilter}
          onFilterChange={handleSetOperationFilter}
        />
      </div>
      {isOpen && <OperationConnectorModal onClose={onCloseHandler} />}
    </div>
  );
};

export default ListFilterOperation;
