import { ChevronDown, Download, EllipsisVertical, Share2, Trash } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, PopupMenu, cx, useConfirm, useSnackbar, Icon } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import router from 'next/router';
import { useState } from 'react';
import ShareModal from './Draft/Modals/ShareModal.component';
import { Draft } from '@data-contracts/backend/data-contracts';
import ExportInitialOrgStructureModal from './Draft/Modals/ExportInitialOrgStructureModal.component';
import { useUserStore } from '@services/user-service/user-service';

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
  const user = useUserStore((s) => s.user);

  const { showConfirmation } = useConfirm();

  const message = useSnackbar();

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
      if (result === true) {
        CallDeleteDraft();
      }
    });
  };

  return (
    <>
      <PopupMenu type="menu" align={menuSide === 'right' ? 'start' : 'end'}>
        {dense ?
          <PopupMenu.Button title={`Hantera utkast ${draft.name}`} variant="secondary" className="border-0" iconButton>
            <Icon icon={<EllipsisVertical />} />
          </PopupMenu.Button>
        : <PopupMenu.Button size="lg" variant="link" className="text-body" rightIcon={<ChevronDown />}>
            Hantera utkastet
          </PopupMenu.Button>
        }
        <PopupMenu.Panel className={cx(className)}>
          <PopupMenu.Items>
            <PopupMenu.Group>
              {!draftIsReadOnly && (
                <PopupMenu.Item>
                  <Button onClick={() => setIsExportStructureOpen(true)} leftIcon={<Download />}>
                    Exportera förlaga av organisationer
                  </Button>
                </PopupMenu.Item>
              )}
              <PopupMenu.Item>
                <Button onClick={() => setIsShareOpen(true)} leftIcon={<Share2 />}>
                  Dela
                </Button>
              </PopupMenu.Item>
            </PopupMenu.Group>
            {!draftIsReadOnly && user.permissions.canEditDrafts && (
              <PopupMenu.Group>
                <PopupMenu.Item>
                  <Button aria-haspopup="true" onClick={onDeleteDraft} leftIcon={<Trash />}>
                    Ta bort utkast
                  </Button>
                </PopupMenu.Item>
              </PopupMenu.Group>
            )}
          </PopupMenu.Items>
        </PopupMenu.Panel>
      </PopupMenu>
      {isShareOpen && <ShareModal draft={draft} onClose={() => setIsShareOpen(false)} />}
      {isExportStructureOpen && (
        <ExportInitialOrgStructureModal draft={draft} onClose={() => setIsExportStructureOpen(false)} />
      )}
    </>
  );
}
