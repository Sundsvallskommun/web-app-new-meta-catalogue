import DraftListActions, {
  dofilterMatchPhase,
  getDraftPhaseAction,
} from '@components/OrgChange/OrganizationManager/DraftListActions/DraftListActions.component';
import ChooseCompanyForDraft from '@components/OrgChange/OrganizationManager/Modals/ChooseCompanyForDraftModal.component';
import OrganizationManager from '@components/OrgChange/OrganizationManager/OrganizationManager.component';
import { Draft } from '@data-contracts/backend/data-contracts';
import { DraftListFilters } from '@interfaces/orgchange';
import DefaultLayout from '@layouts/DefaultLayout/DefaultLayout.component';
import Main from '@layouts/Main/Main.component';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { columnSort } from '@utils/columnSort';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

export const Index: React.FC = () => {
  const resetDraft = useOrgChangeStore((s) => s.resetDraft);
  const drafts = useOrgChangeStore((s) => s.drafts);
  const [chooseCompanyForDraftIsOpen, setChooseCompanyForDraftIsOpen] = useState(false);
  const [draftsFilters, setDraftsFilters] = useState<DraftListFilters>({
    query: '',
    phase: null,
    timeRange: null,
  });
  const [filteredDrafts, setFilteredDrafts] = useState(drafts);

  useEffect(() => {
    resetDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draftsFiltersMemo = useMemo(() => draftsFilters, [draftsFilters]);

  useEffect(() => {
    setFilteredDrafts(
      drafts
        .filter((x: Draft) => {
          if (draftsFiltersMemo.query && !x.name.toLowerCase().includes(draftsFiltersMemo.query.toLowerCase()))
            return false;
          if (draftsFiltersMemo.phase && !dofilterMatchPhase(draftsFiltersMemo.phase, x)) return false;
          if (draftsFiltersMemo.timeRange && !dayjs(x.createdDT).isAfter(dayjs(draftsFiltersMemo.timeRange)))
            return false;
          return true;
        })
        .sort(
          (a, b) =>
            columnSort(getDraftPhaseAction(a), getDraftPhaseAction(b), 1) || columnSort(a.cutOffDate, b.cutOffDate, -1)
        )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftsFiltersMemo, drafts]);

  return (
    <DefaultLayout
      preTitle={`Hantera organisation`}
      headerSubtitle={'Hantera organisation'}
      logoLinkHref="/hanteraorganisation"
    >
      <div className="main-padding">
        <div className="container">
          <DraftListActions
            draftsFilters={draftsFilters}
            setDraftsFilters={setDraftsFilters}
            openEditModalHandler={() => setChooseCompanyForDraftIsOpen(true)}
          />
        </div>
        <Main>
          <OrganizationManager
            drafts={filteredDrafts}
            openEditModalHandler={() => setChooseCompanyForDraftIsOpen(true)}
          />
        </Main>
      </div>
      {chooseCompanyForDraftIsOpen && <ChooseCompanyForDraft onClose={() => setChooseCompanyForDraftIsOpen(false)} />}
    </DefaultLayout>
  );
};

export default Index;
