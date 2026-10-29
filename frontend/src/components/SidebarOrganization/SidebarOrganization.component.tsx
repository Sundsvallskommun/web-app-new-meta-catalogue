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
    // MenuVertical.Item calls setCurrent again once it becomes current, which would fetch the same branch twice
    if (Number(menuIndex) === selectedOrganizationId) return;
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
      <span className="flex w-full items-center gap-8">
        {showFilter.responsibilityCode && (
          <span className="text-small">
            <span className="sr-only">Kod: </span>
            {itemData.responsibilityCode}
          </span>
        )}
        <span className={cx(active && 'underline')}>{itemData.label}</span>
        {showFilter.level && (
          <span className={cx('ml-auto text-small', !itemData.subItems?.length && 'pr-14')}>
            <span className="sr-only">Nivå: </span>
            {`N${itemData.level}`}
          </span>
        )}
      </span>
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
        : <button type="button" onClick={() => onMenuChangeHandler(itemData.id)}>
            {itemLabel(itemData)}
          </button>
        }
      </MenuVertical.Item>
    ));

  return (
    <aside
      className="SidebarOrganization flex flex-col relative overflow-visible bg-background-content border-1 border-divider rounded-cards"
      style={{ maxHeight: sidebarHeight ? sidebarHeight + 'px' : undefined }}
    >
      <div className="pt-24">
        <SideMenuHeadElement />
      </div>
      <div ref={asideRef} className="relative min-h-0 overflow-y-auto rounded-b-cards">
        <MenuVertical.Provider
          current={selectedOrganizationId}
          setCurrent={onMenuChangeHandler}
          menuAriaLabel="Organisationsmeny"
        >
          <MenuVertical.Sidebar>
            {orgTreeIsLoading ?
              <div className="flex justify-center py-32">
                <Spinner size={2} aria-label="Laddar organisationsträd" />
              </div>
            : !!orgTree?.length && <MenuVertical data-cy="organization-tree">{renderItems(orgTree)}</MenuVertical>}
          </MenuVertical.Sidebar>
        </MenuVertical.Provider>
      </div>
    </aside>
  );
};

export default SidebarOrganization;
