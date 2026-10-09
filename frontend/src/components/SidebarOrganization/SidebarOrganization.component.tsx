import { OrganizationTree } from '@data-contracts/backend/data-contracts';
import { IFilterDataMenu } from '@interfaces/organization';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { MenuIndex, MenuVertical, Spinner, cx } from '@sk-web-gui/react';
import { calculatePositionDifference } from '@utils/calculatePositionDifference';
import { useEffect, useRef, useState } from 'react';
import SideMenuHeadElement from './SideMenuHeadElement.component';

const SidebarOrganization = ({ mainRef }) => {
  const { getTreeImage, getCompany, selectedOrganizationId, orgTreeIsLoading, setSelectedOrganizationId, orgTree } =
    useOrganizationStore();
  const sideMenuShowFilters = useOrgChangeStore((s) => s.sideMenuShowFilters);
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const asideRef = useRef(null);

  const showFilter: { [key: IFilterDataMenu['propertyName']]: boolean } = {};
  sideMenuShowFilters.forEach((x) => {
    showFilter[x.propertyName] = x.value;
  });

  const onMenuChangeHandler = (menuIndex: MenuIndex) => {
    setSelectedOrganizationId(Number(menuIndex));
  };

  const fixSidebarHeight = () => {
    setSidebarHeight(mainRef?.current?.getBoundingClientRect().height);
  };

  /**
   * On mount, get root tree
   */
  useEffect(() => {
    getTreeImage();
    getCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mainRef?.current?.addEventListener('resize', fixSidebarHeight);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mainRef?.current?.removeEventListener('resize', fixSidebarHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainRef]);

  useEffect(() => {
    if (!orgTreeIsLoading && orgTree?.length && asideRef && asideRef.current) {
      setTimeout(() => {
        const activeElement = asideRef?.current?.querySelector('[aria-current="page"]');
        if (activeElement) {
          const diff = calculatePositionDifference(asideRef.current, activeElement);
          if (diff) {
            asideRef.current.scrollBy(0, diff - 150);
          }
        }
      }, 150);
    }
  });

  const itemLabel = (itemData: OrganizationTree) => {
    const active = itemData.id === selectedOrganizationId;
    return (
      <>
        <span>
          <span className={cx(`relative`, active && 'underline', itemData.level == 6 && 'pr-md')}>
            <span>{itemData.label}</span>
          </span>
          {showFilter.responsibilityCode && (
            <span className={`absolute top-0 ${active ? 'left-[12px]' : 'left-[6px]'}`}>
              <span className="sr-only">, Kod: </span>
              {itemData.responsibilityCode}
            </span>
          )}
          {showFilter.level && <span className="sr-only">, Nivå: {itemData.level}</span>}
        </span>
        {showFilter.level && (
          <span className="absolute leading-none top-[7px] right-[4px] text-xs">{`N${itemData.level}`}</span>
        )}
      </>
    );
  };

  const renderItems = (items: OrganizationTree[]) =>
    items.map((itemData) => (
      <MenuVertical.Item key={itemData.id} menuIndex={itemData.id} data-cy={`tree-item-${itemData.id}`}>
        {itemData.subItems?.length ?
          <MenuVertical>
            <MenuVertical.SubmenuButton>
              <button type="button">{itemLabel(itemData)}</button>
            </MenuVertical.SubmenuButton>
            {renderItems(itemData.subItems)}
          </MenuVertical>
        : <button type="button">{itemLabel(itemData)}</button>}
      </MenuVertical.Item>
    ));

  return (
    <aside
      ref={asideRef}
      className="SidebarOrganization block relative overflow-y-auto"
      style={{ maxHeight: sidebarHeight ? sidebarHeight + 'px' : undefined }}
    >
      <MenuVertical.Provider
        current={selectedOrganizationId}
        setCurrent={onMenuChangeHandler}
        menuAriaLabel="Organisationsmeny"
      >
        <MenuVertical.Sidebar>
          <MenuVertical.Header>
            <SideMenuHeadElement />
          </MenuVertical.Header>
          {orgTreeIsLoading ?
            <Spinner size={2} aria-label="Laddar organisationsträd" />
          : !!orgTree?.length && <MenuVertical data-cy="organization-tree">{renderItems(orgTree)}</MenuVertical>}
        </MenuVertical.Sidebar>
      </MenuVertical.Provider>
    </aside>
  );
};

export default SidebarOrganization;
