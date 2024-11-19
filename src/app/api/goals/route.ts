import { NextResponse } from 'next/server';
import { Goal } from '@/types';

const mockGoals: Goal[] = [
  {
    id: "g1",
    title: "프로그래밍 마스터하기",
    description: "1년 동안 웹 개발 실력 향상하기",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    narrative: "프로그래밍은 현대 사회에서 필수적인 기술이 되었습니다. 이 목표를 통해 더 나은 개발자로 성장하고, 창의적인 프로젝트를 만들어낼 수 있습니다.",
    category: "learning",
    progress: 0,
    milestones: [
      {
        id: "m1",
        goalId: "g1",
        title: "기초 다지기",
        period: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-03-31")
        },
        tasks: [
          {
            id: "t1",
            milestoneId: "m1",
            title: "HTML/CSS 마스터하기",
            description: "기본적인 웹 구조와 스타일링 학습",
            dueDate: new Date("2024-01-31"),
            isCompleted: false,
            priority: "high"
          },
          {
            id: "t2",
            milestoneId: "m1",
            title: "JavaScript 기초 학습",
            description: "변수, 함수, 객체 등 기본 개념 이해하기",
            dueDate: new Date("2024-02-15"),
            isCompleted: false,
            priority: "high"
          }
        ],
        status: "in_progress"
      }
    ]
  },
  {
    id: "g2",
    title: "매일 운동하기",
    description: "규칙적인 운동 습관 만들기",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-07"),
    narrative: "건강한 신체에 건강한 정신이 깃든다는 말처럼, 규칙적인 운동은 신체적 건강뿐만 아니라 정신적 건강에도 큰 도움이 됩니다.",
    category: "health",
    progress: 30,
    milestones: [
      {
        id: "m2",
        goalId: "g2",
        title: "기초 체력 기르기",
        period: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-01-31")
        },
        tasks: [
          {
            id: "t3",
            milestoneId: "m2",
            title: "아침 스트레칭 10분",
            description: "기상 직후 전신 스트레칭",
            isCompleted: true,
            priority: "medium"
          },
          {
            id: "t4",
            milestoneId: "m2",
            title: "가벼운 조깅 20분",
            description: "동네 한 바퀴 돌기",
            isCompleted: false,
            priority: "high"
          }
        ],
        status: "in_progress"
      }
    ]
  },
  {
    id: "g3",
    title: "독서 습관 기르기",
    description: "매일 30분 독서하기",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-07"),
    narrative: "독서는 새로운 세계를 발견하고 지식을 쌓는 가장 좋은 방법입니다. 하루 30분의 독서로 더 넓은 시야를 가질 수 있습니다.",
    category: "hobby",
    progress: 60,
    milestones: [
      {
        id: "m3",
        goalId: "g3",
        title: "독서 루틴 만들기",
        period: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-01-31")
        },
        tasks: [
          {
            id: "t5",
            milestoneId: "m3",
            title: "독서 시간 정하기",
            description: "매일 저녁 9시 독서",
            isCompleted: true,
            priority: "high"
          },
          {
            id: "t6",
            milestoneId: "m3",
            title: "독서 노트 작성하기",
            description: "인상 깊은 구절과 생각 기록",
            isCompleted: true,
            priority: "medium"
          }
        ],
        status: "completed"
      }
    ]
  }
];

export async function GET() {
  return NextResponse.json(mockGoals);
} 