import CenteredLoader from '@components/Loader/CenteredLoader.component';
import Loader from '@components/Loader/Loader.component';
import AddIcon from '@mui/icons-material/Add';
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
          <Button
            type="button"
            size="lg"
            onClick={openEditModalHandler}
            leftIcon={<AddIcon fontSize="medium" className="mr-sm" />}
            className="max-w-[500px] w-full max-h-[230px] h-full py-[84px] text-primary font-bold hover:text-white hover:tranisition hover:duration-300"
          >
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
    <div className="bg-white relative grow px-0 pb-16 pt-10 shadow-md mb-20">
      {!draftsIsLoading ?
        <>
          <div className="lg:flex lg:justify-between content-center mx-2 lg:mx-8 px-2 border-b-2 border-grey">
            <h1 className="text-xl">
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
