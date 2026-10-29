import { RunBookActionTriggerDtoCommandEnum } from '@data-contracts/backend/data-contracts';
import { MessagesSquare } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Link, useConfirm } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
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
      <div className="z-10 lg:sticky lg:bottom-0">
        {showPhaseInfo && <ExportPhaseInfo />}
        {showVerifyInfo && <ExportVerifyInfo />}

        <div className="bg-background-one bg-opacity-50 px-md md:px-lg">
          <div className="container flex flex-wrap items-center gap-md py-md">
            <Link href="/hanteraorganisation">
              <Button as="span" variant="primary">
                Lämna utkast
              </Button>
            </Link>
            {!(draftIsApproved || draftIsExportPhase) && user.permissions.canEditDrafts && (
              <Button onClick={onExport} disabled={draft.changes === 0} variant="primary" color="primary">
                Godkänn och exportera
              </Button>
            )}
            {user.permissions.canCommentDraft && (
              <Button
                className="ml-auto"
                onClick={() => setCommentsSidebarOpen(true)}
                variant={showCommentsUnread ? 'primary' : 'secondary'}
                color={showCommentsUnread ? 'warning' : undefined}
                leftIcon={<MessagesSquare />}
              >
                Kommentarer
                {showCommentsUnread && <span className="sr-only">, nya kommentarer</span>}
              </Button>
            )}
          </div>
        </div>
      </div>
      {commentsSidebarOpen && (
        <CommentsSidebar commentsSidebarOpen={commentsSidebarOpen} onClose={() => setCommentsSidebarOpen(false)} />
      )}
    </>
  );
}
