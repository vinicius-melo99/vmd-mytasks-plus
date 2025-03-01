import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { db } from '../../services/firebaseConnection';
import { DashboardProps, Task } from '@/@types';
import styles from './styles.module.css';
import Head from 'next/head';
import Textarea from '@/components/Textarea';
import { generateNewTask } from '@/util/factoryFunctions';
import Link from 'next/link';
import { toast } from 'react-toastify';

const Dashboard = ({ user }: DashboardProps) => {
  const [input, setInput] = useState('');
  const [publicTask, setPublicTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    (async () => {
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        orderBy('created', 'desc'),
        where('email', '==', user.email),
      );

      onSnapshot(q, (snapshot) => {
        const taskList: Task[] = [] as Task[];

        snapshot.forEach((doc) => {
          const task: Task = {
            id: doc.id,
            task: doc.data().task,
            email: doc.data().email,
            isPublic: doc.data().isPublic,
            created: doc.data().created,
          };

          taskList.push(task);
        });

        setTasks(taskList);
      });
    })();
  }, [user.email]);

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

  const handleDelete = async (id: string) => {
    console.log(id);
    const ref = collection(db, 'tasks');

    try {
      await deleteDoc(doc(ref, id));
    } catch (e) {
      console.log(`Erro ao deletar: ${e}`);
    }
  };

  const handleShare = async (id: string) => {
    const baseUrl = window.location.origin;
    const finalUrl = `${baseUrl}/task/${id}`;
    console.log(finalUrl);

    await navigator.clipboard.writeText(finalUrl);
    toast('Link copiado para a área de transferência.');
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

          {!tasks.length ? (
            <div className={styles.noTasksContainer}>
              <p>Comece cadastrando uma nova tarefa...</p>
            </div>
          ) : (
            tasks.map((task) => (
              <article className={styles.task} key={task.id}>
                {task.isPublic && (
                  <div className={styles.tagContainer}>
                    <label className={styles.tag}>PÚBLICA</label>
                    <button
                      className={styles.shareButton}
                      onClick={() => handleShare(task.id as string)}
                    >
                      <FiShare2 size={22} color="#3183ff" />
                    </button>
                  </div>
                )}

                <div className={styles.taskContent}>
                  {task.isPublic ? (
                    <Link href={`/task/${task.id}`}>
                      <p>{task.task}</p>
                    </Link>
                  ) : (
                    <p>{task.task}</p>
                  )}

                  <button
                    id={task.id}
                    className={styles.trashButton}
                    onClick={() => handleDelete(task.id as string)}
                  >
                    <FaTrash color="red" size={24} />
                  </button>
                </div>
              </article>
            ))
          )}
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
