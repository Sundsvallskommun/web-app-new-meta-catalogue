import CenteredLoader from '@components/Loader/CenteredLoader.component';
import Loader from '@components/Loader/Loader.component';
import { Plus } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import DraftCards from './DraftCards/DraftCards.component';
import DraftList from './DraftList/DraftList.components';
import DraftViewAs from './DraftViewAs/DraftViewAs.component';
import { Draft } from '@data-contracts/backend/data-contracts';
import { useUserStore } from '@services/user-service/user-service';

interface OrganizationManagerProps {
  openEditModalHandler: () => void;
  drafts: Draft[];
}

const DraftsView = ({ view, drafts, draftsIsLoading }) => {
  switch (view) {
    case 'list':
      return <DraftList draftData={drafts} draftsIsLoading={draftsIsLoading} />;
    case 'card':
    default:
      return <DraftCards draftData={drafts} draftsIsLoading={draftsIsLoading} />;
  }
};

const EmptyWindow = ({ openEditModalHandler }) => {
  const user = useUserStore((s) => s.user);
  return (
    <div className="pb-xl px-lg text-center">
      <span className="block pt-lg pb-xl text-base">
        Det finns inga organisationsförändringar som matchar sökningen eller filtreringen
      </span>
      {user.permissions.canEditDrafts && (
        <div className="flex justify-center">
          <Button variant="secondary" type="button" size="lg" onClick={openEditModalHandler} leftIcon={<Plus />}>
            Ny Organisationsförändring
          </Button>
        </div>
      )}
    </div>
  );
};

export const OrganizationManager = (props: OrganizationManagerProps) => {
  const { openEditModalHandler, drafts } = props;
  const getDrafts = useOrgChangeStore((s) => s.getDrafts);
  const draftsIsLoading = useOrgChangeStore((s) => s.draftsIsLoading);
  const [view, setView] = useState('card');

  useEffect(() => {
    getDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background-content relative grow px-0 pb-40 pt-24 mb-50">
      {!draftsIsLoading ?
        <>
          <div className="flex justify-between items-center gap-md mb-16">
            <h1 className="text-h4 text-dark-secondary">
              Organisationsförändringar{' '}
              {drafts && draftsIsLoading ?
                <Loader size="md" aria-label="hämtar utkast med förändringar" />
              : drafts.length >= 1 ?
                <span id="draftlist-count">
                  {`(${drafts.length})`}
                  <span className="sr-only">stycken i listan</span>
                </span>
              : ''}
            </h1>
            <div>
              <DraftViewAs setView={setView} view={view} />
            </div>
          </div>
          {drafts.length === 0 ?
            <EmptyWindow openEditModalHandler={openEditModalHandler} />
          : <DraftsView drafts={drafts} draftsIsLoading={draftsIsLoading} view={view} />}
        </>
      : <CenteredLoader />}
    </div>
  );
};
export default OrganizationManager;
