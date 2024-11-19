export interface Goal {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  narrative: string;  // GPT가 생성한 동기부여 내러티브
  category: GoalCategory;  // 목표 카테고리 (예: 건강, 학습, 취미 등)
  progress: number;  // 전체 진행률 (0-100)
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  period: Period;
  tasks: Task[];
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Task {
  id: string;
  milestoneId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  isCompleted: boolean;
  priority: 'high' | 'medium' | 'low';
  dependsOn?: string[];  // 다른 태스크 ID 배열 (순서 의존성)
}

export interface Period {
  startDate: Date;
  endDate: Date;
}

export type GoalCategory = 
  | 'health'
  | 'learning'
  | 'career'
  | 'hobby'
  | 'relationship'
  | 'finance'
  | 'other';

// GPT API 응답 타입
export interface GPTResponse {
  goal: Omit<Goal, 'id' | 'progress'>;
}
