import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import styles from './styles.module.css';
import Head from 'next/head';
import Textarea from '@/components/Textarea';

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Meu Painel de Tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual a sua tarefa?</h1>

            <form>
              <Textarea placeholder="Digite a sua tarefa..." />
              <div className={styles.checkboxArea}>
                <input
                  id="public-task"
                  type="checkbox"
                  className={styles.checkbox}
                />
                <label htmlFor="public-task" className={styles.label}>
                  Deixar tarefa pública?
                </label>
              </div>
              <button className={styles.submitButton}>Registrar</button>
            </form>
          </div>
        </section>
      </main>
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
