import '@styles/tailwind.scss';

import LoaderFullScreen from '@components/Loader/LoaderFullScreen.component';
import AppLayout from '@layouts/AppLayout/AppLayout.component';
import { ReactNode, Suspense } from 'react';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="sv">
      <body>
        <Suspense fallback={<LoaderFullScreen />}>
          <AppLayout>{children}</AppLayout>
        </Suspense>
      </body>
    </html>
  );
}
