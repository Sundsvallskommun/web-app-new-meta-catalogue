import { ChevronDown, ListPlus } from 'lucide-react';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Button, Checkbox, Combobox, PopupMenu } from '@sk-web-gui/react';
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
      <div className="flex flex-wrap items-center gap-8 px-24 pb-20">
        {!draftIsReadOnly && (
          <>
            <Button
              aria-haspopup="true"
              data-cy="orgchange-sidemenu-addnode"
              onClick={!isDraft ? undefined : handleOnChooseOrg}
              aria-disabled={!isDraft ? 'true' : undefined}
              variant="secondary"
              size="sm"
              leftIcon={<ListPlus />}
            >
              Välj gren att ändra
            </Button>
            {user.permissions.canEditOrganizationStructure && <CreateNewBranchFormModal />}
          </>
        )}
        <div className="relative ml-auto">
          <PopupMenu type="dialog" align="end" open={filterOpen} onToggleOpen={setFilterOpen}>
            <PopupMenu.Button
              variant="tertiary"
              size="sm"
              disabled={!isDraft}
              data-cy="orgchange-sidemenu-filter"
              rightIcon={<ChevronDown />}
            >
              Visa/sök
            </PopupMenu.Button>
            <PopupMenu.Panel id="sideMenuSearchFilters">
              <PopupMenu.Items autoFocus={false} aria-label="Ändra sidomenyn">
                {sideMenuShowFilters.map((filter) => (
                  <PopupMenu.Item key={filter.id}>
                    <Checkbox
                      checked={filter.value}
                      disabled={filter.disabled}
                      onChange={() => handleSideMenuShowFilterChange({ ...filter, value: !filter.value })}
                    >
                      {filter.name}
                    </Checkbox>
                  </PopupMenu.Item>
                ))}
              </PopupMenu.Items>
              <div className="p-8">
                <Combobox
                  className="w-full"
                  onChange={(e) => {
                    handleSearchSelect(e);
                    setFilterOpen(false);
                  }}
                >
                  <Combobox.Input className="w-full" aria-label="Sök gren i menyn" placeholder="Sök gren..." />
                  <Combobox.List>
                    {orgTreeOrganizations.map((item, index) => (
                      <Combobox.Option key={`item-${index}`} value={item.id.toString()}>
                        {`${item.label.trim()} - Kod: ${item.responsibilityCode} - Nivå: ${item.level}`}
                      </Combobox.Option>
                    ))}
                  </Combobox.List>
                </Combobox>
              </div>
            </PopupMenu.Panel>
          </PopupMenu>
        </div>
        {isChooseOrgOpen && <ChooseBranchToChangeModal onClose={onCloseHandler} />}
      </div>
    </div>
  );
}
