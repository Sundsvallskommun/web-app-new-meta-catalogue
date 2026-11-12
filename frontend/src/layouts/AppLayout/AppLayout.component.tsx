'use client';

import { defaultTheme, GuiProvider, extendTheme, ConfirmationDialogContextProvider } from '@sk-web-gui/react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppWrapper } from '@contexts/app.context';
import { registerNavigator } from '@services/api-service';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import utc from 'dayjs/plugin/utc';
import updateLocale from 'dayjs/plugin/updateLocale';
import LoginGuard from '@components/LoginGuard/LoginGuard';

dayjs.extend(utc);
dayjs.locale('sv');
dayjs.extend(updateLocale);
dayjs.updateLocale('sv', {
  months: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
});

export default function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [colorScheme] = useState('light');

  useEffect(() => {
    registerNavigator((path) => router.push(path));
  }, [router]);

  const theme = useMemo(
    () =>
      extendTheme({
        cursor: colorScheme === 'light' ? 'pointer' : 'default',
        colorSchemes: defaultTheme.colorSchemes,
      }),
    [colorScheme]
  );

  return (
    <GuiProvider theme={theme}>
      <AppWrapper>
        <LoginGuard>
          <ConfirmationDialogContextProvider>
            {children}
          </ConfirmationDialogContextProvider>
        </LoginGuard>
      </AppWrapper>
    </GuiProvider>
  );
}
