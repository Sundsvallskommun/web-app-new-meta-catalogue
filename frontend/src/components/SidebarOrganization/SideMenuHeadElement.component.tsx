import { Popover } from '@headlessui/react';
import { IFilterDataMenu } from '@interfaces/organization';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { Combobox, Select } from '@sk-web-gui/forms';
import { FilterItem, FormControl, FormLabel, IFilterData, Link } from '@sk-web-gui/react';
import { useAriaKeyboard } from '@utils/use-ariakeyboard';
import { Fragment, useEffect, useRef, useState } from 'react';
import Sticky from 'react-sticky-el';

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
  const initialFocus = useRef(null);
  const sidemenuHeadMenuRef = useRef(null);
  const panelRef = useRef(null);
  const [selectedTreeImage, setSelectedTreeImage] = useState<TreeImage>(treeImages[treeImageId]);

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

  const setInitialFocus = () => {
    setTimeout(() => {
      initialFocus.current && initialFocus.current.focus();
    });
  };

  const handleFilterMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      setFilterOpen(() => true);
    } else if (e.code === 'Tab') {
      setFilterOpen(() => false);
    } else if (e.code === 'Escape') {
      setFilterOpen(() => false);
    } else if (e.code === 'Space' || e.code === 'Enter') {
      setFilterOpen((open) => !open);
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      setFilterOpen(() => false);
    }
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

  useEffect(() => {
    if (filterOpen) {
      setInitialFocus();
    }
  }, [filterOpen]);

  useEffect(() => {
    const onClickHandler = (e: MouseEvent) => {
      if (filterOpen && !panelRef.current?.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) {
      window.addEventListener('click', onClickHandler);
    }
    return () => {
      window.removeEventListener('click', onClickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOpen, panelRef?.current]);

  useAriaKeyboard(sidemenuHeadMenuRef);
  console.log('orgTreeOrganizations', orgTreeOrganizations);
  return (
    <Sticky
      mode="top"
      wrapperClassName="z-10 relative bg-primary px-md pt-md"
      scrollElement="aside.SidebarOrganization"
      hideOnBoundaryHit={false}
    >
      <form>
        <div className="mb-md">
          <FormControl id="sidemenu-image">
            <FormLabel className="label-small">
              <strong>Avbildning</strong>
            </FormLabel>
            <Select
              size="md"
              className="w-full mt-[6px] focus-visible:!ring-black focus-visible:!ring-4"
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
          <FormControl className="my-[20px]" id="sidemenu-company">
            <FormLabel className="label-small">
              <strong>Bolag</strong>
            </FormLabel>
            <Select
              size="md"
              className="w-full mt-[6px] focus-visible:!ring-black focus-visible:!ring-4"
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
        <h2>Organisation</h2>
        <ul
          ref={sidemenuHeadMenuRef}
          role="menubar"
          aria-orientation="horizontal"
          aria-label="Sidmeny-controller"
          className={`flex flex-col lg:flex-row space-y-md lg:space-y-0 lg:justify-between py-8 px-md -mr-md box-content 
       [&>li>*:focus-visible]:ring-white [&>li>*:focus-visible]:outline-white`}
        >
          <Popover as={Fragment}>
            {({ close }) => (
              <li>
                <Popover.Button
                  role="menuitem"
                  className="link focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none"
                  aria-haspopup="true"
                  data-cy="orgchange-sidemenu-filter"
                  onKeyDown={(e) => {
                    handleFilterMenuKeyDown(e);
                    filterOpen && close();
                  }}
                  onClick={() => setFilterOpen((open) => !open)}
                >
                  <Link as="span" className="text-white hover:text-white hover:no-underline">
                    Visa/sök
                    <ArrowDropDownOutlinedIcon
                      className={`!text-2xl !ml-[4px] ${filterOpen ? 'rotate-180 transform' : ''}`}
                    />
                  </Link>
                </Popover.Button>
                {filterOpen && (
                  <Popover.Panel
                    ref={panelRef}
                    static
                    id="sideMenuSearchFilters"
                    className="absolute left-0 right-0 z-10 mt-[2.1rem] rounded-[.2rem] p-md bg-primary text-white"
                  >
                    <ul aria-label="Sökfilter" role="menu" aria-orientation="vertical">
                      <li>
                        <div className="dropdown-filter" style={{ all: 'unset' }}>
                          <ul
                            aria-label="Ändra sidomenyn"
                            role="listbox"
                            aria-orientation="vertical"
                            className="filter-container [&>.filter-item]:!border-primary-active [&>.filter-item]:!px-0"
                            style={{ all: 'unset' }}
                          >
                            {sideMenuShowFilters.map((filter: IFilterData, i) => (
                              <FilterItem
                                key={`${filter.id}`}
                                className={`!border-t-0 select-none [&>label>.form-checkbox-label]:text-white [&.disabled>label>.form-checkbox-label]:text-svartvik-100 [&>label>input]:bg-white [&>label>input:focus-within]:outline-none ${
                                  filter.disabled ? '!disabled' : ''
                                } ${i == sideMenuShowFilters.length - 1 ? '!border-b !border-solid' : ''}`}
                                item={filter}
                                itemChange={handleSideMenuShowFilterChange}
                                size={'sm'}
                              />
                            ))}
                          </ul>
                        </div>
                      </li>
                      <li
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.code === 'Tab' && !e.shiftKey) {
                            e.target.dispatchEvent(
                              new KeyboardEvent('keydown', {
                                key: 'Tab',
                              })
                            );
                            setTimeout(() => {
                              setFilterOpen(false);
                            });
                          }
                        }}
                      >
                        <Combobox
                          ref={initialFocus}
                          className="w-full"
                          aria-label="Sök gren i menyn"
                          placeholder="Sök gren.."
                          onChange={(e) => {
                            handleSearchSelect(e);
                            close();
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
                      </li>
                    </ul>
                  </Popover.Panel>
                )}
              </li>
            )}
          </Popover>
        </ul>
      </div>
    </Sticky>
  );
}
