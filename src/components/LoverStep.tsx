import { useState } from 'react';
import { LOVER_OPTIONS } from '../data';

interface Props {
  playerName: string;
  onSubmit: (name: string) => void;
}

export default function LoverStep({ playerName, onSubmit }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);

  const handleSelect = (id: number) => {
    if (showCorrect) return;
    setSelected(id);
    setShowCorrect(true);
    setTimeout(() => {
      const option = LOVER_OPTIONS.find((o) => o.id === id);
      if (option) onSubmit(option.name);
    }, 1800);
  };

  return (
    <div className="step fade-in">
      <div className="step-icon">💑</div>
      <h1 className="step-title">Xin chào, {playerName}!</h1>
      <p className="step-desc">
        Người yêu của bạn thuộc kiểu nào trong 4 kiểu dưới đây?
      </p>
      <div className="options-grid">
        {LOVER_OPTIONS.map((option) => (
          <button
            key={option.id}
            className={`option-card ${selected === option.id ? 'selected' : ''} ${showCorrect ? 'correct' : ''}`}
            onClick={() => handleSelect(option.id)}
            disabled={showCorrect}
          >
            <span className="option-emoji">{option.emoji}</span>
            <span className="option-name">{option.name}</span>
            <span className="option-desc">{option.desc}</span>
            {showCorrect && <span className="correct-badge">Correct!</span>}
          </button>
        ))}
      </div>
      {showCorrect && (
        <p className="correct-message fade-in">
          Tuyệt vời! Đáp án nào cũng đúng vì tình yêu không có công thức!
        </p>
      )}
    </div>
  );
}
