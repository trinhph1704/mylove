import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  emoji: string;
  delay: number;
  duration: number;
  size: number;
}

const EMOJIS = ['💖', '✨', '🌟', '💕', '❤️', '💗', '⭐', '🎉', '🎊', '💝', '🥰', '💐'];

export default function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const items: Particle[] = [];
    for (let i = 0; i < 35; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        delay: Math.random() * 2.5,
        duration: 2.5 + Math.random() * 3,
        size: 14 + Math.random() * 14,
      });
    }
    setParticles(items);
  }, []);

  return (
    <div className="confetti">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
