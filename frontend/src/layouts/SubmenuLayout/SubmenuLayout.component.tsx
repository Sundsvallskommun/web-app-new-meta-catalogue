import { GlobalSearch } from '@components/GlobalSearch/GlobalSearch.component';
import SearchResults from '@components/GlobalSearch/SearchResults.component';
import DefaultLayout from '@layouts/DefaultLayout/DefaultLayout.component';
import { useSearchStore } from '@services/mdviewer/search-service';
import { useUserStore } from '@services/user-service/user-service';
import { TabMenu } from '@sk-web-gui/react';
import NextLink from 'next/link';

export default function SubmenuLayout({
  title = '',
  postTitle = '',
  headerTitle = '',
  headerSubtitle = '',
  children,
  ...rest
}) {
  const user = useUserStore((s) => s.user);
  const searchTerm = useSearchStore((s) => s.searchTerm);
  return (
    <DefaultLayout
      title={title}
      postTitle={postTitle}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
      tabMenu={
        <div className="shadow-[inset_0_-6px_rgba(244,244,244,1)]">
          <div data-cy="tabMenu" className="container mx-auto ">
            <TabMenu
              className={`[&_.sk-tab-menu-wrapper]:block lg:[&_.sk-tab-menu-wrapper]:flex [&_ul]:mb-md lg:[&_ul]:mb-0 [&_.sk-tab-menu-wrapper]:pb-sm lg:[&_.sk-tab-menu-wrapper]:pb-0`}
              render={(element, item) => (
                <NextLink legacyBehavior href={item.path} passHref>
                  {element}
                </NextLink>
              )}
              menuData={[
                {
                  id: 1,
                  label: 'Organisation',
                  path: '/',
                },
                ...(user.permissions.canViewResponsibility ?
                  [
                    {
                      id: 2,
                      label: 'Ansvar',
                      path: '/ansvar',
                    },
                  ]
                : []),
              ]}
            >
              <GlobalSearch />
            </TabMenu>
          </div>
        </div>
      }
      {...rest}
    >
      <div className={`bg-white max-w-full w-full -mt-[6px] grow ${!searchTerm && 'hidden'}`}>
        <div className="container">
          <SearchResults />
        </div>
      </div>
      <div className={`flex flex-grow max-w-full relative ${searchTerm && 'hidden'}`}>{children}</div>
    </DefaultLayout>
  );
}
