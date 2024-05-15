import { OrganizationTree } from '@data-contracts/backend/data-contracts';
import { IFilterDataMenu } from '@interfaces/organization';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { SideMenu, cx } from '@sk-web-gui/react';
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

  /**
   * Handles clicks from the SideMenu
   * @param data organization data returned from the click
   */
  const onMenuChangeHandler = (data) => {
    setSelectedOrganizationId(data.id);
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
        const activeElement = asideRef?.current?.querySelector('.menu-item.active');
        if (activeElement) {
          const diff = calculatePositionDifference(asideRef.current, activeElement);
          if (diff) {
            asideRef.current.scrollBy(0, diff - 150);
          }
        }
      }, 150);
    }
  });

  return (
    <aside
      ref={asideRef}
      className="SidebarOrganization block relative overflow-y-auto"
      style={{ maxHeight: sidebarHeight ? sidebarHeight + 'px' : undefined }}
    >
      <SideMenu
        ariaMenuLabel="Organisationsmeny"
        menuData={orgTree}
        linkCallback={onMenuChangeHandler}
        activeId={selectedOrganizationId as number}
        loading={orgTreeIsLoading}
        headElement={<SideMenuHeadElement />}
        renderMenuItemLabel={(itemData: OrganizationTree, active) => {
          return (
            <>
              <span>
                <span className={cx(`relative`, active && 'underline', itemData.level == 6 && 'pr-md')}>
                  <span>{showFilter.abbreviation ? `${itemData.label}` : `${itemData.orgName}`}</span>
                </span>
                {showFilter.responsibilityCode && (
                  <span className={`absolute top-0 ${active ? 'left-[12px]' : 'left-[6px]'}`}>
                    {showFilter.responsibilityCode && (
                      <>
                        <span className="sr-only">, Kod: </span>
                        {itemData.responsibilityCode}
                      </>
                    )}
                  </span>
                )}
                {showFilter.level && <span className="sr-only">, Nivå: {itemData.level}</span>}
              </span>
              {showFilter.level && !itemData.subItems && (
                <span className="absolute leading-none top-[7px] right-[4px] text-xs">{`N${itemData.level}`}</span>
              )}
            </>
          );
        }}
        renderMenuItemExpand={(itemData, open, defaultElement) => {
          return (
            <>
              {defaultElement}
              {showFilter.level && (
                <span className="absolute leading-none top-[7px] right-[4px] text-xs">{`N${itemData.level}`}</span>
              )}
            </>
          );
        }}
      />
    </aside>
  );
};

export default SidebarOrganization;
