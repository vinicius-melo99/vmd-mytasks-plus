import { SessionProvider } from 'next-auth/react';
import Header from '@/components/Header';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
