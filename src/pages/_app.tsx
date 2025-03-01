import { SessionProvider } from 'next-auth/react';
import Header from '@/components/Header';
import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ToastContainer />
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
