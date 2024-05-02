import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { Select } from '@sk-web-gui/forms';
import { FormControl, FormLabel, SideMenu } from '@sk-web-gui/react';
import { calculatePositionDifference } from '@utils/calculatePositionDifference';
import { useEffect, useRef, useState } from 'react';
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

const SidebarOrganization = ({ mainRef }) => {
  const {
    treeImageId,
    setTreeImageId,
    treeImage,
    getTreeImage,
    getCompany,
    selectedCompanyOrgId,
    selectedOrganizationId,
    setSelectedCompanyOrgId,
    orgTreeIsLoading,
    setSelectedOrganizationId,
    orgTree,
  } = useOrganizationStore();
  const [selectedTreeImage, setSelectedTreeImage] = useState<TreeImage>(treeImages[treeImageId]);
  const [sidebarHeight, setSidebarHeight] = useState(0);
  const asideRef = useRef(null);

  /**
   * Handles clicks from the SideMenu
   * @param data organization data returned from the click
   */
  const onMenuChangeHandler = (data) => {
    setSelectedOrganizationId(data.id);
  };

  /**
   * Sets the treeImageId
   */
  const onTreeImageChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = parseInt(e.target.value);
    setTreeImageId(value);
    setSelectedTreeImage(treeImages.find((x) => x.id === value));
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

  const onCompanyChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = parseInt(e.target.value);
    setSelectedCompanyOrgId(value);
  };

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
        label="Organisation"
        menuData={orgTree}
        linkCallback={onMenuChangeHandler}
        activeId={selectedOrganizationId as number}
        loading={orgTreeIsLoading}
        headElement={
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
        }
      />
    </aside>
  );
};

export default SidebarOrganization;
