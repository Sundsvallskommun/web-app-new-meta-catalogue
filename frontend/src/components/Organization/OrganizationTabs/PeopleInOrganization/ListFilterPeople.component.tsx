import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { ExternalLink } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useEmployeesStore } from '@services/mdviewer/employment-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, FormControl, SearchField } from '@sk-web-gui/react';
import { ColumnFilter } from '@components/ColumnFilter/ColumnFilter.component';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
interface IListFiter {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
}

const ListFilterPeople = ({ searchQuery, setSearchQuery }: IListFiter) => {
  // employeestore
  const orgEmployeeFilter = useEmployeesStore((s) => s.orgEmployeeFilter);
  const setOrgEmployeeFilter = useEmployeesStore((s) => s.setOrgEmployeeFilter);

  // orgchangestore
  const orgChangeEmployeeFilter = useOrgChangeStore((s) => s.orgChangeEmployeeFilter);
  const setOrgChangeEmployeeFilter = useOrgChangeStore((s) => s.setOrgChangeEmployeeFilter);

  // userstore
  const user = useUserStore((s) => s.user);

  // organizationstore
  const orgChangeOrg = useOrganizationStore((s) => s.organization) as OrgChangeOrganizationTree;

  const { isOrgChange } = useAppContext();
  const { draftIsReadOnly } = useDraftPhaseState();
  const router = useRouter();

  const dropDownFilter =
    isOrgChange ?
      orgChangeEmployeeFilter.map((x) => {
        if (x.id == 6) {
          return { ...x, isShown: user.permissions.canViewEmployeeDetails };
        }
        if (x.id == 7) {
          return { ...x, isShown: user.permissions.canEditEmployeeDetails && !draftIsReadOnly };
        }
        return x;
      })
    : orgEmployeeFilter.map((x) => {
        if (x.id == 4) {
          return { ...x, isShown: user.permissions.canViewEmployeeDetails };
        }
        return x;
      });
  const setDropdownFilter = isOrgChange ? setOrgChangeEmployeeFilter : setOrgEmployeeFilter;

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
          <FormControl id="org-people-listfilter-searchbar" className="w-full">
            <SearchField
              size="md"
              rounded
              aria-live="polite"
              aria-controls={isOrgChange ? 'orgchange-tabs-people-table-rowsstext' : 'org-tabs-people-table-rowsstext'}
              aria-describedby={
                isOrgChange ? 'orgchange-tabs-people-table-rowsstext' : 'org-tabs-people-table-rowsstext'
              }
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
              <a
                href="https://e-arenden.sundsvall.se/oversikt/flowoverview/1920"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button as="span" variant="primary" rightIcon={<ExternalLink />}>
                  Lägg till ny person
                </Button>
              </a>
            )}
            <NextLink
              legacyBehavior
              href={{
                query: { ...router.query, feedback: 'PERSON' },
              }}
              shallow
              replace
            >
              <Button variant="secondary">Rapportera fel</Button>
            </NextLink>
          </span>
        )}
      </div>
      <div className="flex justify-end mt-28">
        <ColumnFilter
          label="Visa/dölj kolumner i personer"
          filterData={dropDownFilter}
          onFilterChange={setDropdownFilter}
        />
      </div>
    </div>
  );
};

export default ListFilterPeople;
