import { IFilterDataMenu } from '@interfaces/organization';
import { ChevronDown } from 'lucide-react';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { Checkbox, Combobox, FormControl, FormLabel, PopupMenu, Select } from '@sk-web-gui/react';
import { useState } from 'react';

interface TreeImage {
  id: number;
  imageName: string;
}

const treeImages: TreeImage[] = [
  {
    id: 0,
    imageName: 'Masterdata',
  },
  {
    id: 1,
    imageName: 'HR',
  },
  {
    id: 2,
    imageName: 'Ekonomi',
  },
];

export default function SideMenuHeadElement() {
  // use same filter storage as orgchange
  const sideMenuShowFilters = useOrgChangeStore((s) => s.sideMenuShowFilters);
  const setSideMenuShowFilters = useOrgChangeStore((s) => s.setSideMenuShowFilters);

  const orgTreeOrganizations = useOrganizationStore((s) => s.orgTreeOrganizations);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const setSelectedCompanyOrgId = useOrganizationStore((s) => s.setSelectedCompanyOrgId);
  const setTreeImageId = useOrganizationStore((s) => s.setTreeImageId);
  const treeImageId = useOrganizationStore((s) => s.treeImageId);
  const selectedCompanyOrgId = useOrganizationStore((s) => s.selectedCompanyOrgId);
  const treeImage = useOrganizationStore((s) => s.treeImage);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTreeImage, setSelectedTreeImage] = useState<TreeImage>(treeImages[treeImageId]);

  const user = useUserStore((s) => s.user);

  const sideMenuShowFiltersFiltered = sideMenuShowFilters.filter((x) => {
    if (x.propertyName == 'abbreviation' || !x.isShown) return false;
    if (x.propertyName === 'responsibilityCode') {
      if (!user.permissions.canViewDrafts) return false;
    }
    return true;
  });

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

  /**
   * Sets the treeImageId
   */
  const onTreeImageChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = parseInt(e.target.value);
    setTreeImageId(value);
    setSelectedTreeImage(treeImages.find((x) => x.id === value));
  };

  const onCompanyChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = parseInt(e.target.value);
    setSelectedCompanyOrgId(value);
  };

  return (
    <div className="z-10 relative px-24">
      <form>
        <div className="flex flex-col gap-md mb-xl">
          <FormControl id="sidemenu-image" className="w-full">
            <FormLabel>Avbildning</FormLabel>
            <Select
              size="md"
              className="w-full"
              id="sidemenu-image"
              name="sidemenu-image"
              aria-labelledby="sidemenu-image-label"
              onChange={onTreeImageChange}
              value={selectedTreeImage?.id.toString() ?? undefined}
            >
              {treeImages.map((c) => (
                <Select.Option key={`${c.id}`} value={c.id}>
                  {c.imageName}
                </Select.Option>
              ))}
            </Select>
          </FormControl>
          <FormControl id="sidemenu-company" className="w-full">
            <FormLabel>Bolag</FormLabel>
            <Select
              size="md"
              className="w-full"
              id="sidemenu-company"
              name="sidemenu-company"
              onChange={onCompanyChange}
              value={selectedCompanyOrgId?.toString() ?? ''}
            >
              {treeImage?.map((c) => (
                <Select.Option key={`${c.orgName}`} value={c.id}>
                  {c.orgName}
                </Select.Option>
              )) || []}
            </Select>
          </FormControl>
        </div>
      </form>
      <div className="flex items-center justify-between">
        <h2 className="text-h4">Organisation</h2>
        <div className="relative">
          <PopupMenu type="dialog" align="end" open={filterOpen} onToggleOpen={setFilterOpen}>
            <PopupMenu.Button
              variant="tertiary"
              size="sm"
              data-cy="orgchange-sidemenu-filter"
              rightIcon={<ChevronDown />}
            >
              {user.permissions.canViewDrafts ? 'Visa/sök' : 'Sök'}
            </PopupMenu.Button>
            <PopupMenu.Panel id="sideMenuSearchFilters">
              {user.permissions.canViewDrafts && (
                <PopupMenu.Items autoFocus={false} aria-label="Ändra sidomenyn">
                  {sideMenuShowFiltersFiltered.map((filter) => (
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
              )}
              <div className="p-8">
                <Combobox
                  className="w-full"
                  onChange={(e) => {
                    handleSearchSelect(e);
                    setFilterOpen(false);
                  }}
                >
                  <Combobox.Input className="w-full" aria-label="Sök gren i menyn" placeholder="Sök gren" />
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
      </div>
    </div>
  );
}
