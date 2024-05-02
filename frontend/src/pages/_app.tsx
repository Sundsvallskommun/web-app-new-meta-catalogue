import type { AppProps } from 'next/app';
import { defaultTheme, GuiProvider, extendTheme, ConfirmationDialogContextProvider } from '@sk-web-gui/react';
import { useMemo, useState } from 'react';
import { AppWrapper } from '@contexts/app.context';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import utc from 'dayjs/plugin/utc';
import updateLocale from 'dayjs/plugin/updateLocale';
import '@styles/tailwind.scss';
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

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme] = useState('light');

  const theme = useMemo(
    () =>
      extendTheme({
        cursor: colorScheme === 'light' ? 'pointer' : 'default',
        colorSchemes: defaultTheme.colorSchemes,
      }),
    [colorScheme]
  );

  return (
    <GuiProvider theme={theme} colorScheme={colorScheme}>
      <AppWrapper>
        <LoginGuard>
          <ConfirmationDialogContextProvider>
            <Component {...pageProps} />
          </ConfirmationDialogContextProvider>
        </LoginGuard>
      </AppWrapper>
    </GuiProvider>
  );
}

export default MyApp;
