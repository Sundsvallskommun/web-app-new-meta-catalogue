import ResponsibilityList from '@components/Responsibilities/ResponsibilityList/ResponsibilityList';
import ResponsibilityListFilter from '@components/Responsibilities/ResponsibilityListFilter/ResponsibilityListFilter';
import Main from '@layouts/Main/Main.component';
import SubmenuLayout from '@layouts/SubmenuLayout/SubmenuLayout.component';
import { useResponsibilityStore } from '@services/mdviewer/responsibility-service';
import { useEffect, useState } from 'react';

export const Index: React.FC = () => {
  const { getResponsibilities, selectedCompanyId } = useResponsibilityStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    if (selectedCompanyId) {
      setIsLoading(true);
      getResponsibilities(selectedCompanyId, controller.signal);
    }
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId]);

  return (
    <SubmenuLayout preTitle="Ansvar">
      <div className="main-padding">
        <Main>
          <div className="shadow-md">
            <ResponsibilityListFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <ResponsibilityList searchQuery={searchQuery} />
          </div>
        </Main>
      </div>
    </SubmenuLayout>
  );
};

export default Index;
