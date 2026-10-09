import { DraftTreeOrganization } from '@interfaces/orgchange';
import { MoveDown, Trash } from 'lucide-react';
import { Button } from '@sk-web-gui/react';
import { useState } from 'react';
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

  return (
    <div className="py-8 px-[1.6rem] bg-background-one">
      {organization.structureChangeStatus !== 'DELETED' ?
        <ul aria-label="Gren-meny" className="lg:flex lg:items-end lg:space-x-lg space-y-sm lg:space-y-0">
          {user.permissions.canEditOrganizationStructure && (
            <li className="mr-auto">
              <Button
                aria-haspopup="true"
                onClick={handleMoveBranch}
                className="text-base text-primary"
                variant="link"
                leftIcon={<MoveDown />}
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
                aria-haspopup="true"
                onClick={onTerminateBranch}
                className="text-base text-red"
                variant="link"
                leftIcon={<Trash />}
              >
                Stäng gren
              </Button>
            </li>
          )}
        </ul>
      : <ul aria-label="Gren-meny" className="lg:flex lg:items-end justify-end lg:space-x-lg space-y-sm lg:space-y-0">
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
