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
import { Alert, cx } from '@sk-web-gui/react';
import { X } from 'lucide-react';
import { shouldEditEmployees } from '@utils/shouldeditemployees';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
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
  const mainRef = useRef<HTMLDivElement>(null);
  const [showEmployeeFocus, setShowEmployeeFocus] = useState(false);
  const employeesByOrg = useOrgChangeStore((s) => s.employeesByOrg);
  const { showFocus, mustEdit } = shouldEditEmployees();

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
            showEmployeeFocus ? 'space-y-md' : 'space-y-lg'
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-md">
            <HeadInput />
            {!lockedView && (
              <div className="flex flex-wrap items-center gap-12">
                {draft.draftId !== null && !draftIsReadOnly && <SavedChanges />}
                <ActionHeaderDraft />
              </div>
            )}
          </div>
          {draft.isArchived && !lockedView && <Progressbar />}
          {lockedView && (
            <Alert type="info">
              <Alert.Icon />
              <Alert.Content>
                <Alert.Content.Description>
                  Visningsläget är låst medan exportinformationen visas. Dölj exportinformationen för att visa utkastet.
                </Alert.Content.Description>
              </Alert.Content>
            </Alert>
          )}
          {showEmployeeFocus && (
            <Alert type={mustEdit ? 'error' : 'info'}>
              <Alert.Icon />
              <Alert.Content>
                <Alert.Content.Description id="employee-focus-message">
                  {mustEdit ?
                    'PA-Team eller Verksamhet måste ändras för flyttade personer under Persondetaljer i Personerlistan.'
                  : 'PA-Team & Verksamhet kan ändras för flyttade personer under Persondetaljer i Personerlistan.'}
                </Alert.Content.Description>
              </Alert.Content>
              <Alert.Button
                iconButton
                aria-label="Dölj meddelande tills sidomladdning"
                aria-controls="employee-focus-message"
                onClick={() => setShowEmployeeFocus(false)}
              >
                <X />
              </Alert.Button>
            </Alert>
          )}
          {!draft.isArchived && !lockedView && (
            <Sidebar aside={<SidebarOrgChange mainRef={mainRef} />} ref={mainRef}>
              <div className="mb-32">
                <Progressbar />
              </div>
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
