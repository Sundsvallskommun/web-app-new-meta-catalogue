import ListFilterResponsibility from './ListFilterResponsibility.component';
import ResponsibilityinOrganizationList from './ResponsibilityinOrganizationList/ResponsibilityinOrganizationList.compononent';
import { useDebouncedCallback } from '@react-hookz/web';
import { useState } from 'react';

export const ResponsibilityInOrganization: React.FC = () => {
  const [searchQueryResponsibilities, setSearchQueryResponsibilities] = useState('');
  const [searchQueryResponsibilitiesDelayed, setSearchQueryResponsibilitiesDelayed] = useState('');

  const setResponsibilitiesDelayQuery = useDebouncedCallback(
    (query: string) => {
      setSearchQueryResponsibilitiesDelayed(query);
    },
    [],
    150,
    500
  );

  const handleSetResponsibilitiesSearchQuery = (value: string) => {
    setSearchQueryResponsibilities(value);
    setResponsibilitiesDelayQuery(value);
  };

  return (
    <div>
      <ListFilterResponsibility
        searchQuery={searchQueryResponsibilities}
        setSearchQuery={handleSetResponsibilitiesSearchQuery}
      />
      <ResponsibilityinOrganizationList searchQuery={searchQueryResponsibilitiesDelayed} />
    </div>
  );
};
