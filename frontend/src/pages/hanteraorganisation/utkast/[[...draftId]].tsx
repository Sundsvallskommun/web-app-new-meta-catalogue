import FeedbackMessage from '@components/FeedbackMessage/FeedbackMessage.component';
import LoaderFullScreen from '@components/Loader/LoaderFullScreen.component';
import LoaderFullScreenModal from '@components/Loader/LoaderFullScreenModal.component';
import ActionBottomDraft from '@components/OrgChange/Draft/ActionBottomDraft.component';
import ActionHeaderDraft from '@components/OrgChange/Draft/ActionHeaderDraft.component';
import HeadInput from '@components/OrgChange/Draft/HeadInput/HeadInput.component';
import OrganizationOrgChange from '@components/OrgChange/Draft/Organization/OrganizationOrgChange.component';
import Progressbar from '@components/OrgChange/Draft/Progressbar/Progressbar.component';
import SavedChanges from '@components/OrgChange/Draft/SavedChanges/SavedChanges.component';
import SidebarOrgChange from '@components/OrgChange/Draft/Sidebar/SidebarOrgChange.component';
import DefaultLayout from '@layouts/DefaultLayout/DefaultLayout.component';
import { Sidebar } from '@layouts/Sidebar/Sidebar.component';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { cx } from '@sk-web-gui/react';
import { shouldEditEmployees } from '@utils/shouldeditemployees';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useWindowSize } from '@utils/use-window-size.hook';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export const Index: React.FC = () => {
  const router = useRouter();
  const getCompanyOrganizations = useOrganizationStore((s) => s.getCompanyOrganizations);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const getDraft = useOrgChangeStore((s) => s.getDraft);
  const lockedView = useOrgChangeStore((s) => s.lockedView);
  const draftIsLoading = useOrgChangeStore((s) => s.draftIsLoading);
  const orgTreeIsLoading = useOrgChangeStore((s) => s.orgTreeIsLoading);
  const draft = useOrgChangeStore((s) => s.draft);
  const { draftIsReadOnly } = useDraftPhaseState();
  const mainRef = useRef();
  const [showEmployeeFocus, setShowEmployeeFocus] = useState(false);
  const employeesByOrg = useOrgChangeStore((s) => s.employeesByOrg);
  const { showFocus, mustEdit } = shouldEditEmployees();
  const windowSize = useWindowSize();

  useEffect(() => {
    const loadDraft = async () => {
      const routerDraftId = router.query['draftId'];
      const draftId = routerDraftId && Array.isArray(routerDraftId) ? routerDraftId.pop() : null;
      if (draft.companyId !== null) {
        getCompanyOrganizations(draft.companyId);
      }
      if (draftId) {
        if (router.pathname.includes(draftId)) return;
        const { error } = await getDraft(draftId);
        if (error) {
          router.push('/hanteraorganisation');
        }
      } else {
        if (!draft.companyId) {
          setSelectedOrganizationId(null);
          router.push('/hanteraorganisation');
        }
      }
    };

    if (router.isReady) {
      loadDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, router.isReady, draft.companyId]);

  useEffect(() => {
    setShowEmployeeFocus(showFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeesByOrg, showFocus]);

  if (!draft.draftId && (draftIsLoading || orgTreeIsLoading)) {
    return <LoaderFullScreen />;
  }

  return (
    <DefaultLayout
      preTitle={`${draft.name} - Hantera organisation`}
      headerSubtitle={'Hantera organisation'}
      logoLinkHref="/hanteraorganisation"
    >
      <div className={`main-padding relative`}>
        <div
          className={cx(
            'DraftSection container relative flex flex-col grow',
            lockedView && windowSize.lg && 'max-h-[50vh]',
            showEmployeeFocus ? 'space-y-md' : 'space-y-lg'
          )}
        >
          <div className="relative lg:flex lg:space-x-lg">
            <HeadInput />
            {!lockedView && (
              <div className="flex-grow lg:flex lg:flex-col lg:justify-between mt-lg lg:mt-0 space-y-lg lg:space-y-0">
                <div
                  className={`lg:flex ${
                    draft.draftId !== null && !draftIsReadOnly ? 'lg:justify-between' : 'lg:justify-end'
                  } lg:min-h-[44px] `}
                >
                  {draft.draftId !== null && !draftIsReadOnly && <SavedChanges />}
                  <ActionHeaderDraft />
                </div>
                <div>
                  <Progressbar />
                </div>
              </div>
            )}
          </div>
          {lockedView && (
            <div className="w-full grow flex justify-center items-center">
              <p className="text-md p-8 pt-[5rem] w-2xl text-gray-500 font-bold m-0">
                Visningsläget är låst. Dölj exportinformationen för att visa utkastet
              </p>
            </div>
          )}
          {showEmployeeFocus && (
            <>
              {mustEdit ?
                <FeedbackMessage severity="error" background removeCallback={() => setShowEmployeeFocus(false)}>
                  {`PA-Team eller Verksamhet måste ändras för flyttade personer under Persondetaljer i Personerlistan.`}
                </FeedbackMessage>
              : <FeedbackMessage severity="info" background removeCallback={() => setShowEmployeeFocus(false)}>
                  {`PA-Team & Verksamhet kan ändras för flyttade personer under Persondetaljer i Personerlistan.`}
                </FeedbackMessage>
              }
            </>
          )}
          {!draft.isArchived && !lockedView && (
            <Sidebar aside={<SidebarOrgChange mainRef={mainRef} />} ref={mainRef}>
              {draft.draftId !== null && <OrganizationOrgChange />}
            </Sidebar>
          )}
        </div>
      </div>
      <ActionBottomDraft />
      <LoaderFullScreenModal label="Hämtar utkastdata" show={draftIsLoading || orgTreeIsLoading} />
    </DefaultLayout>
  );
};

export default Index;
