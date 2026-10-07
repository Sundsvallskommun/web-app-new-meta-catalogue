import { Badge, Button, PopupMenu, Icon } from '@sk-web-gui/react';
import { Building, EllipsisVertical, Users } from 'lucide-react';
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
      <PopupMenu type="menu" align="end">
        <PopupMenu.Button
          title={`Redigera anställning${mustEdit ? ', justeringar behövs' : ''}`}
          variant={windowSize.lg ? 'secondary' : 'primary'}
          color={`primary`}
          className="border-0"
          iconButton={windowSize.lg || undefined}
          rightIcon={
            <span className="relative">
              <Icon icon={<EllipsisVertical />} />
              {showFocus && (
                <Badge
                  className="absolute -right-[0.5rem] top-[0.15rem]"
                  size="sm"
                  color={mustEdit ? 'error' : 'vattjom'}
                />
              )}
            </span>
          }
        >
          <span className="lg:hidden">Redigera anställning</span>
        </PopupMenu.Button>
        <PopupMenu.Panel className={className}>
          <PopupMenu.Items>
            <PopupMenu.Item>
              <Button onClick={handleOpenPA} leftIcon={<Users />}>
                <span>Ändra PA-Team {mustEdit && <span className="sr-only">Justeringar behövs</span>}</span>
                {showFocus && !mustEditPaTeam && <Badge className="ml-sm min-h-[12px] min-w-[12px]" color="vattjom" />}
                {mustEditPaTeam && <Badge className="ml-sm min-h-[12px] min-w-[12px]" color="error" />}
              </Button>
            </PopupMenu.Item>
            <PopupMenu.Item>
              <Button onClick={handleOpenOperation} leftIcon={<Building />}>
                <span>Ändra verksamhet {mustEdit && <span className="sr-only">Justeringar behövs</span>}</span>
                {showFocus && !mustEditOperation && (
                  <Badge className="ml-sm min-h-[12px] min-w-[12px]" color="vattjom" />
                )}
                {mustEditOperation && <Badge className="ml-sm min-h-[12px] min-w-[12px]" color="error" />}
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
