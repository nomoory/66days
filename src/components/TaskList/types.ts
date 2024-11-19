export interface TaskListProps {
  tasks: Task[];
  onTaskComplete?: (taskId: string) => void;
  onTaskUpdate?: (task: Task) => void;
  className?: string;
} 