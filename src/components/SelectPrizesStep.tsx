import { useState } from 'react';
import { ALL_PRIZES, Prize } from '../data';

interface Props {
  onSubmit: (prizes: Prize[]) => void;
}

export default function SelectPrizesStep({ onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const togglePrize = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else if (next.size < 11) {
      next.add(id);
    }
    setSelected(next);
  };

  const handleSubmit = () => {
    const prizes = ALL_PRIZES.filter((p) => selected.has(p.id));
    onSubmit(prizes);
  };

  const remaining = 11 - selected.size;

  return (
    <div className="step fade-in prize-step">
      <div className="step-icon" style={{ fontSize: '48px' }}>🎰</div>
      <h1 className="step-title" style={{ fontSize: '22px' }}>
        Điều kiện vào trò chơi
      </h1>
      <p className="step-desc" style={{ fontSize: '15px', margin: 0 }}>
        Chọn <strong>11 phần quà</strong> bạn muốn trong vòng quay
      </p>
      <div className="prize-counter">
        <span className={selected.size === 11 ? 'counter-full' : ''}>
          {selected.size}/11
        </span>
      </div>
      <div className="prizes-grid">
        {ALL_PRIZES.map((prize) => (
          <button
            key={prize.id}
            className={`prize-card ${selected.has(prize.id) ? 'prize-selected' : ''} ${
              selected.size >= 11 && !selected.has(prize.id) ? 'prize-disabled' : ''
            }`}
            onClick={() => togglePrize(prize.id)}
          >
            <span className="prize-emoji">{prize.emoji}</span>
            <span className="prize-name">{prize.name}</span>
            {selected.has(prize.id) && <span className="prize-check">✓</span>}
          </button>
        ))}
      </div>
      <button
        className="btn btn-primary btn-sticky"
        disabled={selected.size !== 11}
        onClick={handleSubmit}
      >
        {selected.size === 11
          ? 'Vào trò chơi!'
          : `Còn thiếu ${remaining} phần quà`}
      </button>
    </div>
  );
}
