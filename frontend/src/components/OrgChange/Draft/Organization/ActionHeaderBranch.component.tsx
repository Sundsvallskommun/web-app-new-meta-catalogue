import { DraftTreeOrganization } from '@interfaces/orgchange';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MoveDownOutlinedIcon from '@mui/icons-material/MoveDownOutlined';
import { Button } from '@sk-web-gui/react';
import { useAriaKeyboard } from '@utils/use-ariakeyboard';
import { useRef, useState } from 'react';
import MoveFormModal from '../Modals/MoveFormModal.component';
import RemoveBranchFromDraft from '../Modals/RemoveBranchFromDraftModal.component';
import TerminateNode from '../Modals/TerminateNodeModal.component';
import UndoTerminatedNode from '../Modals/UndoTerminatedNode.component';
import { useUserStore } from '@services/user-service/user-service';

export default function ActionHeaderBranch(props: { organization: DraftTreeOrganization }) {
  const { organization } = props;

  const [isMoveBranchOpen, setIsMoveBranchOpen] = useState(false);
  const [isTerminateOpen, setIsTerminateOpen] = useState(false);
  const [activeOrganization, setActiveOrganization] = useState<
    { label: string; data: DraftTreeOrganization } | undefined
  >();
  const user = useUserStore((s) => s.user);

  const actionHeaderRef = useRef(null);

  const handleMoveBranch = () => {
    setIsMoveBranchOpen(true);
  };

  const onTerminateBranch = () => {
    setIsTerminateOpen(true);
  };

  const onCloseHandler = () => {
    setIsMoveBranchOpen(false);
    setIsTerminateOpen(false);
  };

  useAriaKeyboard(actionHeaderRef);

  return (
    <div className="py-8 px-[1.6rem] bg-background-one">
      {organization.structureChangeStatus !== 'DELETED' ?
        <ul
          ref={actionHeaderRef}
          role="menubar"
          aria-orientation="horizontal"
          aria-label="Gren-meny"
          className="lg:flex lg:items-end lg:space-x-lg space-y-sm lg:space-y-0"
        >
          {user.permissions.canEditOrganizationStructure && (
            <li className="mr-auto">
              <Button
                role="menuitem"
                aria-haspopup="true"
                onClick={handleMoveBranch}
                className="text-base text-primary"
                variant="link"
                leftIcon={<MoveDownOutlinedIcon className="!text-2xl mr-sm" />}
              >
                Flytta gren
              </Button>
            </li>
          )}
          <li>
            <RemoveBranchFromDraft organization={organization} />
          </li>
          {organization.structureChangeStatus !== 'NEW' && user.permissions.canEditOrganizationStructure && (
            <li>
              <Button
                role="menuitem"
                aria-haspopup="true"
                onClick={onTerminateBranch}
                className="text-base text-red"
                variant="link"
                leftIcon={<DeleteOutlineOutlinedIcon className="!text-2xl mr-sm" />}
              >
                Stäng gren
              </Button>
            </li>
          )}
        </ul>
      : <ul
          ref={actionHeaderRef}
          role="menubar"
          aria-orientation="horizontal"
          aria-label="Gren-meny"
          className="lg:flex lg:items-end justify-end lg:space-x-lg space-y-sm lg:space-y-0"
        >
          <li>
            <UndoTerminatedNode />
          </li>
        </ul>
      }

      {isMoveBranchOpen && (
        <MoveFormModal
          onClose={onCloseHandler}
          moveBranch={isMoveBranchOpen}
          organization={organization}
          buttonName={isMoveBranchOpen && 'Flytta gren'}
          activeOrganization={activeOrganization}
          setActiveOrganization={setActiveOrganization}
        />
      )}
      {isTerminateOpen && <TerminateNode onClose={onCloseHandler} />}
    </div>
  );
}
