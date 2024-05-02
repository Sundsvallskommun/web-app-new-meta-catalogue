import ListFilterPeople from './ListFilterPeople.component';
import PeopleInOrganizationList from './PeopleInOrganizationList/PeopleInOrganizationList.component';
import { useDebouncedCallback } from '@react-hookz/web';
import { useState } from 'react';

export const PeopleInOrganization: React.FC = () => {
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
      <PeopleInOrganizationList searchQuery={searchQueryEmployeesDelayed} />
    </div>
  );
};
