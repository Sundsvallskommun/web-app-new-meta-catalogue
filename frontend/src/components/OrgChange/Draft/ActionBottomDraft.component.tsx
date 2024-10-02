import { RunBookActionTriggerDtoCommandEnum } from '@data-contracts/backend/data-contracts';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useUserStore } from '@services/user-service/user-service';
import { Badge, Button, Link, useConfirm } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useWindowSize } from '@utils/use-window-size.hook';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Sticky from 'react-sticky-el';
import ExportPhaseInfo from './BottomInfoBar/ExportPhaseInfo.component';
import ExportVerifyInfo from './BottomInfoBar/ExportVerifyInfo.component';
import CommentsSidebar from './CommentsSidebar/CommentsSidebar.component';
import useVerifyState from '@utils/use-verify-state';

export default function ActionBottomDraft() {
  const user = useUserStore((s) => s.user);

  const draft = useOrgChangeStore((s) => s.draft);
  const draftComments = useOrgChangeStore((s) => s.draftComments);
  const getDraftComments = useOrgChangeStore((s) => s.getDraftComments);
  const triggerDraft = useOrgChangeStore((s) => s.triggerDraft);

  const [commentsSidebarOpen, setCommentsSidebarOpen] = useState(false);
  const { draftIsApproved, draftIsExportPhase } = useDraftPhaseState();
  const { verifyHasErrors } = useVerifyState();
  const windowSize = useWindowSize();

  const { showConfirmation } = useConfirm();

  const showPhaseInfo = draftIsApproved || draftIsExportPhase;
  const showVerifyInfo = draft.changes > 0 && (verifyHasErrors || (draft.verifyResult && draft.runbook === null));

  const onExport = async () => {
    const shouldContinue = await showConfirmation('Starta export', 'Är du säker på att du vill starta exporten?');
    if (!shouldContinue) return;

    await triggerDraft(RunBookActionTriggerDtoCommandEnum.APPROVE_DRAFT);
  };

  useEffect(() => {
    getDraftComments(draft.draftId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showCommentsUnread =
    (user.readCommentsClearedDate === null && draftComments.length) ||
    (user.readCommentsClearedDate &&
      draftComments?.length > 0 &&
      draftComments[draftComments.length - 1].loginname !== user.username &&
      dayjs(user.readCommentsClearedDate).isBefore(draftComments[draftComments.length - 1].createdDT));

  return (
    <>
      <Sticky
        stickyClassName={`${commentsSidebarOpen ? 'z-20' : 'z-30'}`}
        disabled={!windowSize.lg}
        mode="bottom"
        positionRecheckInterval={150}
        boundaryElement=".main-container"
        hideOnBoundaryHit={false}
      >
        {showPhaseInfo && <ExportPhaseInfo />}
        {showVerifyInfo && <ExportVerifyInfo />}

        <div className="bg-background-one bg-opacity-50 lg:flex pb-lg lg:pb-0 px-8">
          <div className="max-width-content mx-auto w-full lg:flex relative justify-end gap-xl">
            <div className="w-full space-y-md lg:space-y-0 lg:flex lg:justify-between py-lg gap-8">
              <Link className="w-full max-w-[60rem] flex-shrink" href="/hanteraorganisation">
                <Button as="span" size="lg" variant="solid" className="w-full">
                  Lämna utkast
                </Button>
              </Link>
              {!(draftIsApproved || draftIsExportPhase) && user.permissions.canEditDrafts && (
                <Button
                  onClick={onExport}
                  disabled={draft.changes === 0}
                  className="w-full max-w-[60rem] flex-shrink"
                  size="lg"
                  variant="solid"
                  color="primary"
                >
                  Godkänn och exportera
                </Button>
              )}
            </div>
            <div className="flex">
              {user.permissions.canCommentDraft && (
                <Button
                  size="lg"
                  onClick={() => setCommentsSidebarOpen(true)}
                  variant="link"
                  className="lg:py-lg"
                  leftIcon={
                    <span className="relative">
                      <QuestionAnswerOutlinedIcon fontSize="large" />
                      {showCommentsUnread && (
                        <Badge
                          className="absolute right top-[0.01rem]"
                          size="sm"
                          variant="solid"
                          color="warning"
                          position={'super-overlap'}
                        />
                      )}
                    </span>
                  }
                >
                  Kommentarer
                </Button>
              )}
            </div>
          </div>
        </div>
      </Sticky>
      {commentsSidebarOpen && (
        <CommentsSidebar commentsSidebarOpen={commentsSidebarOpen} onClose={() => setCommentsSidebarOpen(false)} />
      )}
    </>
  );
}
