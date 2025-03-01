type UserType = {
  email: string;
};

export type Task = {
  task: string;
  created?: Date;
  email: string;
  isPublic: boolean;
};

export interface DashboardProps {
  user: UserType;
}
