import { Goal } from '@/types';

const DB_NAME = 'GoalsDB';
const DB_VERSION = 1;

interface DBSchema {
  users: {
    key: string; // nickname
    value: {
      nickname: string;
      createdAt: Date;
      lastLoginAt: Date;
    };
  };
  goals: {
    key: string; // goalId
    value: Goal & {
      userNickname: string;
    };
  };
}

class GoalsDB {
  private db: IDBDatabase | null = null;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'nickname' });
        }
        
        if (!db.objectStoreNames.contains('goals')) {
          const goalsStore = db.createObjectStore('goals', { keyPath: 'id' });
          goalsStore.createIndex('userNickname', 'userNickname', { unique: false });
        }
      };
    });
  }

  async saveUser(nickname: string): Promise<void> {
    if (!this.db) await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readwrite');
      const store = transaction.objectStore('users');
      
      const user = {
        nickname,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      const request = store.put(user);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getUser(nickname: string) {
    if (!this.db) await this.connect();
    
    return new Promise<DBSchema['users']['value'] | null>((resolve, reject) => {
      const transaction = this.db!.transaction(['users'], 'readonly');
      const store = transaction.objectStore('users');
      const request = store.get(nickname);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async saveGoal(goal: Goal, userNickname: string): Promise<void> {
    if (!this.db) await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['goals'], 'readwrite');
      const store = transaction.objectStore('goals');
      
      const goalWithUser = {
        ...goal,
        userNickname
      };

      const request = store.put(goalWithUser);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getGoalsByUser(nickname: string): Promise<Goal[]> {
    if (!this.db) await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['goals'], 'readonly');
      const store = transaction.objectStore('goals');
      const index = store.index('userNickname');
      const request = index.getAll(nickname);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const goals = request.result.map(({ ...goal }) => goal);
        resolve(goals);
      };
    });
  }
}

export const goalsDB = new GoalsDB(); 