import { Task } from '@/@types';

export const generateNewTask = (
  task: string,
  email: string,
  isPublic: boolean,
): Task => ({
  task,
  created: new Date(),
  email,
  isPublic,
});
