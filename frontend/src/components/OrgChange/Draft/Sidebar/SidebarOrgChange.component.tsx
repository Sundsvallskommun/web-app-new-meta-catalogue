import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { CircleAlert, Sparkles } from 'lucide-react';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Badge, Icon, Label, MenuIndex, MenuVertical, Spinner, cx } from '@sk-web-gui/react';
import { calculatePositionDifference } from '@utils/calculatePositionDifference';
import { useEffect, useRef, useState } from 'react';
import SideMenuHeadElementOrgChange from './SideMenuHeadElementOrgChange.component';
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
        <span className={cx(active && 'underline')}>
          {showFilter.abbreviation ? `${itemData.label}` : `${itemData.orgName}`}
        </span>
        {itemData.structureChangeStatus === 'NEW' && (
          <Icon size={16} color="warning" icon={<Sparkles aria-label="Ny gren" />} />
        )}
        {verifyResultsByOrgId && verifyResultsByOrgId[itemData.id] && <Icon color="error" icon={<CircleAlert />} />}
        {itemData.structureChangeStatus === 'DELETED' && (
          <Label color="tertiary" rounded className="whitespace-nowrap">
            Stängd
          </Label>
        )}
        {itemData.structureChangeStatus === 'MOVED' && (
          <Label color="warning" rounded inverted className="whitespace-nowrap">
            Flyttad
          </Label>
        )}
        <span className={cx('ml-auto flex items-center gap-8', !itemData.subItems?.length && 'pr-14')}>
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

  const renderItems = (items: OrgChangeOrganizationTree[]) =>
    items.map((itemData) => (
      <MenuVertical.Item key={itemData.id} menuIndex={Number(itemData.id)} data-cy={`tree-item-${itemData.id}`}>
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
      className="SidebarOrganization OrgChange flex flex-col relative overflow-hidden bg-background-100 rounded-cards"
      style={{ maxHeight: sidebarHeight ? sidebarHeight + 'px' : undefined }}
    >
      <div ref={asideRef} className="relative min-h-0 overflow-y-auto pt-24">
        <SideMenuHeadElementOrgChange />
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
        {!orgTree?.length && !orgTreeIsLoading && (
          <div className="mt-lg px-24 pb-24 text-large text-gray-stroke">
            {!draft.draftId ?
              `Fyll i datum för produktion samt namn för att komma vidare i utkastet`
            : `Välj grenar för att kunna göra ändringar.`}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarOrgChange;
