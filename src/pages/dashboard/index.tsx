import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import { addDoc, collection } from 'firebase/firestore';
import { ChangeEvent, FormEvent, useState } from 'react';
import { db } from '../../services/firebaseConnection';
import { DashboardProps, Task } from '@/@types';
import styles from './styles.module.css';
import Head from 'next/head';
import Textarea from '@/components/Textarea';
import { generateNewTask } from '@/util/factoryFunctions';

const Dashboard = ({ user }: DashboardProps) => {
  const [input, setInput] = useState('');
  const [publicTask, setPublicTask] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInput = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => setInput(value);

  const handlePublicTask = ({
    target: { checked },
  }: ChangeEvent<HTMLInputElement>) => setPublicTask(checked);

  const handleSubmitTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask: Task = generateNewTask(input, user.email, publicTask);

    try {
      setLoading(true);
      await addDoc(collection(db, 'tasks'), newTask);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setPublicTask(false);
      setInput('');
    }
  };

  return (
    <>
      <Head>
        <title>Meu Painel de Tarefas</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual a sua tarefa?</h1>

            <form onSubmit={handleSubmitTask}>
              <Textarea
                placeholder="Digite a sua tarefa..."
                value={input}
                onChange={handleInput}
              />
              <div className={styles.checkboxArea}>
                <input
                  id="public-task"
                  type="checkbox"
                  className={styles.checkbox}
                  onChange={handlePublicTask}
                  checked={publicTask}
                />
                <label htmlFor="public-task" className={styles.label}>
                  Deixar tarefa pública?
                </label>
              </div>
              <button
                className={styles.submitButton}
                disabled={!input || loading}
              >
                {!loading ? 'Registrar' : 'Enviando tarefa...'}
              </button>
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
    props: {
      user: {
        email: session.user?.email,
      },
    },
  };
};
