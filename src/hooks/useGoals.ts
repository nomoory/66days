'use client';

import { useState, useCallback } from 'react';
import { Goal, Task } from '@/types';
import { goalsDB } from '@/lib/db';

export function useGoals(nickname: string | null) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const calculateProgress = (tasks: Task[]): number => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const handleTaskComplete = async (goalId: string, taskId: string) => {
    if (!nickname) return;

    setGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal => {
        if (goal.id !== goalId) return goal;

        const updatedMilestones = goal.milestones.map(milestone => {
          const updatedTasks = milestone.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, isCompleted: !task.isCompleted };
            }
            return task;
          });

          const milestoneProgress = calculateProgress(updatedTasks);
          const status = milestoneProgress === 100 ? 'completed' as const :
                        milestoneProgress > 0 ? 'in_progress' as const : 
                        'not_started' as const;

          return {
            ...milestone,
            tasks: updatedTasks,
            status
          };
        });

        const allTasks = updatedMilestones.flatMap(m => m.tasks);
        const overallProgress = calculateProgress(allTasks);

        return {
          ...goal,
          milestones: updatedMilestones,
          progress: overallProgress
        };
      });

      // IndexedDB 업데이트
      updatedGoals.forEach(goal => {
        goalsDB.saveGoal(goal, nickname);
      });

      return updatedGoals;
    });
  };

  const loadGoals = useCallback(async () => {
    if (!nickname) {
      setGoals([]);
      return;
    }

    setLoading(true);
    try {
      const userGoals = await goalsDB.getGoalsByUser(nickname);
      setGoals(userGoals);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [nickname]);

  return { goals, loading, error, handleTaskComplete, loadGoals };
} 