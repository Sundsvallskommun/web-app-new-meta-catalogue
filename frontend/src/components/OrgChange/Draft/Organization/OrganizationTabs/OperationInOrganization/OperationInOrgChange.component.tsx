import ListFilterOperation from '@components/Organization/OrganizationTabs/OperationInOrganization/ListFilterOperation.component';
import { useDebouncedCallback } from '@react-hookz/web';
import { useState } from 'react';
import OperationInOrgChangeList from './OperationInOrganizationList/OperationInOrgChangeList.compononent';

export const OperationInOrgChange: React.FC = () => {
  const [searchQueryOperations, setSearchQueryOperations] = useState('');
  const [searchQueryOperationsDelayed, setSearchQueryOperationsDelayed] = useState('');

  const setOperationsDelayQuery = useDebouncedCallback(
    (query: string) => {
      setSearchQueryOperationsDelayed(query);
    },
    [],
    150,
    500
  );

  const handleSetOperationsSearchQuery = (value: string) => {
    setSearchQueryOperations(value);
    setOperationsDelayQuery(value);
  };

  return (
    <div>
      <ListFilterOperation searchQuery={searchQueryOperations} setSearchQuery={handleSetOperationsSearchQuery} />
      <OperationInOrgChangeList searchQuery={searchQueryOperationsDelayed} />
    </div>
  );
};
