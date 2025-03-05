import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { FiShare2 } from 'react-icons/fi';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
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
import { DashboardProps, TaskType } from '@/@types';
import styles from './styles.module.css';
import Head from 'next/head';
import Textarea from '@/components/Textarea';
import { generateNewTask } from '@/util/factoryFunctions';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { useRouter } from 'next/router';

const Dashboard = ({ user }: DashboardProps) => {
  const [input, setInput] = useState('');
  const [publicTask, setPublicTask] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        orderBy('created', 'desc'),
        where('email', '==', user.email),
      );

      onSnapshot(q, (snapshot) => {
        const taskList: TaskType[] = [] as TaskType[];

        snapshot.forEach((doc) => {
          const task: TaskType = {
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

    const newTask: TaskType = generateNewTask(input, user.email, publicTask);

    setLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), newTask);
      toast.success('Tarefa registrada com sucesso!');
    } catch {
      toast.error(
        'Erro ao registrar a tarefa! Cheque sua conexão ou tente novamente mais tarde.',
      );
    } finally {
      setLoading(false);
      setPublicTask(false);
      setInput('');
    }
  };

  const handleDelete = async (id: string) => {
    const ref = collection(db, 'tasks');

    try {
      await deleteDoc(doc(ref, id));
      toast.success('Tarefa deletada com sucesso!');
    } catch {
      toast.error(
        'Erro ao deletar a tarefa! Cheque sua conexão ou tente novamente mais tarde.',
      );
    }
  };

  const handleShare = async (id: string) => {
    const baseUrl = window.location.origin;
    const finalUrl = `${baseUrl}/task/${id}`;

    await navigator.clipboard.writeText(finalUrl);
    toast('Link copiado para a área de transferência.');
  };

  const handleAccessTaks = (id: string) => {
    router.push(`/task/${id}`);
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
                      id="share-button"
                      className={styles.shareButton}
                      onClick={() => handleShare(task.id as string)}
                    >
                      <FiShare2 size={22} color="#3183ff" />
                    </button>
                    <button
                      id="access-button"
                      className={styles.accessTask}
                      onClick={() => handleAccessTaks(task.id as string)}
                    >
                      <FaExternalLinkAlt size={22} color="#3183ff" />
                    </button>
                    <Tooltip
                      anchorSelect="#access-button"
                      content="Acessar tarefa"
                    />
                    <Tooltip
                      anchorSelect="#share-button"
                      content="Compartilhar tarefa"
                    />
                  </div>
                )}

                <div className={styles.taskContent}>
                  {task.isPublic ? (
                    <>
                      <Link href={`/task/${task.id}`} id="access-task">
                        <p>{task.task}</p>
                      </Link>
                      <Tooltip
                        anchorSelect="#access-task"
                        content="Acessar tarefa"
                      />
                    </>
                  ) : (
                    <p>{task.task}</p>
                  )}

                  <button
                    id="delete-task"
                    className={styles.trashButton}
                    onClick={() => handleDelete(task.id as string)}
                  >
                    <FaTrash color="#bb0202" size={24} />
                  </button>
                  <Tooltip anchorSelect="#delete-task" />
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
