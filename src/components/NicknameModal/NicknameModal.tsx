import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nickname: string) => void;
}

export function NicknameModal({ isOpen, onClose, onSubmit }: NicknameModalProps) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nickname.trim().length < 2) {
      setError('닉네임은 2글자 이상이어야 합니다');
      return;
    }
    
    onSubmit(nickname.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4">환영합니다! 👋</h2>
            <p className="text-gray-600 mb-6">
              66일의 여정을 함께할 당신의 이름을 알려주세요
            </p>
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError('');
                }}
                placeholder="닉네임을 입력해주세요"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition-all duration-200"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50
                           transition-colors duration-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg
                           hover:bg-blue-600 transition-colors duration-200"
                >
                  시작하기
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 