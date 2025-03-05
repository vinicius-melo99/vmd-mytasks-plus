import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import Header from '@/components/Header';
import 'react-tooltip/dist/react-tooltip.css';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ToastContainer />
        <Header />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
