'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoalCard } from '@/components/GoalCard/GoalCard';
import { useGoals } from '@/hooks/useGoals';
import { NicknameModal } from '@/components/NicknameModal/NicknameModal';
import { FunLoading } from '@/components/FunLoading/FunLoading';
import { goalsDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { Goal } from '@/types';

export default function Home() {
  const searchParams = useSearchParams();
  const [nickname, setNickname] = useState<string | null>(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const { goals, loading, error, handleTaskComplete, loadGoals } = useGoals(nickname);
  const [newGoal, setNewGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      const urlNickname = searchParams.get('nickname');
      if (urlNickname) {
        const user = await goalsDB.getUser(urlNickname);
        if (user) {
          setNickname(urlNickname);
        } else {
          setShowNicknameModal(true);
        }
      } else {
        setShowNicknameModal(true);
      }
    };

    initUser();
  }, [searchParams]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleNicknameSubmit = async (newNickname: string) => {
    await goalsDB.saveUser(newNickname);
    setNickname(newNickname);
    setShowNicknameModal(false);
  };

  const handleCreateGoal = async () => {
    if (!nickname || !newGoal.trim()) return;

    setIsGenerating(true);
    try {
      // GPT API 호출 경로를 route 변경
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: newGoal
        }),
      });

      if (!response.ok) throw new Error('Failed to generate goal plan');
      
      const data = await response.json();
      
      // 새 목표 생성
      const newGoalData: Goal = {
        id: uuidv4(),
        ...data.goal,
        progress: 0
      };

      // IndexedDB에 저장
      await goalsDB.saveGoal(newGoalData, nickname);
      
      // 목표 목록 새로고침
      await loadGoals();
      
      // 입력창 초기화
      setNewGoal('');
      
    } catch (error) {
      console.error('Error creating goal:', error);
      // TODO: 에러 처리
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-lg font-medium">로딩 중...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-red-500">에러가 발생했습니다: {error.message}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <NicknameModal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
        onSubmit={handleNicknameSubmit}
      />
      
      {isGenerating && <FunLoading />}

      {/* 헤더 섹션 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">66일의 여정</h1>
            {nickname ? (
              <span className="text-lg text-gray-600">
                {nickname}님의 목표 달성을 응원합니다! 🎉
              </span>
            ) : (
              <button
                onClick={() => setShowNicknameModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg
                         hover:bg-blue-600 transition-colors duration-200"
              >
                시작하기
              </button>
            )}
          </div>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            작은 습관이 모여 큰 변화를 만듭니다. 66일 동안의 꾸준한 실천으로 당신의 목표를 이루어보세요.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 목표 입력 섹션 */}
        <div className="max-w-3xl mx-auto mb-16 bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            새로운 목표 설정하기
          </h2>
          <div className="relative">
            <textarea
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="예) 매일 30분씩 영어 공부하기"
              className="w-full p-4 border rounded-xl shadow-sm min-h-[120px] resize-none
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       text-lg placeholder-gray-400"
            />
            <button
              onClick={handleCreateGoal}
              className="absolute bottom-4 right-4 bg-blue-600 text-white px-6 py-2 rounded-full
                       hover:bg-blue-700 transition-colors duration-200 font-medium
                       shadow-sm hover:shadow-md"
            >
              시작하기
            </button>
          </div>
        </div>

        {/* 목표 리스트 섹션 */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">진행 중인 목표</h3>
            <div className="flex gap-2">
              <select className="px-3 py-2 border rounded-lg text-sm">
                <option>최신순</option>
                <option>진행률순</option>
              </select>
              <select className="px-3 py-2 border rounded-lg text-sm">
                <option>전체 카테고리</option>
                <option>건강</option>
                <option>학습</option>
                <option>취미</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6">
            {goals.map(goal => (
              <div key={goal.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <GoalCard 
                  goal={goal}
                  onEdit={(goal) => console.log('Edit goal:', goal)}
                  onDelete={(goalId) => console.log('Delete goal:', goalId)}
                />
                
                <div className="border-t">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold mb-4 text-gray-900">마일스톤</h4>
                    <div className="space-y-6">
                      {goal.milestones.map(milestone => (
                        <div key={milestone.id} 
                          className="pl-4 border-l-2 border-gray-200 hover:border-blue-500 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                              milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                              milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {milestone.status === 'completed' ? '완료' :
                               milestone.status === 'in_progress' ? '진행 중' :
                               '시작 전'}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            {milestone.tasks.map(task => (
                              <div key={task.id} 
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={task.isCompleted}
                                  onChange={() => handleTaskComplete(goal.id, task.id)}
                                  className="mt-1.5 h-4 w-4 rounded border-gray-300 
                                           text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{task.title}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                  {task.description && (
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
