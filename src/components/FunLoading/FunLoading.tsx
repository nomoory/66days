import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const messages = [
  { text: "🤔 당신의 목표를 분석하고 있어요...", duration: 3000 },
  { text: "✨ 마법같은 일이 일어나고 있어요", duration: 2500 },
  { text: "🎯 완벽한 계획을 세우고 있어요", duration: 2500 },
  { text: "🌱 작은 시작이 큰 변화를 만들어요", duration: 2500 },
  { text: "💪 함께라면 할 수 있어요!", duration: 2000 }
];

export function FunLoading() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const showNextMessage = (index: number) => {
      if (index < messages.length) {
        timeout = setTimeout(() => {
          setCurrentMessageIndex(index + 1);
          showNextMessage(index + 1);
        }, messages[index].duration);
      }
    };

    showNextMessage(0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 360, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-32 h-32 mb-8 mx-auto"
        >
          <div className="relative w-full h-full">
            {[0, 60, 120, 180, 240, 300].map((degree, i) => (
              <motion.div
                key={i}
                className="absolute top-0 left-0 w-full h-full"
                animate={{
                  rotate: [degree, degree + 360],
                  scale: [1, 0.6, 1], // 원근감을 위한 크기 변화
                  z: [0, -100, 0], // z축 변화로 3D 효과
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  transformOrigin: "center",
                  perspective: "1000px"
                }}
              >
                <span 
                  className="absolute text-3xl" 
                  style={{ 
                    transform: `rotate(${-degree}deg) translateX(3rem)`,
                  }}
                >
                  🏃‍♂️
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="h-8" // 고정 높이로 메시지 위치 안정화
        >
          {currentMessageIndex < messages.length && (
            <p className="text-lg font-medium text-gray-700">
              {messages[currentMessageIndex].text}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
} 