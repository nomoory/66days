import { ProgressBarProps } from './types';

export function ProgressBar({ value, size = 'md', color = 'blue', className = '' }: ProgressBarProps) {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`relative w-full ${heights[size]} bg-gray-200 rounded-full ${className}`}>
      <div
        className={`absolute h-full bg-${color}-500 rounded-full`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}