import ResponsibilityNewModal from '@components/OrgChange/Draft/Organization/OrganizationTabs/ResponsibilityInOrganization/ResponsibilityEditor/ResponsibilityNewModal.component';
import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { Plus } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useResponsibilityStore } from '@services/mdviewer/responsibility-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, FormControl, SearchField } from '@sk-web-gui/react';
import { ColumnFilter } from '@components/ColumnFilter/ColumnFilter.component';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface IListFiter {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
}

const ListFilterResponsibility = ({ searchQuery, setSearchQuery }: IListFiter) => {
  const { isOrgChange } = useAppContext();
  const user = useUserStore((s) => s.user);
  const orgChangeResponsibilityFilter = useOrgChangeStore((s) => s.orgChangeResponsibilityFilter);
  const setOrgChangeResponsibilityFilter = useOrgChangeStore((s) => s.setOrgChangeResponsibilityFilter);
  const orgResponsibilityFilter = useResponsibilityStore((s) => s.orgResponsibilityFilter);
  const setOrgResponsibilityFilter = useResponsibilityStore((s) => s.setOrgResponsibilityFilter);
  const orgChangeOrg = useOrganizationStore((s) => s.organization) as OrgChangeOrganizationTree;
  const { draftIsReadOnly } = useDraftPhaseState();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const dropDownFilter =
    isOrgChange ?
      orgChangeResponsibilityFilter.map((x) =>
        x.id == 7 ? { ...x, isShown: user.permissions.canEditResponsibility && !draftIsReadOnly } : x
      )
    : orgResponsibilityFilter;
  const setDropdownFilter = isOrgChange ? setOrgChangeResponsibilityFilter : setOrgResponsibilityFilter;

  const openModalHandler = () => {
    setIsOpen(true);
  };

  const onCloseHandler = () => {
    setIsOpen(false);
  };

  const onSearchChangeHandler = (e: React.BaseSyntheticEvent) => {
    setSearchQuery(e.target.value);
  };

  const onSearchCloseHandler = () => {
    setSearchQuery('');
  };

  return (
    <div className="list-filter bg-background-content">
      <div className="flex justify-between w-full flex-wrap">
        <span className="pl-lg pr-10 flex-grow mb-20">
          <FormControl id="org-responsibility-listfilter-searchbar">
            <SearchField
              size="md"
              aria-live="polite"
              aria-controls={
                isOrgChange ?
                  'orgchange-tabs-responsibilities-table-rowsstext'
                : 'org-tabs-responsibilities-table-rowsstext'
              }
              aria-describedby={
                isOrgChange ?
                  'orgchange-tabs-responsibilities-table-rowsstext'
                : 'org-tabs-responsibilities-table-rowsstext'
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
          <span className="flex flex-wrap justify-end gap-15 px-lg">
            {isOrgChange && user.permissions.canEditResponsibility && !draftIsReadOnly && (
              <Button
                className="w-fit h-fit"
                onClick={openModalHandler}
                size="md"
                variant="primary"
                color="primary"
                leftIcon={<Plus />}
              >
                Skapa nytt ansvar
              </Button>
            )}
            <NextLink
              legacyBehavior
              href={{
                query: { ...router.query, feedback: 'RESPONSIBILITY' },
              }}
              shallow
              replace
            >
              <Button variant="secondary" className="w-fit h-fit" size="md">
                Rapportera fel
              </Button>
            </NextLink>
          </span>
        )}
      </div>
      <div className="lg:flex lg:flex-row lg:items-center gap-lg mt-20 px-20">
        <p className="text-large">Anpassa:</p>
        <span className="max-w-[300px] w-full">
          <ColumnFilter
            label="Visa/dölj kolumner i ansvar"
            filterData={dropDownFilter}
            onFilterChange={setDropdownFilter}
          />
        </span>
      </div>

      {isOpen && isOrgChange && <ResponsibilityNewModal onClose={onCloseHandler} />}
    </div>
  );
};

export default ListFilterResponsibility;
