import Head from 'next/head';
import styles from './styles.module.css';
import { GetServerSideProps } from 'next';
import { db } from '@/services/firebaseConnection';
import { doc, collection, query, where, getDoc } from 'firebase/firestore';

const Task = () => {
  return (
    <>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa</h1>
      </main>
    </>
  );
};

export default Task;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, 'tasks', id);

  const snapshot = await getDoc(docRef);

  if (!snapshot.data()) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.isPublic) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created.seconds * 1000;

  console.log(snapshot.data());

  const task = {
    id,
    task: snapshot.data()?.task,
    isPublic: snapshot.data()?.isPublic,
    email: snapshot.data()?.email,
    created: new Date(miliseconds).toLocaleDateString('pt-BR'),
  };

  console.log(task);

  return {
    props: {},
  };
};
