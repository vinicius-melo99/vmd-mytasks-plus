import { CommentType, TaskType } from '@/@types';

export const generateNewTask = (
  task: string,
  email: string,
  isPublic: boolean,
): TaskType => ({
  task,
  created: new Date(),
  email,
  isPublic,
});

export const generateNewCommnet = (
  params: Partial<CommentType>,
): CommentType => ({
  ...(params as CommentType),
  likes: 0,
  updated: new Date(),
  created: new Date(),
});
