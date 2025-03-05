import Head from 'next/head';
import styles from './styles.module.css';
import Textarea from '@/components/Textarea';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { db } from '@/services/firebaseConnection';
import {
  doc,
  onSnapshot,
  query,
  where,
  getDoc,
  Unsubscribe,
  collection,
  addDoc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { CommentType, TaskProps, TaskType } from '@/@types';
import { BiSolidLeftArrow } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { generateNewCommnet } from '@/util/factoryFunctions';
import { FaTrash } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const Task = ({ task, session }: TaskProps) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [allComments, setAllComments] = useState<CommentType[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    (async () => {
      const ref = collection(db, 'comments');
      const q = query(
        ref,
        orderBy('created', 'desc'),
        where('taskId', '==', task.id),
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const commentsDb: CommentType[] = [];

        snapshot.forEach((doc) => {
          commentsDb.push({
            id: doc.id as string,
            ...doc.data(),
          } as CommentType);
        });

        setAllComments(commentsDb);
      });
    })();

    return () => unsubscribe();
  }, [task.id]);

  const handleComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newComment: CommentType = generateNewCommnet({
      taskId: task.id,
      image: session.user?.image as string,
      username: session.user?.name as string,
      email: session.user?.email as string,
      comment,
    });

    setLoading(true);
    try {
      const collRef = collection(db, 'comments');
      await addDoc(collRef, newComment);
      toast.success('Comentário realizado com sucesso!');
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setComment('');
    }
  };

  return (
    <>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa</h1>
        <div className={styles.container}>
          <article className={styles.task}>
            <p>{task.task}</p>
          </article>

          <section className={styles.commentBox}>
            <h2>
              {session
                ? 'Deixe um comentário'
                : 'Faça login para deixar um comentário'}
            </h2>
            <form onSubmit={handleSubmit}>
              <Textarea
                placeholder="Digite um comentário..."
                onChange={handleComment}
                value={comment}
              />
              <div className={styles.commentButtonContainer}>
                <button
                  className={styles.commentButton}
                  disabled={!session || !comment || loading}
                >
                  {loading ? 'Enviando' : 'Enviar Comentário'}
                </button>
              </div>
            </form>
          </section>

          <section className={styles.commentBox}>
            <h2>Todos os comentários {`(${allComments.length})`}</h2>

            {allComments.map((comment) => {
              const isCommentMine = comment.email === session.user?.email;

              const seconds = (comment.created as Timestamp).seconds;
              const miliseconds = seconds * 1000;

              const formatedDate = new Date(miliseconds).toLocaleDateString(
                'pt-BR',
              );
              return (
                <article className={styles.comment} key={comment.id}>
                  <Image
                    src={comment.image}
                    alt={`Comentário de ${comment.username}`}
                    width={35}
                    height={35}
                  />

                  <p>
                    <BiSolidLeftArrow
                      size={18}
                      className={styles.commentArrow}
                      color="#5f5f5f"
                    />

                    <span className={styles.commentName}>
                      {comment.username} - {`${formatedDate}`}{' '}
                      {session && isCommentMine && (
                        <>
                          <button
                            id="delete-comment"
                            className={styles.deleteCommentButton}
                          >
                            <FaTrash size={16} color="red" />
                          </button>
                          <Tooltip
                            anchorSelect="#delete-comment"
                            content="Excluir Comentário"
                          />
                        </>
                      )}
                    </span>
                    {comment.comment}
                  </p>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
};

export default Task;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
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

  const session = await getSession({ req });

  const miliseconds = snapshot.data()?.created.seconds * 1000;

  const task: TaskType = {
    id,
    task: snapshot.data()?.task,
    isPublic: snapshot.data()?.isPublic,
    email: snapshot.data()?.email,
    created: new Date(miliseconds).toLocaleDateString('pt-BR'),
  };

  return {
    props: { task, session },
  };
};
