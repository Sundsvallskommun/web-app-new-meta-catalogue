import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import OpenInNewSharpIcon from '@mui/icons-material/OpenInNewSharp';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useEmployeesStore } from '@services/mdviewer/employment-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, DropdownFilter, FormControl, Link, SearchBar } from '@sk-web-gui/react';
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
          return { ...x, isShown: user.permissions.canEditOrganization && !draftIsReadOnly };
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
    <div className="list-filter bg-white">
      <div className="flex justify-between w-full flex-wrap">
        <span className="pl-lg pr-4 flex-grow mb-8">
          <FormControl id="org-people-listfilter-searchbar">
            <SearchBar
              rounded
              aria-live="polite"
              aria-controls={isOrgChange ? 'orgchange-tabs-people-table-rowsstext' : 'org-tabs-people-table-rowsstext'}
              aria-describedby={
                isOrgChange ? 'orgchange-tabs-people-table-rowsstext' : 'org-tabs-people-table-rowsstext'
              }
              placeholder="Sök i listan"
              value={searchQuery}
              onClose={onSearchCloseHandler}
              onChange={onSearchChangeHandler}
            />
          </FormControl>
        </span>
        {orgChangeOrg?.structureChangeStatus !== 'DELETED' && (
          <span className="flex flex-wrap justify-end gap-6 px-lg">
            {isOrgChange && user.permissions.canEditResponsibility && !draftIsReadOnly && (
              <Link
                className="[&>.link-external-icon]:hidden"
                href={`https://e-arenden.sundsvall.se/oversikt/flowoverview/1920`}
                external
              >
                <Button as="span" variant="solid" color="primary" rightIcon={<OpenInNewSharpIcon />}>
                  Lägg till ny person
                </Button>
              </Link>
            )}
            <NextLink
              legacyBehavior
              href={{
                query: { ...router.query, feedback: 'PERSON' },
              }}
              shallow
              replace
            >
              <Button className="w-fit h-fit">Rapportera fel</Button>
            </NextLink>
          </span>
        )}
      </div>
      <div className="lg:flex lg:flex-row gap-lg bg-gray-lighter py-6 mt-8 px-8">
        <p className="text-lg">Anpassa:</p>
        <span className="basis-1/3">
          <DropdownFilter
            label="Visa/dölj kolumner i personer"
            filterData={dropDownFilter}
            onFilterChange={setDropdownFilter}
          />
        </span>
      </div>
    </div>
  );
};

export default ListFilterPeople;
