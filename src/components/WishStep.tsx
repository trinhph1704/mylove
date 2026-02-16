import { useState } from 'react';

interface Props {
  playerName: string;
  loverName: string;
  onSubmit: (wish: string) => void;
}

const WISH_SUGGESTIONS = [
  'Hay cười', 'Biết nấu ăn', 'Thích du lịch',
  'Lãng mạn', 'Chung thuỷ', 'Hài hước',
];

export default function WishStep({ playerName, loverName, onSubmit }: Props) {
  const [wish, setWish] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wish.trim()) onSubmit(wish.trim());
  };

  const addSuggestion = (suggestion: string) => {
    const separator = wish.trim() ? ', ' : '';
    setWish((prev) => prev.trim() + separator + suggestion);
  };

  return (
    <div className="step fade-in">
      <div className="step-icon">✨</div>
      <h1 className="step-title">Ước nguyện tình yêu</h1>
      <p className="step-desc">
        {playerName} ơi, hãy chia sẻ những điều bạn mong muốn ở
        "{loverName}" của mình nhé!
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="input-field textarea"
          placeholder="Ví dụ: Biết nấu ăn, hay cười, thích du lịch cùng nhau..."
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          rows={3}
          autoFocus
          maxLength={200}
        />
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          justifyContent: 'center',
        }}>
          {WISH_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addSuggestion(s)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              + {s}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!wish.trim()}
        >
          Tiếp tục nào~
        </button>
      </form>
    </div>
  );
}
