import { Timestamp } from 'firebase/firestore';
import { Session } from 'next-auth';

type UserType = {
  email: string;
};

export type TaskType = {
  id?: string;
  task: string;
  created?: Date | string;
  email: string;
  isPublic: boolean;
};

export interface DashboardProps {
  user: UserType;
}

export interface TaskProps {
  task: TaskType;
  session: Session;
}

export type CommentType = {
  id?: string;
  taskId: string;
  image: string;
  username: string;
  email: string;
  comment: string;
  isMine: boolean;
  created: Date | Timestamp;
  updated: Date | Timestamp;
  likes: number;
};
