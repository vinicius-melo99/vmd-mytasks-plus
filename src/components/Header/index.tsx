import styles from './styles.module.css';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';

const Header = () => {
  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href={'/'}>
            <h1>
              MyTaks<span>+</span>
            </h1>
          </Link>
          <Link href={'/dashboard'} className={styles.dashboardLink}>
            Meu Painel
          </Link>
        </nav>
        <button type="button" className={styles.loginButton}>
          <FaUser size={21} />
        </button>
      </section>
    </header>
  );
};

export default Header;
