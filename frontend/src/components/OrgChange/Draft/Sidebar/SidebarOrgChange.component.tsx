import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { Ban, CircleAlert } from 'lucide-react';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Badge, Icon, MenuIndex, MenuVertical, Spinner, cx } from '@sk-web-gui/react';
import { calculatePositionDifference } from '@utils/calculatePositionDifference';
import { useEffect, useRef, useState } from 'react';
import SideMenuHeadElementOrgChange from './SideMenuHeadElementOrgChange.component';
import SparkleIcon from './SparkleNewItem.component';
import { IFilterDataMenu } from '@interfaces/organization';

const SidebarOrgChange = ({ mainRef }) => {
  const orgTreeIsLoading = useOrgChangeStore((s) => s.orgTreeIsLoading);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const selectedOrganizationId = useOrganizationStore((s) => s.selectedOrganizationId);
  const draft = useOrgChangeStore((s) => s.draft);
  const verifyResultsByOrgId = useOrgChangeStore((s) => s.verifyResultsByOrgId);
  const orgTree = useOrgChangeStore((s) => s.orgTree);
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

  const itemLabel = (itemData: OrgChangeOrganizationTree) => {
    const active = Number(itemData.id) === selectedOrganizationId;
    return (
      <span className="flex w-full items-center gap-8">
        {showFilter.responsibilityCode && (
          <span className="text-small">
            <span className="sr-only">Kod: </span>
            {itemData.responsibilityCode}
          </span>
        )}
        <span
          className={cx(
            itemData.structureChangeStatus === 'NEW' && 'text-warning font-bold',
            itemData.structureChangeStatus === 'DELETED' && 'italic',
            active && 'underline'
          )}
        >
          {showFilter.abbreviation ? `${itemData.label}` : `${itemData.orgName}`}
          {itemData.structureChangeStatus === 'DELETED' && ' [Stängd]'}
        </span>
        {itemData.structureChangeStatus === 'NEW' && <SparkleIcon />}
        {verifyResultsByOrgId && verifyResultsByOrgId[itemData.id] && <Icon color="error" icon={<CircleAlert />} />}
        {itemData.structureChangeStatus === 'DELETED' && (
          <span className="text-gray-stroke">
            <Icon icon={<Ban />} />
          </span>
        )}
        {itemData.structureChangeStatus === 'MOVED' && <span className="text-warning">Flyttad</span>}
        <span className="ml-auto flex items-center gap-8">
          {itemData.changes && itemData.changes >= 1 && itemData.structureChangeStatus !== 'DELETED' ?
            <span>
              <span className="sr-only">Ändringar: </span>
              <Badge size="md" color="warning" counter={itemData.changes > 99 ? '99+' : itemData.changes} />
            </span>
          : <></>}
          {showFilter.level && (
            <span className="text-small">
              <span className="sr-only">Nivå: </span>
              {`N${itemData.level}`}
            </span>
          )}
        </span>
      </span>
    );
  };

  const renderItems = (items: OrgChangeOrganizationTree[], isRoot = false) =>
    items.map((itemData, index) => (
      <MenuVertical.Item
        key={itemData.id}
        menuIndex={Number(itemData.id)}
        data-cy={`tree-item-${itemData.id}`}
        className={cx(
          itemData.structureChangeStatus === 'DELETED' && 'text-dark-disabled',
          isRoot && index > 0 && 'border-t-1 border-divider'
        )}
      >
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
      ref={asideRef}
      className="SidebarOrganization OrgChange block relative overflow-y-auto"
      style={{ maxHeight: sidebarHeight ? sidebarHeight + 'px' : undefined }}
    >
      <SideMenuHeadElementOrgChange />
      <MenuVertical.Provider
        current={selectedOrganizationId}
        setCurrent={onMenuChangeHandler}
        menuAriaLabel="Organisationsmeny"
      >
        <MenuVertical.Sidebar>
          {orgTreeIsLoading ?
            <Spinner size={2} aria-label="Laddar organisationsträd" />
          : !!orgTree?.length && <MenuVertical data-cy="organization-tree">{renderItems(orgTree, true)}</MenuVertical>}
        </MenuVertical.Sidebar>
      </MenuVertical.Provider>
      {!orgTree?.length && !orgTreeIsLoading && (
        <div className="mt-lg text-large text-gray-stroke">
          {!draft.draftId ?
            `Fyll i datum för produktion samt namn för att komma vidare i utkastet`
          : `Välj grenar för att kunna göra ändringar.`}
        </div>
      )}
    </aside>
  );
};

export default SidebarOrgChange;
