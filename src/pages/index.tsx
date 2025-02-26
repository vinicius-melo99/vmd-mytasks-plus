import Head from 'next/head';
import styles from '@/styles/home.module.css';
import Image from 'next/image';
import tasks from '../../public/assets/tasks.svg';

export default function Home() {
  return (
    <>
      <Head>
        <title>MyTaks+</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.logoContent}>
          <Image
            src={tasks}
            className={styles.hero}
            alt="imagem de tarefas"
            priority={true}
          />
        </div>
        <h2 className={styles.title}>
          Feito para organizar seus estudos e tarefas!
        </h2>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+12 posts</span>
          </section>
          <section className={styles.box}>
            <span>+90 comentários</span>
          </section>
        </div>
      </main>
    </>
  );
}
