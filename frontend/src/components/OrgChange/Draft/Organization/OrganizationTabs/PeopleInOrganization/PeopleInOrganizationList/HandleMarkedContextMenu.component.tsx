import { Button, ContextMenu } from '@sk-web-gui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
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
      <ContextMenu classNameItems={`${className} right-0`}>
        <ContextMenu.Button
          rightIcon={<ExpandMoreIcon />}
          disabled={peopleToHandle.length < 1}
          variant="outline"
          className="border-0 mr-sm mb-xs"
        >
          <span className={`${peopleToHandle.length < 1 && 'text-gray-500'} h-full w-full`}>Hantera Markerade</span>
        </ContextMenu.Button>
        <ContextMenu.Item>
          <Button
            id="move-people-button"
            onClick={() => setEmploymentMovePeopleIsOpen(true)}
            leftIcon={<PersonPinCircleOutlinedIcon />}
          >
            <span>Flytta markerade till annan gren</span>
          </Button>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <Button onClick={() => setEmploymentEditPaTeamIsOpen(true)} leftIcon={<PeopleOutlineOutlinedIcon />}>
            <span>Ändra PA-Team</span>
          </Button>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <Button onClick={() => setEmploymentEditOperationIsOpen(true)} leftIcon={<DomainOutlinedIcon />}>
            <span>Ändra verksamhet</span>
          </Button>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <Button onClick={() => setEmploymentEditObjectIsOpen(true)} leftIcon={<DomainOutlinedIcon />}>
            <span>Ändra objekt</span>
          </Button>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <Button onClick={() => setEmploymentEditActivityIsOpen(true)} leftIcon={<DomainOutlinedIcon />}>
            <span>Ändra aktivitet</span>
          </Button>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <Button onClick={() => setEmploymentEditProjectIsOpen(true)} leftIcon={<DomainOutlinedIcon />}>
            <span>Ändra projekt</span>
          </Button>
        </ContextMenu.Item>
      </ContextMenu>
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
