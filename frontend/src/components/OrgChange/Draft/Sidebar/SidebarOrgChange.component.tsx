import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { CircleAlert, GripVertical, Sparkles } from 'lucide-react';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Badge, Icon, Label, MenuIndex, MenuVertical, Spinner, cx } from '@sk-web-gui/react';
import { calculatePositionDifference } from '@utils/calculatePositionDifference';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useUserStore } from '@services/user-service/user-service';
import { useEffect, useRef, useState } from 'react';
import SideMenuHeadElementOrgChange from './SideMenuHeadElementOrgChange.component';
import DragAndDropFormModal from './Modals/DragAndDropFormModal.component';
import SubmenuLabel from '@components/SidebarOrganization/SubmenuLabel.component';
import { IFilterDataMenu } from '@interfaces/organization';
import { DraftTreeOrganization } from '@interfaces/orgchange';

const SidebarOrgChange = ({ mainRef }) => {
  const orgTreeIsLoading = useOrgChangeStore((s) => s.orgTreeIsLoading);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const selectedOrganizationId = useOrganizationStore((s) => s.selectedOrganizationId);
  const draft = useOrgChangeStore((s) => s.draft);
  const verifyResultsByOrgId = useOrgChangeStore((s) => s.verifyResultsByOrgId);
  const orgTree = useOrgChangeStore((s) => s.orgTree);
  const sideMenuShowFilters = useOrgChangeStore((s) => s.sideMenuShowFilters);
  const orgTreeOrganizations = useOrgChangeStore((s) => s.orgTreeOrganizations);
  const user = useUserStore((s) => s.user);
  const { draftIsReadOnly } = useDraftPhaseState();
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const [draggedItem, setDraggedItem] = useState<OrgChangeOrganizationTree>();
  const [dropTargetId, setDropTargetId] = useState<number>();
  const [move, setMove] = useState<{
    draggedItem: DraftTreeOrganization;
    newParent: DraftTreeOrganization;
    oldParent?: DraftTreeOrganization;
  }>();
  const asideRef = useRef(null);

  const canDrag = !draftIsReadOnly && user.permissions.canEditOrganizationStructure;
  const isDraggable = (itemData: OrgChangeOrganizationTree) => canDrag && itemData.structureChangeStatus !== 'DELETED';

  const isValidDropTarget = (target: OrgChangeOrganizationTree) =>
    !!draggedItem &&
    target.level === draggedItem.level - 1 &&
    target.id !== draggedItem.parentId &&
    target.structureChangeStatus !== 'DELETED';

  const handleDragStart = (e: React.DragEvent, itemData: OrgChangeOrganizationTree) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(itemData.id));
    setDraggedItem(itemData);
  };

  const handleDragOver = (e: React.DragEvent, itemData: OrgChangeOrganizationTree) => {
    if (!draggedItem || itemData.id === draggedItem.id) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = isValidDropTarget(itemData) ? 'move' : 'none';
    setDropTargetId(isValidDropTarget(itemData) ? itemData.id : undefined);
  };

  const handleDragEnd = () => {
    setDraggedItem(undefined);
    setDropTargetId(undefined);
  };

  const handleDrop = (e: React.DragEvent, itemData: OrgChangeOrganizationTree) => {
    e.preventDefault();
    e.stopPropagation();
    const isValid = isValidDropTarget(itemData);
    const dragged = draggedItem;
    handleDragEnd();
    if (!isValid) return;
    const target = orgTreeOrganizations.find((x) => x.id === itemData.id);
    const moved = orgTreeOrganizations.find((x) => x.id === dragged.id);
    if (!target || !moved) return;
    setMove({
      draggedItem: moved,
      newParent: target,
      oldParent: orgTreeOrganizations.find((x) => x.id === dragged.parentId),
    });
  };

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
        {isDraggable(itemData) && (
          <span className="flex cursor-grab" aria-hidden>
            <Icon size={16} icon={<GripVertical />} />
          </span>
        )}
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
        {verifyResultsByOrgId?.[itemData.id] && <Icon color="error" icon={<CircleAlert />} />}
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
      <MenuVertical.Item
        key={itemData.id}
        menuIndex={Number(itemData.id)}
        data-cy={`tree-item-${itemData.id}`}
        className={cx(dropTargetId === itemData.id && 'ring-2 ring-ring rounded-button')}
        draggable={isDraggable(itemData)}
        onDragStart={(e: React.DragEvent) => handleDragStart(e, itemData)}
        onDragOver={(e: React.DragEvent) => handleDragOver(e, itemData)}
        onDrop={(e: React.DragEvent) => handleDrop(e, itemData)}
        onDragEnd={handleDragEnd}
      >
        {itemData.subItems?.length ?
          <MenuVertical>
            <MenuVertical.SubmenuButton>
              <button type="button">
                <SubmenuLabel label={itemLabel(itemData)}>{String(itemData.id)}</SubmenuLabel>
              </button>
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
      className="SidebarOrganization OrgChange flex flex-col relative overflow-visible bg-background-content border-1 border-divider rounded-cards"
      style={{ maxHeight: sidebarHeight ? sidebarHeight + 'px' : undefined }}
    >
      <div className="pt-24">
        <SideMenuHeadElementOrgChange />
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
        {!orgTree?.length && !orgTreeIsLoading && (
          <div className="mt-lg px-24 pb-24 text-large text-gray-stroke">
            {!draft.draftId ?
              `Fyll i datum för produktion samt namn för att komma vidare i utkastet`
            : `Välj grenar för att kunna göra ändringar.`}
          </div>
        )}
      </div>
      {move && <DragAndDropFormModal {...move} onClose={() => setMove(undefined)} />}
    </aside>
  );
};

export default SidebarOrgChange;
