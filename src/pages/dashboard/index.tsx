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
