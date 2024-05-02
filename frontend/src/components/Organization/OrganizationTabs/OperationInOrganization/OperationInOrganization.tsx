import ListFilterOperation from './ListFilterOperation.component';
import OperationInOrganizationList from './OperationInOrganizationList/OperationInOrganizationList.compononent';
import { useDebouncedCallback } from '@react-hookz/web';
import { useState } from 'react';

export const OperationInOrganization: React.FC = () => {
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
      <OperationInOrganizationList searchQuery={searchQueryOperationsDelayed} />
    </div>
  );
};
