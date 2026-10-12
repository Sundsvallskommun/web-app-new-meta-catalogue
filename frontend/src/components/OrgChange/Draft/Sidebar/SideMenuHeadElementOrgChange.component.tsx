import { ChevronDown, ListPlus } from 'lucide-react';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, Combobox, Filter, PopupMenu } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useState } from 'react';
import ChooseBranchToChangeModal from './Modals/ChooseBranchToChangeModal.component';
import CreateNewBranchFormModal from './Modals/CreateNewBranchFormModal.component';
import { IFilterDataMenu } from '@interfaces/organization';
import { useUserStore } from '@services/user-service/user-service';

export default function SideMenuHeadElementOrgChange() {
  const sideMenuShowFilters = useOrgChangeStore((s) => s.sideMenuShowFilters);
  const setSideMenuShowFilters = useOrgChangeStore((s) => s.setSideMenuShowFilters);
  const orgTreeOrganizations = useOrgChangeStore((s) => s.orgTreeOrganizations);
  const isDraft = useOrgChangeStore((s) => s.isDraft);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const { draftIsReadOnly } = useDraftPhaseState();
  const [isChooseOrgOpen, setIsChooseOrgOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const user = useUserStore((s) => s.user);

  const handleSideMenuShowFilterChange = (filter: IFilterDataMenu) => {
    const newFilters = sideMenuShowFilters.map((x: IFilterDataMenu) =>
      x.id == filter.id ? { ...x, value: filter.value } : x
    );
    setSideMenuShowFilters(newFilters);
  };

  const handleSearchSelect = (e) => {
    const val = e.target.value;
    setSelectedOrganizationId(parseInt(val));
  };

  const handleOnChooseOrg = () => {
    setIsChooseOrgOpen(true);
  };

  const onCloseHandler = () => {
    setIsChooseOrgOpen(false);
  };

  return (
    <div className="z-10 relative">
      <div className="flex flex-col lg:flex-row space-y-md lg:space-y-0 lg:justify-between py-20 px-md box-content">
        {!draftIsReadOnly && (
          <>
            <Button
              aria-haspopup="true"
              data-cy="orgchange-sidemenu-addnode"
              onClick={!isDraft ? undefined : handleOnChooseOrg}
              aria-disabled={!isDraft ? 'true' : undefined}
              variant="link"
              className="flex hover:no-underline"
              leftIcon={<ListPlus />}
            >
              Välj gren att ändra
            </Button>
            {user.permissions.canEditOrganizationStructure && <CreateNewBranchFormModal />}
          </>
        )}
        <div className="relative">
          <PopupMenu type="dialog" align="end" open={filterOpen} onToggleOpen={setFilterOpen}>
            <PopupMenu.Button
              variant="ghost"
              size="sm"
              disabled={!isDraft}
              data-cy="orgchange-sidemenu-filter"
              rightIcon={<ChevronDown />}
            >
              Visa/sök
            </PopupMenu.Button>
            <PopupMenu.Panel id="sideMenuSearchFilters">
              <Filter>
                <Filter.Label className="sr-only">Ändra sidomenyn</Filter.Label>
                {sideMenuShowFilters.map((filter) => (
                  <Filter.Item
                    key={filter.id}
                    checked={filter.value}
                    disabled={filter.disabled}
                    onChange={() => handleSideMenuShowFilterChange({ ...filter, value: !filter.value })}
                  >
                    {filter.name}
                  </Filter.Item>
                ))}
              </Filter>
              <Combobox
                className="w-full"
                aria-label="Sök gren i menyn"
                placeholder="Sök gren.."
                onChange={(e) => {
                  handleSearchSelect(e);
                  setFilterOpen(false);
                }}
              >
                <Combobox.List>
                  {orgTreeOrganizations.map((item, index) => (
                    <Combobox.Option key={`item-${index}`} value={item.id.toString()}>
                      {`${item.label.trim()} - Kod: ${item.responsibilityCode} - Nivå: ${item.level}`}
                    </Combobox.Option>
                  ))}
                </Combobox.List>
              </Combobox>
            </PopupMenu.Panel>
          </PopupMenu>
        </div>
        {isChooseOrgOpen && <ChooseBranchToChangeModal onClose={onCloseHandler} />}
      </div>
    </div>
  );
}
