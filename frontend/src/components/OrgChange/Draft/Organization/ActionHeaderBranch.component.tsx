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
    <div className="bg-vattjom-background-100 p-24 rounded-t-cards">
      {organization.structureChangeStatus !== 'DELETED' ?
        <ul aria-label="Gren-meny" className="flex flex-wrap items-center gap-8">
          {user.permissions.canEditOrganizationStructure && (
            <li className="mr-auto">
              <Button
                aria-haspopup="true"
                onClick={handleMoveBranch}
                variant="secondary"
                size="sm"
                leftIcon={<MoveDown />}
              >
                Flytta gren
              </Button>
            </li>
          )}
          <li>
            <ul className="flex flex-wrap items-center gap-8">
              <li>
                <RemoveBranchFromDraft organization={organization} />
              </li>
              {organization.structureChangeStatus !== 'NEW' && user.permissions.canEditOrganizationStructure && (
                <li>
                  <Button
                    aria-haspopup="true"
                    onClick={onTerminateBranch}
                    color="error"
                    variant="primary"
                    inverted
                    size="sm"
                    leftIcon={<Trash />}
                  >
                    Stäng gren
                  </Button>
                </li>
              )}
            </ul>
          </li>
        </ul>
      : <ul aria-label="Gren-meny" className="flex flex-wrap items-center justify-end gap-8">
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
