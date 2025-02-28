import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import styles from './styles.module.css';
import Head from 'next/head';

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Meu Painel de Tarefas</title>
      </Head>
      <div className={styles.container}>
        <h1>Dashboard</h1>
      </div>
    </>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({
    req,
  });

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
