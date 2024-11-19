import { Task } from '@/types';

export interface TaskListProps {
  tasks: Task[];
  onTaskComplete?: (taskId: string) => void;
  onTaskUpdate?: (task: Task) => void;
  className?: string;
} 