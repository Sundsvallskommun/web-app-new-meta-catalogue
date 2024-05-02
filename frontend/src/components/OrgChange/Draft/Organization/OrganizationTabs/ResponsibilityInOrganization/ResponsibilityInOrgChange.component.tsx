import ListFilterResponsibility from '@components/Organization/OrganizationTabs/ResponsibilityInOrganization/ListFilterResponsibility.component';
import { useDebouncedCallback } from '@react-hookz/web';
import { useState } from 'react';
import ResponsibilityinOrgChangeList from './ResponsibilityinOrganizationList/ResponsibilityinOrgChangeList.compononent';

export const ResponsibilityInOrgChange: React.FC = () => {
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
      <ResponsibilityinOrgChangeList searchQuery={searchQueryResponsibilitiesDelayed} />
    </div>
  );
};
