import { ProgressBarProps } from './types';

export function ProgressBar({ value, size = 'md', color, className }: ProgressBarProps) {
  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-full">
      <div
        className="absolute h-full bg-blue-500 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
} 