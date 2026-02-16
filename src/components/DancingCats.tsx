import { useEffect, useState } from 'react';

interface CatConfig {
  id: number;
  emoji: string;
  size: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  direction: 'left' | 'right';
  color: string;
}

const CAT_EMOJIS = ['🐱', '😺', '😸', '😻', '🐈', '😽', '😹', '🐾'];

const CAT_COLORS = [
  '#FFB6C1', // pink
  '#FFD700', // gold
  '#87CEEB', // sky blue
  '#DDA0DD', // plum
  '#98FB98', // pale green
  '#FFA07A', // light salmon
  '#F0E68C', // khaki
  '#FF69B4', // hot pink
];

function generateCats(count: number): CatConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: CAT_EMOJIS[i % CAT_EMOJIS.length],
    size: 28 + Math.random() * 24,
    startX: Math.random() * 100,
    startY: 10 + Math.random() * 80,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * -20,
    direction: Math.random() > 0.5 ? 'left' : 'right' as const,
    color: CAT_COLORS[i % CAT_COLORS.length],
  }));
}

export default function DancingCats() {
  const [cats] = useState<CatConfig[]>(() => generateCats(10));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="dancing-cats-container">
      {cats.map((cat) => (
        <div
          key={cat.id}
          className={`dancing-cat dancing-cat-${cat.direction}`}
          style={{
            '--cat-start-y': `${cat.startY}%`,
            '--cat-size': `${cat.size}px`,
            '--cat-duration': `${cat.duration}s`,
            '--cat-delay': `${cat.delay}s`,
            '--cat-color': cat.color,
          } as React.CSSProperties}
        >
          <div className="cat-body">
            <span className="cat-emoji">{cat.emoji}</span>
            <div className="cat-shadow" />
          </div>
        </div>
      ))}

      {/* Mèo khuẩn đặc biệt ở dưới cùng - nhảy tại chỗ */}
      <div className="dancing-cats-floor">
        {['😺', '😸', '🐱', '😻', '😽'].map((emoji, i) => (
          <div
            key={`floor-${i}`}
            className="floor-cat"
            style={{
              '--floor-delay': `${i * 0.15}s`,
              '--floor-size': `${32 + Math.random() * 12}px`,
            } as React.CSSProperties}
          >
            <span className="floor-cat-emoji">{emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
