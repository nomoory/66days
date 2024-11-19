import { ProgressBarProps } from './types';

export function ProgressBar({ value, size = 'md', color = 'blue', className = '' }: ProgressBarProps) {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    // 필요한 색상 추가
  };

  return (
    <div className={`relative w-full ${heights[size]} bg-gray-200 rounded-full ${className}`}>
      <div
        className={`absolute h-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} rounded-full`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}