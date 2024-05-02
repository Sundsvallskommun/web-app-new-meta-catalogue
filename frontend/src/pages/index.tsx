import SubmenuLayout from '@layouts/SubmenuLayout/SubmenuLayout.component';
import { Sidebar } from '@layouts/Sidebar/Sidebar.component';
import SidebarOrganization from '@components/SidebarOrganization/SidebarOrganization.component';
import Organization from '@components/Organization/Organization.component';
import { useRef } from 'react';

export const Index: React.FC = () => {
  const mainRef = useRef();

  return (
    <SubmenuLayout preTitle="Organisation">
      <div className="main-padding">
        <div className="container">
          <Sidebar aside={<SidebarOrganization mainRef={mainRef} />} ref={mainRef}>
            <Organization />
          </Sidebar>
        </div>
      </div>
    </SubmenuLayout>
  );
};

export default Index;
