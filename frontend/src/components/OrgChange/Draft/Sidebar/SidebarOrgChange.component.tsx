import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import BlockIcon from '@mui/icons-material/Block';
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Badge, IMenu, SideMenu, cx, useMessage } from '@sk-web-gui/react';
import { calculatePositionDifference } from '@utils/calculatePositionDifference';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import { useEffect, useRef, useState } from 'react';
import DragAndDropFormModal from './Modals/DragAndDropFormModal.component';
import SideMenuHeadElementOrgChange from './SideMenuHeadElementOrgChange.component';
import SparkleIcon from './SparkleNewItem.component';
import ErrorIcon from '@mui/icons-material/Error';
import { IFilterDataMenu } from '@interfaces/organization';

const SidebarOrgChange = ({ mainRef }) => {
  const orgTreeIsLoading = useOrgChangeStore((s) => s.orgTreeIsLoading);
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const selectedOrganizationId = useOrganizationStore((s) => s.selectedOrganizationId);
  const draft = useOrgChangeStore((s) => s.draft);
  const verifyResultsByOrgId = useOrgChangeStore((s) => s.verifyResultsByOrgId);
  const orgTree = useOrgChangeStore((s) => s.orgTree);
  const sideMenuShowFilters = useOrgChangeStore((s) => s.sideMenuShowFilters);
  const { draftIsReadOnly } = useDraftPhaseState();
  const [isDropNodeOpen, setIsDropNodeOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<IMenu>();
  const [newParent, setNewParent] = useState<IMenu>();
  const [oldParent, setOldParent] = useState<IMenu>();
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const message = useMessage();
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
    setSelectedOrganizationId(parseInt(data.id.toString()));
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

  const handleOnDrop = (draggedItem: IMenu, oldParent: IMenu, newParent: IMenu) => {
    if (oldParent.level !== newParent.level) {
      message({
        message: `${draggedItem.label} får bara flyttas till en förälder i nivå ${oldParent.level}`,
        status: 'error',
      });
      return;
    }
    setIsDropNodeOpen(true);
    setDraggedItem(draggedItem);
    setNewParent(newParent);
    setOldParent(oldParent);
  };

  const onCloseHandler = () => {
    setIsDropNodeOpen(false);
  };

  const orgTreeManaged =
    orgTree?.length > 0 ?
      orgTree
        .reduce((acc, val, i) => {
          return acc.concat(
            {
              id: `separator-${i}`,
              label: 'Separator',
              separator: true,
              subItems: null,
            },
            val
          );
        }, [])
        .slice(1)
    : [];

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
      className="SidebarOrganization OrgChange block relative overflow-y-auto"
      style={{ maxHeight: sidebarHeight ? sidebarHeight + 'px' : undefined }}
    >
      <SideMenu
        ariaMenuLabel="Organisationsmeny"
        draggable={!draftIsReadOnly}
        onDrop={handleOnDrop}
        menuData={orgTreeManaged}
        linkCallback={onMenuChangeHandler}
        activeId={selectedOrganizationId}
        loading={orgTreeIsLoading}
        headElement={<SideMenuHeadElementOrgChange />}
        classNameMenuItemWrapperFunction={(itemData: OrgChangeOrganizationTree) =>
          itemData.structureChangeStatus === 'DELETED' && 'text-gray-700'
        }
        renderMenuItemDragLabel={(itemData: OrgChangeOrganizationTree) => {
          return itemData.structureChangeStatus === 'DELETED' || itemData.structureChangeStatus === 'MOVED' ?
              <>
                {itemData.structureChangeStatus === 'DELETED' && (
                  <span className="text-gray-stroke cursor-not-allowed">
                    <BlockIcon className="sk-sidemenu-menuitem-movebutton-icon !text-2xl" />
                  </span>
                )}
                {itemData.structureChangeStatus === 'MOVED' && (
                  <span className="text-warning font-sans flex items-center pr-[57px]">
                    <span className="text-base mr-2">Flyttad</span>
                    <DragIndicatorOutlinedIcon className="!text-2xl" />
                  </span>
                )}
              </>
            : <DragIndicatorOutlinedIcon className="sk-sidemenu-menuitem-movebutton-icon !text-2xl" />;
        }}
        renderMenuItemLabel={(itemData: OrgChangeOrganizationTree, active) => {
          return (
            <>
              <span>
                <span
                  className={cx(
                    `relative`,
                    itemData.structureChangeStatus === 'NEW' && 'text-warning font-bold',
                    active && 'underline',
                    itemData.level == 6 && 'pr-md'
                  )}
                >
                  <span className={`${itemData.structureChangeStatus === 'DELETED' && 'italic'}`}>
                    {showFilter.abbreviation ? `${itemData.label}` : `${itemData.orgName}`}

                    {itemData.structureChangeStatus === 'DELETED' && ' [Stängd]'}
                  </span>
                  {itemData.structureChangeStatus === 'NEW' && <SparkleIcon />}
                </span>
                {(showFilter.responsibilityCode || (verifyResultsByOrgId && verifyResultsByOrgId[itemData.id])) && (
                  <span className={`absolute top-0 ${active ? 'left-[12px]' : 'left-[6px]'}`}>
                    {showFilter.responsibilityCode && (
                      <>
                        <span className="sr-only">, Kod: </span>
                        {itemData.responsibilityCode}
                      </>
                    )}
                    {verifyResultsByOrgId && verifyResultsByOrgId[itemData.id] && (
                      <span className={showFilter.responsibilityCode && 'ml-[.5rem]'}>
                        <ErrorIcon className="text-error !text-lg" />
                      </span>
                    )}
                  </span>
                )}
                {showFilter.level && <span className="sr-only">, Nivå: {itemData.level}</span>}
                {itemData.changes && itemData.changes >= 1 && itemData.structureChangeStatus !== 'DELETED' ?
                  <span className="absolute my-0 right-sm lg:right-6">
                    <span className="sr-only">Ändringar: </span>
                    <Badge
                      className=""
                      size="lg"
                      variant="solid"
                      color="warning"
                      max={99}
                      counter={itemData.changes}
                      position={'standard'}
                      noBorder
                    />
                  </span>
                : <></>}
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
      {orgTreeManaged.length == 0 && !orgTreeIsLoading && (
        <div className="mt-lg text-lg text-gray-stroke">
          {!draft.draftId ?
            `Fyll i datum för produktion samt namn för att komma vidare i utkastet`
          : `Välj grenar för att kunna göra ändringar.`}
        </div>
      )}

      {isDropNodeOpen && (
        <DragAndDropFormModal
          onClose={onCloseHandler}
          draggedItem={draggedItem}
          newParent={newParent}
          oldParent={oldParent}
        />
      )}
    </aside>
  );
};

export default SidebarOrgChange;
