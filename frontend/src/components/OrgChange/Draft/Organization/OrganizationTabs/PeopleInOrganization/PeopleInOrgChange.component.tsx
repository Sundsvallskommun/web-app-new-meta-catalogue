import ListFilterPeople from '@components/Organization/OrganizationTabs/PeopleInOrganization/ListFilterPeople.component';
import { PeopleInOrgChangeList } from './PeopleInOrganizationList/PeopleInOrgChangeList.component';
import { useDebouncedCallback } from '@react-hookz/web';
import { useState } from 'react';

export const PeopleInOrgChange: React.FC = () => {
  const [searchQueryEmployees, setSearchQueryEmployees] = useState('');
  const [searchQueryEmployeesDelayed, setSearchQueryEmployeesDelayed] = useState('');

  const setEmployeeDelayQuery = useDebouncedCallback(
    (query: string) => {
      setSearchQueryEmployeesDelayed(query);
    },
    [],
    150,
    500
  );

  const handleSetEmployeeSearchQuery = (value: string) => {
    setSearchQueryEmployees(value);
    setEmployeeDelayQuery(value);
  };

  return (
    <div>
      <ListFilterPeople searchQuery={searchQueryEmployees} setSearchQuery={handleSetEmployeeSearchQuery} />
      <PeopleInOrgChangeList searchQuery={searchQueryEmployeesDelayed} />
    </div>
  );
};
