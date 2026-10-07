import { CookieConsent, Footer, Header, Link, Logo, UserMenu } from '@sk-web-gui/react';
import AlertBannerEdit from '@components/AlertBannerManager/AlertBannerManager.component';
import { FeedbackModalWrapper } from '@components/Feedback/FeedbackModalWrapper.component';
import { useMenuItems } from '@components/UserMenuItems/UserMenuItems';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useUserStore } from '@services/user-service/user-service';
import { apiURL } from '@utils/api-url';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface DefaultLayoutProps {
  children: React.ReactElement | React.ReactElement[];
  title?: string;
  preTitle?: string;
  postTitle?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  tabMenu?: React.ReactElement;
  logoLinkHref?: string;
}

export default function DefaultLayout({
  title,
  preTitle,
  postTitle,
  headerTitle,
  headerSubtitle,
  children,
  tabMenu = undefined,
  logoLinkHref = '/',
}: DefaultLayoutProps) {
  const router = useRouter();
  const setSelectedOrganizationId = useOrganizationStore((s) => s.setSelectedOrganizationId);
  const user = useUserStore((s) => s.user);
  const menuItems = useMenuItems();

  const titleList = [preTitle, 'Masterdata', headerSubtitle, postTitle];
  const fullTitle = titleList.filter((x) => x).join(' - ');

  const setFocusToMain = () => {
    const contentElement = document.getElementById('content');
    contentElement.focus();
  };

  const handleLogoClick = () => {
    setSelectedOrganizationId(null);
    router.push(logoLinkHref);
  };

  return (
    <div className="DefaultLayout full-page-layout">
      <Head>
        <title>{title ? title : fullTitle}</title>
        <meta name="description" content="Masterdata" />
      </Head>

      <NextLink href="#content" legacyBehavior passHref>
        <a onClick={setFocusToMain} accessKey="s" className="next-link-a" data-cy="systemMessage-a">
          Hoppa till innehåll
        </a>
      </NextLink>

      <AlertBannerEdit />

      <Header
        data-cy="nav-header"
        title={headerTitle ? headerTitle : 'Masterdata'}
        subtitle={headerSubtitle ? headerSubtitle : ''}
        aria-label={`${headerTitle ? headerTitle : 'Masterdata'} ${headerSubtitle}`}
        logoLinkOnClick={handleLogoClick}
        userMenu={
          <UserMenu
            menuTitle={user.name}
            menuSubTitle={''}
            menuGroups={menuItems}
            placeholderImage={`${process.env.NEXT_PUBLIC_BASE_PATH}/user-image-placeholder-square-48.png`}
            image={`${apiURL(`/employee/personimage?width=${44}`)}`}
          />
        }
      />

      {tabMenu && tabMenu}

      <div className={`main-container flex-grow relative w-full flex flex-col`}>{children}</div>

      <CookieConsent
        title="Kakor på Nya metakatalogen"
        body={
          <p>
            Vi använder kakor, cookies, för att ge dig en förbättrad upplevelse, sammanställa statistik och för att viss
            nödvändig funktionalitet ska fungera på webbplatsen.{' '}
            <Link as={NextLink} href="/kakor">
              Läs mer om hur vi använder kakor
            </Link>
          </p>
        }
        cookies={[
          {
            optional: false,
            displayName: 'Nödvändiga kakor',
            description:
              'Dessa kakor är nödvändiga för att webbplatsen ska fungera och kan inte stängas av i våra system.',
            cookieName: 'necessary',
          },
          {
            optional: true,
            displayName: 'Funktionella kakor',
            description: ' Dessa kakor ger förbättrade funktioner på webbplatsen.',
            cookieName: 'func',
          },
          {
            optional: true,
            displayName: 'Kakor för statistik',
            description:
              'Dessa kakor tillåter oss att räkna besök och trafikkällor, så att vi kan mäta och förbättra prestanda på vår webbplats.',
            cookieName: 'stats',
          },
        ]}
        resetConsentOnInit={false}
        onConsent={() => {
          // NO ANO FUNCTIONS
        }}
      />

      <Footer className="bg-background-200">
        <Footer.Content>
          <Footer.LogoWrapper>
            <Logo aria-label="Sundsvalls kommun logotyp" />
          </Footer.LogoWrapper>
        </Footer.Content>
      </Footer>

      <FeedbackModalWrapper />
    </div>
  );
}
