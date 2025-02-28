import styles from './styles.module.css';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaUser } from 'react-icons/fa';

const Header = () => {
  const { data: session, status } = useSession();

  const handleLogin = (action: string) => {
    const PROVIDER = 'google';

    if (action === 'login') return signIn(PROVIDER);

    return signOut();
  };

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href={'/'}>
            <h1>
              MyTaks<span>+</span>
            </h1>
          </Link>

          {session && (
            <Link href={'/dashboard'} className={styles.dashboardLink}>
              Meu Painel
            </Link>
          )}
        </nav>

        {status === 'loading' ? (
          <></>
        ) : session ? (
          <button
            type="button"
            className={styles.logoutButton}
            onClick={() => handleLogin('logout')}
          >
            Olá, {session.user?.name}
          </button>
        ) : (
          <button
            type="button"
            className={styles.loginButton}
            onClick={() => handleLogin('login')}
          >
            <FaUser size={21} />
          </button>
        )}
      </section>
    </header>
  );
};

export default Header;
