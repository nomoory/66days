import { NextResponse } from 'next/server';
import axios from 'axios';

interface RequestBody {
  prompt: string;
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Next.js API 라우트 핸들러 이름을 route.ts에 맞게 변경
export async function POST(request: Request) {
  try {
    // request body 파싱
    const body = await request.json() as RequestBody;
    const userInput = body.prompt;

    const messages: Message[] = [
      {
        role: 'system',
        content: `
# Instructions
- You are a task divide and conquer expert. User will give you a goal and you will break it down into smaller tasks.
- The target duration is 66 days. you have to divide the task into 66 days and come up with a plan.
- User can give simple task and complex task. You have to come up with a every plan.
- Output should be in JSON format. YOU MUST FOLLOW THIS FORMAT and Data type like string, integer, boolean, array, object.
- JSON MUST BE VALID AND FOLLOW TYPESCRIPT CODE BELOW.
- Make a json file following typescript code below.
- Return json file only without any explanation or \`\`\`json
- Answer in user's language.

# Typescript Code

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
goal: Omit<Goal, 'id' | 'progress'>;`
      }
    ];
    
    messages.push({ role: 'user', content: userInput });

    // OpenAI API 호출 설정
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    const payload = {
      model: 'gpt-4o-mini', // 모델명 수정
      temperature: 0.3,
      messages,
      response_format: { type: "json_object" } // JSON 응답 형식 지정
    };

    // API 요청 보내기
    const response = await axios.post<OpenAIResponse>(url, payload, { headers });
    console.log({response});
    let output = response.data.choices[0].message.content;
    
    if (output.startsWith('```json')) {
      output = output.slice(7, -3);
    }
    
    const parsedOutput = JSON.parse(output);

    return NextResponse.json(parsedOutput);

  } catch (error: unknown) {
    console.error('Error:', error instanceof Error ? error.message : '알 수 없는 오류', 
                           error instanceof Error ? error.stack : '');
    return NextResponse.json(
      { error: '내부 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}