import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
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

        <section className={styles.taskContainer}>
          <h1>Minhas Tarefas</h1>
          <article className={styles.task}>
            <div className={styles.tagContainer}>
              <label className={styles.tag}>PÚBLICA</label>
              <button className={styles.shareButton}>
                <FiShare2 size={22} color="#3183ff" />
              </button>
            </div>

            <div className={styles.taskContent}>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tempora, enim. Lorem ipsum, dolor sit amet consectetur
                adipisicing elit. Explicabo, aliquam! Modi sint aspernatur
                consequuntur, suscipit itaque quia laboriosam inventore totam
                maiores eius quibusdam dolores aliquid minima laborum a non ut?
                Earum qui quod assumenda atque tempore accusamus culpa
                voluptatem reiciendis! Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Cum officiis voluptas perferendis fugiat aut,
                porro placeat unde eos magnam et molestiae nisi quisquam
                perspiciatis animi quae. Aut deleniti voluptas corporis?
              </p>
              <button className={styles.trashButton}>
                <FaTrash color="red" size={24} />
              </button>
            </div>
          </article>
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
