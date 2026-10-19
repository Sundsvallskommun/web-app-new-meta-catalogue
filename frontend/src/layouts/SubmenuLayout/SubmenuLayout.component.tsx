import { GlobalSearch } from '@components/GlobalSearch/GlobalSearch.component';
import SearchResults from '@components/GlobalSearch/SearchResults.component';
import DefaultLayout from '@layouts/DefaultLayout/DefaultLayout.component';
import { useSearchStore } from '@services/mdviewer/search-service';
import { useUserStore } from '@services/user-service/user-service';
import { NavigationBar } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

export default function SubmenuLayout({
  title = '',
  postTitle = '',
  headerTitle = '',
  headerSubtitle = '',
  children,
  ...rest
}) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const searchTerm = useSearchStore((s) => s.searchTerm);
  return (
    <DefaultLayout
      title={title}
      postTitle={postTitle}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
      tabMenu={
        <div className="px-md md:px-lg">
          <div data-cy="tabMenu" className="container mx-auto pt-24 pb-sm lg:pb-0 lg:flex lg:items-center">
            <NavigationBar current={router.pathname.startsWith('/ansvar') ? 1 : 0} className="-ml-8 mb-md lg:mb-0">
              <NavigationBar.Item>
                <NextLink href="/">Organisation</NextLink>
              </NavigationBar.Item>
              {user.permissions.canViewResponsibility && (
                <NavigationBar.Item>
                  <NextLink href="/ansvar">Ansvar</NextLink>
                </NavigationBar.Item>
              )}
            </NavigationBar>
            <GlobalSearch />
          </div>
        </div>
      }
      {...rest}
    >
      <div className={`bg-background-content max-w-full w-full grow px-md md:px-lg ${!searchTerm && 'hidden'}`}>
        <div className="container">
          <SearchResults />
        </div>
      </div>
      <div className={`flex flex-grow max-w-full relative ${searchTerm && 'hidden'}`}>{children}</div>
    </DefaultLayout>
  );
}
