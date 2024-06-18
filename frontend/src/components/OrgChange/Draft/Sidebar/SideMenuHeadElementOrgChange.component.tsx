import { Popover } from '@headlessui/react';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import InsertToList from '@public/svg/InsertToList.svg';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Combobox } from '@sk-web-gui/forms';
import { Button, FilterItem, IFilterData, Link } from '@sk-web-gui/react';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useAriaKeyboard } from '@utils/use-ariakeyboard';
import Image from 'next/image';
import { Fragment, useEffect, useRef, useState } from 'react';
import Sticky from 'react-sticky-el';
import ChooseBranchToChangeModal from './Modals/ChooseBranchToChangeModal.component';
import CreateNewBranchFormModal from './Modals/CreateNewBranchFormModal.component';
import { IFilterDataMenu } from '@interfaces/organization';

export default function SideMenuHeadElementOrgChange() {
  const sideMenuShowFilters = useOrgChangeStore((s) => s.sideMenuShowFilters);
  const setSideMenuShowFilters = useOrgChangeStore((s) => s.setSideMenuShowFilters);
  const orgTreeOrganizations = useOrgChangeStore((s) => s.orgTreeOrganizations);
  const isDraft = useOrgChangeStore((s) => s.isDraft);
  const draft = useOrgChangeStore((s) => s.draft);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const { draftIsReadOnly } = useDraftPhaseState();
  const [isChooseOrgOpen, setIsChooseOrgOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const initialFocus = useRef(null);
  const sidemenuHeadMenuRef = useRef(null);
  const panelRef = useRef(null);

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

  const setInitialFocus = () => {
    setTimeout(() => {
      initialFocus.current && initialFocus.current.focus();
    });
  };

  const handleFilterMenuKeyDown = (e: React.KeyboardEvent) => {
    if (isDraft) {
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
    }
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

  return (
    <Sticky
      mode="top"
      wrapperClassName="z-10 relative bg-primary"
      scrollElement="aside.SidebarOrganization"
      hideOnBoundaryHit={false}
    >
      <ul
        ref={sidemenuHeadMenuRef}
        role="menubar"
        aria-orientation="horizontal"
        aria-label="Sidmeny-controller"
        className={`flex flex-col lg:flex-row space-y-md lg:space-y-0 lg:justify-between py-8 px-md box-content 
       [&>li>*:focus-visible]:ring-white [&>li>*:focus-visible]:outline-white`}
      >
        {!draftIsReadOnly && (
          <>
            <li>
              <Button
                role="menuitem"
                aria-haspopup="true"
                data-cy="orgchange-sidemenu-addnode"
                onClick={!isDraft ? undefined : handleOnChooseOrg}
                aria-disabled={!isDraft ? 'true' : undefined}
                variant="link"
                className="flex text-white hover:text-white hover:no-underline "
                leftIcon={
                  <Image width={24} height={24} src={InsertToList} alt="" aria-hidden="true" className="mr-[4px]" />
                }
              >
                Välj gren att ändra
              </Button>
            </li>
            <li>
              <CreateNewBranchFormModal />
            </li>
          </>
        )}
        <Popover as={Fragment}>
          {({ close }) => (
            <li>
              <Popover.Button
                role="menuitem"
                className="link focus-visible:ring-4 focus-visible:ring-white focus-visible:outline-none"
                aria-disabled={!isDraft ? 'true' : undefined}
                aria-haspopup="true"
                data-cy="orgchange-sidemenu-filter"
                onKeyDown={(e) => {
                  handleFilterMenuKeyDown(e);
                  filterOpen && close();
                }}
                onClick={() => (!isDraft ? undefined : setFilterOpen((open) => !open))}
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
                  className="absolute z-10 mt-[2.1rem] rounded-[.2rem] right-0 p-md bg-primary text-white w-full"
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
                        if (draft) {
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
        {isChooseOrgOpen && <ChooseBranchToChangeModal onClose={onCloseHandler} />}
      </ul>
    </Sticky>
  );
}
