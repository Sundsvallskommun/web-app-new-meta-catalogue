import { Badge, Button, ContextMenu } from '@sk-web-gui/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
import { shouldEditEmployment } from '@utils/shouldeditemployment';
import { useEffect, useState } from 'react';
import ChangePaTeamModal from '@components/OrgChange/Draft/Modals/ChangePaTeamModal.component';
import ChangeOperationModal from '@components/OrgChange/Draft/Modals/ChangeOperationModal.component';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { OrgChangeEmployment, OrgChangePersonEmployeeDetail } from '@data-contracts/backend/data-contracts';
import { useWindowSize } from '@utils/use-window-size.hook';
import ChangeObjectModal from '@components/OrgChange/Draft/Modals/ChangeObjectModal.component';
import ChangeActivityModal from '@components/OrgChange/Draft/Modals/ChangeActivityModal.component';
import ChangeProjectModal from '@components/OrgChange/Draft/Modals/ChangeProjectModal.component';

interface EmploymentContextMenuProps {
  employeeDetails: OrgChangePersonEmployeeDetail;
  selectedEmploymentDetails: OrgChangeEmployment;
  className?: string;
}

export default function EmploymentContextMenu({
  className = '',
  employeeDetails,
  selectedEmploymentDetails,
}: EmploymentContextMenuProps) {
  const { showFocus, mustEditOperation, mustEditPaTeam, mustEdit } = shouldEditEmployment(selectedEmploymentDetails);
  const [employmentEditPaTeamIsOpen, setEmploymentEditPaTeamIsOpen] = useState(false);
  const [employmentEditOperationIsOpen, setEmploymentEditOperationIsOpen] = useState(false);
  const [employmentEditObjectIsOpen, setEmploymentEditObjectIsOpen] = useState(false);
  const [employmentEditActivityIsOpen, setEmploymentEditActivityIsOpen] = useState(false);
  const [employmentEditProjectIsOpen, setEmploymentEditProjectIsOpen] = useState(false);

  const employeesByOrg = useOrgChangeStore((s) => s.employeesByOrg);
  const [employee, setEmployee] = useState(employeesByOrg.find((x) => x.personId === employeeDetails.personId));
  const windowSize = useWindowSize();

  const handleOpenPA = () => {
    setEmploymentEditPaTeamIsOpen(true);
  };

  const handleOpenOperation = () => {
    setEmploymentEditOperationIsOpen(true);
  };

  useEffect(() => {
    setEmployee(employeesByOrg.find((x) => x.personId === employeeDetails.personId));
  }, [employeeDetails, employeesByOrg]);

  return (
    <>
      <ContextMenu classNameItems={`${className} right-0`}>
        <ContextMenu.Button
          title={`Redigera anställning${mustEdit ? ', justeringar behövs' : ''}`}
          variant={windowSize.lg ? 'outline' : 'solid'}
          color={`primary`}
          className="border-0"
          iconButton={windowSize.lg || undefined}
          rightIcon={
            <span className="relative">
              <MoreVertIcon />
              {showFocus && (
                <Badge
                  className="absolute -right-[0.5rem] top-[0.15rem]"
                  size="sm"
                  variant="solid"
                  color={mustEdit ? 'error' : 'primary'}
                  position={'super-overlap'}
                />
              )}
            </span>
          }
        >
          <span className="lg:hidden">Redigera anställning</span>
        </ContextMenu.Button>
        <ContextMenu.Item>
          <Button onClick={handleOpenPA} leftIcon={<PeopleOutlineOutlinedIcon />}>
            <span>Ändra PA-Team {mustEdit && <span className="sr-only">Justeringar behövs</span>}</span>
            {showFocus && !mustEditPaTeam && (
              <Badge className="ml-sm min-h-[12px] min-w-[12px]" variant="solid" color="primary" />
            )}
            {mustEditPaTeam && <Badge className="ml-sm min-h-[12px] min-w-[12px]" variant="solid" color="error" />}
          </Button>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <Button onClick={handleOpenOperation} leftIcon={<DomainOutlinedIcon />}>
            <span>Ändra verksamhet {mustEdit && <span className="sr-only">Justeringar behövs</span>}</span>
            {showFocus && !mustEditOperation && (
              <Badge className="ml-sm min-h-[12px] min-w-[12px]" variant="solid" color="primary" />
            )}
            {mustEditOperation && <Badge className="ml-sm min-h-[12px] min-w-[12px]" variant="solid" color="error" />}
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
      {employmentEditPaTeamIsOpen && (
        <ChangePaTeamModal peopleToHandle={[employee]} closeCallback={() => setEmploymentEditPaTeamIsOpen(false)} />
      )}
      {employmentEditOperationIsOpen && (
        <ChangeOperationModal
          peopleToHandle={[employee]}
          closeCallback={() => setEmploymentEditOperationIsOpen(false)}
        />
      )}

      {employmentEditObjectIsOpen && (
        <ChangeObjectModal peopleToHandle={[employee]} closeCallback={() => setEmploymentEditObjectIsOpen(false)} />
      )}
      {employmentEditActivityIsOpen && (
        <ChangeActivityModal peopleToHandle={[employee]} closeCallback={() => setEmploymentEditActivityIsOpen(false)} />
      )}
      {employmentEditProjectIsOpen && (
        <ChangeProjectModal peopleToHandle={[employee]} closeCallback={() => setEmploymentEditProjectIsOpen(false)} />
      )}
    </>
  );
}
