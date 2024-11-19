import { TaskListProps } from './types';

export function TaskList({ tasks, onTaskComplete, onTaskUpdate, className = '' }: TaskListProps) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {tasks.map(task => (
        <li 
          key={task.id}
          className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
        >
          <div className="relative">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => onTaskComplete?.(task.id)}
              className="peer h-5 w-5 rounded-lg border-2 border-gray-300 
                       checked:border-blue-500 checked:bg-blue-500
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       transition-all duration-200"
            />
            <svg
              className="absolute top-1 left-1 h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 4.5L6.5 11.5L3 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`font-medium transition-colors duration-200
                ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {task.title}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium 
                ${task.priority === 'high' 
                  ? 'bg-red-50 text-red-600' 
                  : task.priority === 'medium'
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'bg-green-50 text-green-600'
                }`}>
                {task.priority === 'high' ? '높음' : 
                 task.priority === 'medium' ? '중간' : '낮음'}
              </span>
            </div>
            {task.description && (
              <p className={`text-sm mt-0.5 transition-colors duration-200
                ${task.isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            {task.dueDate && (
              <p className="text-xs text-gray-500 mt-1">
                마감일: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onTaskUpdate?.(task)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
} 