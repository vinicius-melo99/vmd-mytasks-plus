import Head from 'next/head';
import styles from '@/styles/home.module.css';
import Image from 'next/image';
import tasks from '../../public/assets/tasks.svg';
import { GetStaticProps } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebaseConnection';
import { HomeProps } from '@/@types';

export default function Home({ commentsSize, tasksSize }: HomeProps) {
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
            <span>{`+${tasksSize} ${(tasksSize === 1 && 'post') || 'posts'}`}</span>
          </section>
          <section className={styles.box}>
            <span>{`+${commentsSize} ${(commentsSize === 1 && 'comentário') || 'comentários'}`}</span>
          </section>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  //buscar do banco os números e mandar pro componente

  const commentsCollectionRef = collection(db, 'comments');
  const commentsSnap = await getDocs(commentsCollectionRef);

  const tasksCollectionRef = collection(db, 'tasks');
  const taskSnap = await getDocs(tasksCollectionRef);

  return {
    props: {
      tasksSize: taskSnap.size || 0,
      commentsSize: commentsSnap.size || 0,
    },
    revalidate: 60,
  };
};
