import { Button, PopupMenu } from '@sk-web-gui/react';
import { Building, ChevronDown, MapPinCheck, Users } from 'lucide-react';
import MovePeopleModal from '@components/OrgChange/Draft/Modals/MovePeopleModal.component';
import { useUserStore } from '@services/user-service/user-service';
import ChangePaTeamModal from '@components/OrgChange/Draft/Modals/ChangePaTeamModal.component';
import ChangeOperationModal from '@components/OrgChange/Draft/Modals/ChangeOperationModal.component';
import { useState } from 'react';
import { OrgChangeOrganizationEmployee } from '@data-contracts/backend/data-contracts';
import ChangeObjectModal from '@components/OrgChange/Draft/Modals/ChangeObjectModal.component';
import ChangeProjectModal from '@components/OrgChange/Draft/Modals/ChangeProjectModal.component';
import ChangeActivityModal from '@components/OrgChange/Draft/Modals/ChangeActivityModal.component';

interface HandleMarkedContextMenuProps {
  peopleToHandle: OrgChangeOrganizationEmployee[];
  className?: string;
}

export default function HandleMarkedContextMenu({ peopleToHandle, className = '' }: HandleMarkedContextMenuProps) {
  const user = useUserStore((s) => s.user);
  const [employmentMovePeopleIsOpen, setEmploymentMovePeopleIsOpen] = useState(false);
  const [employmentEditPaTeamIsOpen, setEmploymentEditPaTeamIsOpen] = useState(false);
  const [employmentEditOperationIsOpen, setEmploymentEditOperationIsOpen] = useState(false);
  const [employmentEditObjectIsOpen, setEmploymentEditObjectIsOpen] = useState(false);
  const [employmentEditActivityIsOpen, setEmploymentEditActivityIsOpen] = useState(false);
  const [employmentEditProjectIsOpen, setEmploymentEditProjectIsOpen] = useState(false);

  return (
    <>
      <PopupMenu type="menu" align="end">
        <PopupMenu.Button
          rightIcon={<ChevronDown />}
          disabled={peopleToHandle.length < 1}
          variant="secondary"
          className="border-0 mr-sm mb-xs"
        >
          <span className={`${peopleToHandle.length < 1 && 'text-dark-secondary'} h-full w-full`}>
            Hantera Markerade
          </span>
        </PopupMenu.Button>
        <PopupMenu.Panel className={className}>
          <PopupMenu.Items>
            <PopupMenu.Item>
              <Button
                id="move-people-button"
                onClick={() => setEmploymentMovePeopleIsOpen(true)}
                leftIcon={<MapPinCheck />}
              >
                <span>Flytta markerade till annan gren</span>
              </Button>
            </PopupMenu.Item>
            <PopupMenu.Item>
              <Button onClick={() => setEmploymentEditPaTeamIsOpen(true)} leftIcon={<Users />}>
                <span>Ändra PA-Team</span>
              </Button>
            </PopupMenu.Item>
            <PopupMenu.Item>
              <Button onClick={() => setEmploymentEditOperationIsOpen(true)} leftIcon={<Building />}>
                <span>Ändra verksamhet</span>
              </Button>
            </PopupMenu.Item>
            <PopupMenu.Item>
              <Button onClick={() => setEmploymentEditObjectIsOpen(true)} leftIcon={<Building />}>
                <span>Ändra objekt</span>
              </Button>
            </PopupMenu.Item>
            <PopupMenu.Item>
              <Button onClick={() => setEmploymentEditActivityIsOpen(true)} leftIcon={<Building />}>
                <span>Ändra aktivitet</span>
              </Button>
            </PopupMenu.Item>
            <PopupMenu.Item>
              <Button onClick={() => setEmploymentEditProjectIsOpen(true)} leftIcon={<Building />}>
                <span>Ändra projekt</span>
              </Button>
            </PopupMenu.Item>
          </PopupMenu.Items>
        </PopupMenu.Panel>
      </PopupMenu>
      {employmentMovePeopleIsOpen && user.permissions.canEditOrganization && (
        <MovePeopleModal peopleToHandle={peopleToHandle} closeCallback={() => setEmploymentMovePeopleIsOpen(false)} />
      )}
      {employmentEditPaTeamIsOpen && peopleToHandle.length && (
        <ChangePaTeamModal peopleToHandle={peopleToHandle} closeCallback={() => setEmploymentEditPaTeamIsOpen(false)} />
      )}
      {employmentEditOperationIsOpen && peopleToHandle.length && (
        <ChangeOperationModal
          peopleToHandle={peopleToHandle}
          closeCallback={() => setEmploymentEditOperationIsOpen(false)}
        />
      )}

      {employmentEditObjectIsOpen && peopleToHandle.length && (
        <ChangeObjectModal peopleToHandle={peopleToHandle} closeCallback={() => setEmploymentEditObjectIsOpen(false)} />
      )}
      {employmentEditActivityIsOpen && peopleToHandle.length && (
        <ChangeActivityModal
          peopleToHandle={peopleToHandle}
          closeCallback={() => setEmploymentEditActivityIsOpen(false)}
        />
      )}
      {employmentEditProjectIsOpen && peopleToHandle.length && (
        <ChangeProjectModal
          peopleToHandle={peopleToHandle}
          closeCallback={() => setEmploymentEditProjectIsOpen(false)}
        />
      )}
    </>
  );
}
