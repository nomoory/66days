import { Goal, Milestone } from '@/types';
import { GoalCardProps } from './types';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { TaskList } from '../TaskList/TaskList';

export function GoalCard({ goal, onEdit, onDelete, className = '' }: GoalCardProps) {
  const currentMilestone = goal.milestones.find((m: Milestone) => m.status === 'in_progress');
  
  return (
    <div className={`p-4 border rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{goal.title}</h3>
          <p className="text-sm text-gray-600">{goal.description}</p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(goal)}
              aria-label="목표 수정"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              aria-label="목표 삭제"
            >
              삭제
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">진행률</span>
          <span className="text-sm">{goal.progress}%</span>
        </div>
        <ProgressBar value={goal.progress} />
      </div>

      {currentMilestone && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">현재 마일스톤: {currentMilestone.title}</h4>
          <TaskList 
            tasks={currentMilestone.tasks}
            onTaskComplete={(taskId) => {
              // 태스크 완료 처리 로직은 상위 컴포넌트에서 처리
              console.log('Task completed:', taskId);
            }}
          />
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm italic">{goal.narrative}</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(goal.category)}`}>
          {goal.category}
        </span>
        <span className="text-xs text-gray-500">
          {formatDateRange(goal.startDate, goal.endDate)}
        </span>
      </div>
    </div>
  );
}

function getCategoryColor(category: Goal['category']): string {
  const colors = {
    health: 'bg-green-100 text-green-800',
    learning: 'bg-blue-100 text-blue-800',
    career: 'bg-purple-100 text-purple-800',
    hobby: 'bg-yellow-100 text-yellow-800',
    relationship: 'bg-pink-100 text-pink-800',
    finance: 'bg-indigo-100 text-indigo-800',
    other: 'bg-gray-100 text-gray-800',
  };
  
  return colors[category];
}

const formatDateRange = (start: string | Date, end: string | Date) => {
  // 문자열이나 타임스탬프를 Date 객체로 변환
  const startDate = new Date(start);
  const endDate = new Date(end);

  // 유효한 날짜인지 확인
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return '날짜 형식이 잘못되었습니다';
  }

  return `${startDate.toLocaleDateString('ko-KR')} - ${endDate.toLocaleDateString('ko-KR')}`;
}; 