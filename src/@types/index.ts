type UserType = {
  email: string;
};

export type Task = {
  id?: string;
  task: string;
  created?: Date;
  email: string;
  isPublic: boolean;
};

export interface DashboardProps {
  user: UserType;
}
