import ResponsibilityNewModal from '@components/OrgChange/Draft/Organization/OrganizationTabs/ResponsibilityInOrganization/ResponsibilityEditor/ResponsibilityNewModal.component';
import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { Plus } from 'lucide-react';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, FormControl, SearchField } from '@sk-web-gui/react';
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
  const orgChangeOrg = useOrganizationStore((s) => s.organization) as OrgChangeOrganizationTree;
  const { draftIsReadOnly } = useDraftPhaseState();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="flex justify-between w-full flex-wrap gap-x-md">
        <span className="flex-grow mb-20">
          <FormControl id="org-responsibility-listfilter-searchbar" className="w-full">
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
          <span className="flex flex-wrap justify-end gap-15">
            {isOrgChange && user.permissions.canEditResponsibility && !draftIsReadOnly && (
              <Button onClick={openModalHandler} size="md" variant="primary" color="primary" leftIcon={<Plus />}>
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
              <Button variant="secondary" size="md">
                Rapportera fel
              </Button>
            </NextLink>
          </span>
        )}
      </div>

      {isOpen && isOrgChange && <ResponsibilityNewModal onClose={onCloseHandler} />}
    </div>
  );
};

export default ListFilterResponsibility;
