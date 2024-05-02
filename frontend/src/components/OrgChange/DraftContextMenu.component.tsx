import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ShareIcon from '@mui/icons-material/Share';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, ContextMenu, Divider, cx, useConfirm, useMessage } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import router from 'next/router';
import { useState } from 'react';
import ShareModal from './Draft/Modals/ShareModal.component';
import { Draft } from '@data-contracts/backend/data-contracts';
import ExportInitialOrgStructureModal from './Draft/Modals/ExportInitialOrgStructureModal.component';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface IDraftContextMenu {
  draft?: Draft;
  className?: string;
  /** @default false */
  dense?: boolean;
  /**
   * @default 'left'
   */
  menuSide?: 'left' | 'right';
}

export default function DraftContextmenu(props: IDraftContextMenu) {
  const { draft: _draft, className, dense = false, menuSide } = props;
  const deleteDraft = useOrgChangeStore((s) => s.deleteDraft);
  const draftFromStore = useOrgChangeStore((s) => s.draft);
  const draft = _draft ? _draft : draftFromStore;
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isExportStructureOpen, setIsExportStructureOpen] = useState(false);
  const { draftIsReadOnly } = useDraftPhaseState(draft);

  const { showConfirmation } = useConfirm();

  const message = useMessage();

  const CallDeleteDraft = () => {
    deleteDraft(draft.draftId).then((res) => {
      if (!res.error) {
        message({
          message: `Utkastet ${draft.name} togs bort`,
          status: 'success',
        });
        router.push('/hanteraorganisation');
      } else {
        message({
          message: res.message,
          status: 'error',
        });
      }
    });
  };

  const onDeleteDraft = () => {
    const title = 'Är du säker på att du vill ta bort utkastet?';
    const message = 'Alla ändringar i organisationsstrukturer kommer att försvinna tillsammans med utkastet';
    showConfirmation(title, message, 'Ja, ta bort', 'Avbryt').then((result) => {
      result === true && CallDeleteDraft();
    });
  };

  return (
    <>
      <ContextMenu menuSide={menuSide} classNameItems={cx(className)}>
        {dense ?
          <ContextMenu.Button
            title={`Hantera utkast ${draft.name}`}
            size="fit"
            variant="outline"
            className="border-0"
            iconButton
          >
            <MoreVertIcon />
          </ContextMenu.Button>
        : <ContextMenu.Button size="lg" variant="link" className="text-body" rightIcon={<ExpandMoreIcon />}>
            Hantera utkastet
          </ContextMenu.Button>
        }
        {!draftIsReadOnly ?
          <ContextMenu.Item className="w-full">
            <Button onClick={() => setIsExportStructureOpen(true)} leftIcon={<FileDownloadOutlinedIcon />}>
              Exportera förlaga av organisationer
            </Button>
          </ContextMenu.Item>
        : <></>}

        <ContextMenu.Item>
          <Button onClick={() => setIsShareOpen(true)} leftIcon={<ShareIcon />}>
            Dela
          </Button>
        </ContextMenu.Item>

        {!draftIsReadOnly ?
          <>
            <Divider orientation="horizontal" className="w-full" />
            <ContextMenu.Item>
              <Button aria-haspopup="true" onClick={onDeleteDraft} leftIcon={<DeleteOutlineOutlinedIcon />}>
                Ta bort utkast
              </Button>
            </ContextMenu.Item>
          </>
        : <></>}
      </ContextMenu>
      {isShareOpen && <ShareModal draft={draft} onClose={() => setIsShareOpen(false)} />}
      {isExportStructureOpen && (
        <ExportInitialOrgStructureModal draft={draft} onClose={() => setIsExportStructureOpen(false)} />
      )}
    </>
  );
}
