import { useSession, signIn, signOut } from 'next-auth/react';
import { Tooltip, TooltipRefProps } from 'react-tooltip';
import { MdSpaceDashboard } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { TbLogout2 } from 'react-icons/tb';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.css';
import { useEffect, useRef } from 'react';

const Header = () => {
  const { data: session, status } = useSession();
  const { route } = useRouter();

  const userTooltip = useRef<TooltipRefProps>(null);

  const LOGIN_ACTION = 'LOGIN_ACTION';
  const LOGOUT_ACTION = 'LOGOUT_ACTION';

  useEffect(() => {
    userTooltip.current?.close();
  }, [route]);

  const handleLogin = (action: string) => {
    const PROVIDER = 'google';

    if (action === LOGIN_ACTION) return signIn(PROVIDER);

    return signOut();
  };

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href={'/'}>
            <h1>
              MyTasks<span>+</span>
            </h1>
          </Link>
        </nav>

        {status === 'loading' ? (
          <></>
        ) : session ? (
          <>
            <button
              id="user-options-button"
              type="button"
              className={styles.logoutButton}
            >
              <Image
                src={session.user?.image as string}
                alt={`Foto de ${session.user?.name}`}
                width={45}
                height={45}
              />
            </button>
            <Tooltip
              anchorSelect="#user-options-button"
              clickable
              openOnClick
              ref={userTooltip}
              // className="rounded-tooltip"
            >
              <div className={styles.tooltipNameBox}>
                Olá, {session.user?.name}
              </div>
              <Link href="/dashboard" className={styles.tooltipDashboardLink}>
                <MdSpaceDashboard size={21} />
                Dashboard
              </Link>
              <button
                className={styles.tooltipDashboardLink}
                onClick={() => handleLogin(LOGOUT_ACTION)}
              >
                <TbLogout2 size={21} />
                Logout
              </button>
            </Tooltip>
          </>
        ) : (
          <>
            <button
              id="login-button"
              type="button"
              className={styles.loginButton}
              onClick={() => handleLogin(LOGIN_ACTION)}
            >
              <FaUser size={21} />
            </button>
            <Tooltip
              anchorSelect="#login-button"
              content="Faça Login com o Google"
              delayShow={200}
              delayHide={200}
            />
          </>
        )}
      </section>
    </header>
  );
};

export default Header;
